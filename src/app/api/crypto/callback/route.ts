import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/crypto/callback - 支付回调（区块链监听服务调用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      txHash,
      fromAddress,
      toAddress,
      amount,
      currencyCode,
      blockNumber,
      confirmations,
    } = body;

    // 验证必要参数
    if (!txHash || !toAddress || !amount || !currencyCode) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 获取货币信息
    const { data: currency, error: currencyError } = await client
      .from('crypto_currencies')
      .select('*')
      .eq('code', currencyCode)
      .single();

    if (currencyError || !currency) {
      return NextResponse.json(
        { error: '不支持的货币类型' },
        { status: 400 }
      );
    }

    // 检查交易是否已处理
    const { data: existingTx } = await client
      .from('crypto_transactions')
      .select('*')
      .eq('tx_hash', txHash)
      .single();

    if (existingTx) {
      return NextResponse.json({
        success: true,
        message: '交易已处理',
        data: { txId: existingTx.id },
      });
    }

    // 查找匹配的待支付订单
    const { data: order, error: orderError } = await client
      .from('crypto_payments')
      .select('*')
      .eq('to_address', toAddress)
      .eq('currency_id', currency.id)
      .eq('status', 'pending')
      .gte('expired_at', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (orderError || !order) {
      // 没有匹配的订单，记录为未匹配交易
      await client
        .from('crypto_transactions')
        .insert({
          tx_hash: txHash,
          currency_id: currency.id,
          type: 'deposit',
          amount: amount,
          from_address: fromAddress,
          to_address: toAddress,
          block_number: blockNumber,
          confirmations: confirmations || 1,
          status: 'confirmed',
          processed_at: new Date().toISOString(),
          metadata: { unmatched: true },
        });

      return NextResponse.json({
        success: true,
        message: '未匹配到订单，已记录',
      });
    }

    // 开始处理订单
    const isConfirmed = (confirmations || 0) >= currency.min_confirmations;

    // 创建交易记录
    await client
      .from('crypto_transactions')
      .insert({
        tx_hash: txHash,
        currency_id: currency.id,
        wallet_id: order.wallet_id,
        payment_id: order.id,
        type: 'deposit',
        amount: amount,
        from_address: fromAddress,
        to_address: toAddress,
        block_number: blockNumber,
        confirmations: confirmations || 1,
        status: isConfirmed ? 'confirmed' : 'pending',
        processed_at: isConfirmed ? new Date().toISOString() : null,
      });

    // 更新订单状态
    const updateData: Record<string, unknown> = {
      from_address: fromAddress,
      tx_hash: txHash,
      confirmations: confirmations || 1,
    };

    if (order.paid_at === null) {
      updateData.paid_at = new Date().toISOString();
    }

    if (isConfirmed) {
      updateData.status = 'confirmed';
      updateData.confirmed_at = new Date().toISOString();

      // 发放奖励
      if (order.type === 'coin' && order.coin_amount > 0) {
        // 获取用户金币余额
        const { data: coinBalance } = await client
          .from('coin_balances')
          .select('*')
          .eq('user_id', order.user_id)
          .single();

        if (coinBalance) {
          // 更新金币余额
          await client
            .from('coin_balances')
            .update({
              balance: coinBalance.balance + order.coin_amount,
              total_earned: coinBalance.total_earned + order.coin_amount,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', order.user_id);

          // 记录金币交易
          await client
            .from('coin_transactions')
            .insert({
              user_id: order.user_id,
              type: 'recharge',
              amount: order.coin_amount,
              balance_after: coinBalance.balance + order.coin_amount,
              description: `加密货币充值 (${currencyCode})`,
              reference_type: 'crypto_payment',
              reference_id: order.id,
            });
        }
      } else if (order.type === 'vip' && order.vip_days > 0) {
        // 处理VIP开通
        const { data: membership } = await client
          .from('memberships')
          .select('*')
          .eq('user_id', order.user_id)
          .eq('status', 'active')
          .single();

        const now = new Date();
        let expiresAt = new Date();

        if (membership) {
          // 续期
          expiresAt = new Date(membership.expires_at);
          if (expiresAt < now) {
            expiresAt = now;
          }
        }

        if (order.vip_days === -1) {
          // 永久会员
          expiresAt = new Date('2099-12-31');
        } else {
          expiresAt.setDate(expiresAt.getDate() + order.vip_days);
        }

        if (membership) {
          await client
            .from('memberships')
            .update({
              expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', membership.id);
        } else {
          await client
            .from('memberships')
            .insert({
              user_id: order.user_id,
              plan_type: order.vip_days === -1 ? 'lifetime' : 'custom',
              status: 'active',
              started_at: now.toISOString(),
              expires_at: expiresAt.toISOString(),
            });
        }

        // 更新用户角色
        await client
          .from('users')
          .update({ role: 'vip', updated_at: new Date().toISOString() })
          .eq('id', order.user_id);
      }
    } else {
      updateData.status = 'paid';
    }

    await client
      .from('crypto_payments')
      .update(updateData)
      .eq('id', order.id);

    return NextResponse.json({
      success: true,
      message: isConfirmed ? '订单已完成' : '等待确认',
      data: {
        orderId: order.id,
        orderNo: order.order_no,
        status: updateData.status,
        confirmations: confirmations || 1,
        requiredConfirmations: currency.min_confirmations,
      },
    });
  } catch (error) {
    console.error('支付回调处理失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
