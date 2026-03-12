import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 生成订单号
function generateOrderNo(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CP${timestamp}${random}`;
}

// GET /api/crypto/payment - 获取用户支付订单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    // 在实际应用中，从 session 获取用户ID
    const userId = request.headers.get('x-user-id') || '1';
    
    const client = getSupabaseClient();

    let query = client
      .from('crypto_payments')
      .select(`
        *,
        currency:crypto_currencies(id, code, name, symbol, icon)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('获取订单列表失败:', error);
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.map((order) => ({
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
      })),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
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

// POST /api/crypto/payment - 创建加密货币支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      type, // 'coins' or 'vip'
      currencyCode, // 'USDT', 'BTC', 'ETH', etc.
    } = body;

    // 在实际应用中，从 session 获取用户ID
    const userId = request.headers.get('x-user-id') || '1';
    
    const client = getSupabaseClient();

    // 获取货币信息
    const { data: currency, error: currencyError } = await client
      .from('crypto_currencies')
      .select('*')
      .eq('code', currencyCode)
      .eq('is_active', true)
      .single();

    if (currencyError || !currency) {
      return NextResponse.json(
        { error: '不支持的货币类型' },
        { status: 400 }
      );
    }

    // 获取收款钱包
    const { data: wallet, error: walletError } = await client
      .from('crypto_wallets')
      .select('*')
      .eq('currency_id', currency.id)
      .eq('is_active', true)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json(
        { error: '支付钱包暂时不可用' },
        { status: 400 }
      );
    }

    let orderData: Record<string, unknown> = {
      order_no: generateOrderNo(),
      user_id: parseInt(userId),
      currency_id: currency.id,
      wallet_id: wallet.id,
      rate: currency.usd_rate,
      to_address: wallet.address,
      status: 'pending',
    };

    if (type === 'vip') {
      // VIP套餐
      const { data: pkg, error: pkgError } = await client
        .from('crypto_vip_packages')
        .select('*')
        .eq('id', packageId)
        .eq('status', 'active')
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json(
          { error: '套餐不存在' },
          { status: 400 }
        );
      }

      orderData = {
        ...orderData,
        type: 'vip',
        amount: pkg.crypto_amount,
        usd_amount: pkg.usd_amount,
        vip_days: pkg.duration,
        coin_amount: 0,
      };
    } else {
      // 金币套餐
      const { data: pkg, error: pkgError } = await client
        .from('crypto_recharge_packages')
        .select('*')
        .eq('id', packageId)
        .eq('status', 'active')
        .single();

      if (pkgError || !pkg) {
        return NextResponse.json(
          { error: '套餐不存在' },
          { status: 400 }
        );
      }

      orderData = {
        ...orderData,
        type: 'coin',
        amount: pkg.crypto_amount,
        usd_amount: pkg.usd_amount,
        coin_amount: pkg.coins + (pkg.bonus || 0),
        vip_days: 0,
      };
    }

    // 设置过期时间（30分钟后）
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 30);
    orderData.expired_at = expiredAt.toISOString();

    // 创建订单
    const { data: order, error: orderError } = await client
      .from('crypto_payments')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('创建订单失败:', orderError);
      return NextResponse.json(
        { error: '创建订单失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNo: order.order_no,
        amount: order.amount,
        usdAmount: order.usd_amount,
        coinAmount: order.coin_amount,
        vipDays: order.vip_days,
        rate: order.rate,
        toAddress: order.to_address,
        currency: {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol,
          network: currency.network,
        },
        expiredAt: order.expired_at,
        createdAt: order.created_at,
        // 支付二维码数据（实际应用中生成二维码）
        qrData: `${currency.code.toLowerCase()}:${wallet.address}?amount=${order.amount}`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
