import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/user - 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    // 在实际应用中，这里应该从 session 或 token 中获取用户ID
    // 这里使用 mock 数据演示
    const userId = request.headers.get('x-user-id') || '1';
    
    const client = getSupabaseClient();

    // 获取用户信息
    const { data: user, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取用户资料
    const { data: profile } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 获取用户设置
    const { data: settings } = await client
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 获取会员信息
    const { data: membership } = await client
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // 获取金币余额
    const { data: coinBalance } = await client
      .from('coin_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    return NextResponse.json({
      user: {
        ...user,
        profile,
        settings,
        membership,
        coinBalance,
      },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// PUT /api/user - 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.headers.get('x-user-id') || '1';
    
    const client = getSupabaseClient();

    const { nickname, bio, gender, birthday, phone, location } = body;

    // 更新用户资料
    const { data, error } = await client
      .from('user_profiles')
      .upsert({
        user_id: parseInt(userId),
        nickname,
        bio,
        gender,
        birthday,
        phone,
        location,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('更新用户资料失败:', error);
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
