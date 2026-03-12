import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/movies - 获取影视列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'latest';

    const client = getSupabaseClient();

    let query = client
      .from('movies')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // 类型筛选
    if (type !== 'all') {
      query = query.eq('type', type);
    }

    // 排序
    switch (sort) {
      case 'hot':
        query = query.order('views', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'latest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('获取影视列表失败:', error);
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
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

// POST /api/movies - 创建影视（管理员）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = getSupabaseClient();

    const {
      title,
      original_title,
      type,
      description,
      poster,
      backdrop,
      trailer,
      release_year,
      duration,
      is_vip_only,
      coin_price,
      tags,
      categories,
      actors,
      directors,
      source,
      source_url,
    } = body;

    // 验证必填字段
    if (!title || !type) {
      return NextResponse.json(
        { error: '标题和类型为必填项' },
        { status: 400 }
      );
    }

    const { data, error } = await client
      .from('movies')
      .insert({
        title,
        original_title,
        type,
        description,
        poster,
        backdrop,
        trailer,
        release_year,
        duration,
        is_vip_only: is_vip_only || false,
        coin_price: coin_price || 0,
        tags: tags || [],
        categories: categories || [],
        actors: actors || [],
        directors: directors || [],
        source,
        source_url,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('创建影视失败:', error);
      return NextResponse.json(
        { error: '创建失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
