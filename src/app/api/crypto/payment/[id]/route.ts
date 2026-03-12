import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/crypto/payment/[id] - 查询支付订单状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    // 支持通过订单号或订单ID查询
    const isOrderNo = id.startsWith('CP');
    
    let query = client
      .from('crypto_payments')
      .select(`
        *,
        currency:crypto_currencies(id, code, name, symbol, icon, network),
        wallet:crypto_wallets(address, network)
      `);

    if (isOrderNo) {
      query = query.eq('order_no', id);
    } else {
      query = query.eq('id', parseInt(id));
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 检查是否过期
    if (order.status === 'pending' && new Date(order.expired_at) < new Date()) {
      // 更新订单状态为过期
      await client
        .from('crypto_payments')
        .update({ status: 'expired' })
        .eq('id', order.id);
      
      order.status = 'expired';
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNo: order.order_no,
        type: order.type,
        amount: order.amount,
        usdAmount: order.usd_amount,
        coinAmount: order.coin_amount,
        vipDays: order.vip_days,
        rate: order.rate,
        toAddress: order.to_address,
        fromAddress: order.from_address,
        txHash: order.tx_hash,
        status: order.status,
        confirmations: order.confirmations,
        paidAt: order.paid_at,
        confirmedAt: order.confirmed_at,
        expiredAt: order.expired_at,
        createdAt: order.created_at,
        currency: order.currency,
        wallet: order.wallet,
      },
    });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// PUT /api/crypto/payment/[id] - 取消订单
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    // 获取订单
    const { data: order, error: fetchError } = await client
      .from('crypto_payments')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }

    // 只能取消待支付的订单
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: '该订单无法取消' },
        { status: 400 }
      );
    }

    // 更新订单状态
    const { error: updateError } = await client
      .from('crypto_payments')
      .update({ status: 'cancelled' })
      .eq('id', order.id);

    if (updateError) {
      console.error('取消订单失败:', updateError);
      return NextResponse.json(
        { error: '取消失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '订单已取消',
    });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
