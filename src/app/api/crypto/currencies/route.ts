import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/crypto/currencies - 获取支持的加密货币列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('crypto_currencies')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('获取加密货币列表失败:', error);
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.map((currency) => ({
        id: currency.id,
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        network: currency.network,
        decimals: currency.decimals,
        icon: currency.icon,
        usdRate: currency.usd_rate,
        minDeposit: currency.min_deposit,
        minWithdraw: currency.min_withdraw,
        withdrawFee: currency.withdraw_fee,
      })),
    });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
