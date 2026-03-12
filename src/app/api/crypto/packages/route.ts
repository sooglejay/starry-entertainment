import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/crypto/packages - 获取加密货币充值套餐
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'coins'; // coins or vip
    const currencyCode = searchParams.get('currency') || 'USDT';

    const client = getSupabaseClient();

    // 获取货币ID
    const { data: currency } = await client
      .from('crypto_currencies')
      .select('id')
      .eq('code', currencyCode)
      .eq('is_active', true)
      .single();

    if (!currency) {
      return NextResponse.json(
        { error: '不支持的货币类型' },
        { status: 400 }
      );
    }

    if (type === 'vip') {
      // VIP套餐
      const { data, error } = await client
        .from('crypto_vip_packages')
        .select(`
          *,
          currency:crypto_currencies(id, code, name, symbol, icon, usd_rate)
        `)
        .eq('currency_id', currency.id)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('获取VIP套餐失败:', error);
        return NextResponse.json(
          { error: '获取数据失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        type: 'vip',
        data: data.map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          duration: pkg.duration,
          durationText: pkg.duration === -1 ? '永久' : `${pkg.duration}天`,
          cryptoAmount: pkg.crypto_amount,
          usdAmount: pkg.usd_amount,
          originalUsdAmount: pkg.original_usd_amount,
          features: pkg.features,
          discount: pkg.discount,
          isPopular: pkg.is_popular,
          currency: pkg.currency,
        })),
      });
    } else {
      // 金币充值套餐
      const { data, error } = await client
        .from('crypto_recharge_packages')
        .select(`
          *,
          currency:crypto_currencies(id, code, name, symbol, icon, usd_rate)
        `)
        .eq('currency_id', currency.id)
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('获取充值套餐失败:', error);
        return NextResponse.json(
          { error: '获取数据失败' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        type: 'coins',
        data: data.map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          coins: pkg.coins,
          cryptoAmount: pkg.crypto_amount,
          usdAmount: pkg.usd_amount,
          bonus: pkg.bonus,
          discount: pkg.discount,
          isPopular: pkg.is_popular,
          currency: pkg.currency,
        })),
      });
    }
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
