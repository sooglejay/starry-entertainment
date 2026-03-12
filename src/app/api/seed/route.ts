import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// POST /api/seed - 初始化示例数据
export async function POST(request: NextRequest) {
  try {
    const client = getSupabaseClient();

    // 创建示例电影
    const movies = [
      {
        title: '星际穿越',
        original_title: 'Interstellar',
        type: 'movie',
        description: '在不久的未来，地球面临着严重的环境危机。前NASA宇航员库珀被选中执行一项穿越星际的任务，寻找人类新的家园。',
        poster: 'https://picsum.photos/seed/interstellar/300/450',
        backdrop: 'https://picsum.photos/seed/interstellar-bg/1920/1080',
        release_year: 2014,
        duration: 169,
        rating: '9.4',
        is_vip_only: false,
        tags: ['科幻', '冒险', '剧情'],
        categories: ['科幻电影', '太空探索'],
        actors: [{ name: '马修·麦康纳', role: '库珀' }, { name: '安妮·海瑟薇', role: '布兰德' }],
        directors: [{ name: '克里斯托弗·诺兰' }],
      },
      {
        title: '盗梦空间',
        original_title: 'Inception',
        type: 'movie',
        description: '道姆·柯布是一名技艺高超的盗贼，专门在目标睡眠时潜入其梦境，窃取潜意识中有价值的秘密。',
        poster: 'https://picsum.photos/seed/inception/300/450',
        backdrop: 'https://picsum.photos/seed/inception-bg/1920/1080',
        release_year: 2010,
        duration: 148,
        rating: '9.3',
        is_vip_only: false,
        tags: ['科幻', '悬疑', '动作'],
        categories: ['科幻电影', '心理悬疑'],
        actors: [{ name: '莱昂纳多·迪卡普里奥', role: '柯布' }, { name: '玛丽昂·歌迪亚', role: '梅尔' }],
        directors: [{ name: '克里斯托弗·诺兰' }],
      },
      {
        title: '进击的巨人',
        original_title: 'Attack on Titan',
        type: 'anime',
        description: '人类生活在三层巨大的墙壁之内，以躲避巨人的威胁。少年艾伦目睹母亲被巨人吞噬后，发誓要消灭所有巨人。',
        poster: 'https://picsum.photos/seed/aot/300/450',
        backdrop: 'https://picsum.photos/seed/aot-bg/1920/1080',
        release_year: 2013,
        duration: 24,
        rating: '9.2',
        is_vip_only: true,
        tags: ['热血', '冒险', '奇幻'],
        categories: ['日本动漫', '热血番'],
        actors: [{ name: '梶裕贵', role: '艾伦' }, { name: '石川由依', role: '三笠' }],
        directors: [{ name: '肥冢正史' }],
      },
      {
        title: '权力的游戏',
        original_title: 'Game of Thrones',
        type: 'tv_series',
        description: '在虚构的维斯特洛大陆上，七个王国为了争夺铁王座展开了残酷的权力斗争。',
        poster: 'https://picsum.photos/seed/got/300/450',
        backdrop: 'https://picsum.photos/seed/got-bg/1920/1080',
        release_year: 2011,
        duration: 60,
        rating: '9.1',
        is_vip_only: false,
        tags: ['奇幻', '剧情', '战争'],
        categories: ['美剧', '奇幻剧'],
        actors: [{ name: '艾米莉亚·克拉克', role: '丹妮莉丝' }, { name: '基特·哈灵顿', role: '琼恩·雪诺' }],
        directors: [{ name: '大卫·贝尼奥夫' }],
      },
      {
        title: '鬼灭之刃',
        original_title: 'Demon Slayer',
        type: 'anime',
        description: '炭治郎的家人被鬼杀害，妹妹变成了鬼。为了寻找让妹妹变回人类的方法，他踏上了成为鬼杀队剑士的道路。',
        poster: 'https://picsum.photos/seed/demonslayer/300/450',
        backdrop: 'https://picsum.photos/seed/demonslayer-bg/1920/1080',
        release_year: 2019,
        duration: 24,
        rating: '9.0',
        is_vip_only: false,
        tags: ['热血', '冒险', '奇幻'],
        categories: ['日本动漫', '热血番'],
        actors: [{ name: '花江夏树', role: '炭治郎' }, { name: '鬼头明里', role: '祢豆子' }],
        directors: [{ name: '外崎春雄' }],
      },
    ];

    const { error: moviesError } = await client
      .from('movies')
      .insert(movies);

    if (moviesError) {
      console.error('创建电影失败:', moviesError);
    }

    // 创建示例游戏
    const games = [
      {
        title: '2048',
        description: '经典数字益智游戏，合并数字到达2048',
        cover: 'https://picsum.photos/seed/2048/400/300',
        type: 'puzzle',
        coin_reward: 10,
        is_vip_only: false,
      },
      {
        title: '贪吃蛇',
        description: '经典贪吃蛇游戏，控制蛇吃食物不断变长',
        cover: 'https://picsum.photos/seed/snake/400/300',
        type: 'classic',
        coin_reward: 5,
        is_vip_only: false,
      },
      {
        title: '俄罗斯方块',
        description: '永恒的经典，堆叠方块消除得分',
        cover: 'https://picsum.photos/seed/tetris/400/300',
        type: 'puzzle',
        coin_reward: 15,
        is_vip_only: false,
      },
    ];

    const { error: gamesError } = await client
      .from('games')
      .insert(games);

    if (gamesError) {
      console.error('创建游戏失败:', gamesError);
    }

    // 创建充值套餐
    const rechargePackages = [
      { name: '100金币', coins: 100, price: '10', bonus: 0 },
      { name: '500金币', coins: 500, price: '48', bonus: 20 },
      { name: '1000金币', coins: 1000, price: '90', bonus: 100, is_popular: true },
      { name: '2000金币', coins: 2000, price: '170', bonus: 300 },
      { name: '5000金币', coins: 5000, price: '400', bonus: 1000 },
    ];

    const { error: packagesError } = await client
      .from('recharge_packages')
      .insert(rechargePackages);

    if (packagesError) {
      console.error('创建充值套餐失败:', packagesError);
    }

    // 创建VIP套餐
    const vipPackages = [
      { name: '月度会员', duration: 30, price: '25', original_price: '30', features: ['免广告', '专属内容', '高速下载'] },
      { name: '季度会员', duration: 90, price: '68', original_price: '90', is_popular: true, features: ['免广告', '专属内容', '高速下载', '提前观看'] },
      { name: '年度会员', duration: 365, price: '198', original_price: '360', features: ['免广告', '专属内容', '高速下载', '提前观看', '专属客服'] },
      { name: '终身会员', duration: 36500, price: '398', original_price: '999', features: ['所有权益', '永久有效', '优先支持'] },
    ];

    const { error: vipError } = await client
      .from('vip_packages')
      .insert(vipPackages);

    if (vipError) {
      console.error('创建VIP套餐失败:', vipError);
    }

    return NextResponse.json({
      success: true,
      message: '示例数据初始化完成',
      data: {
        movies: movies.length,
        games: games.length,
        rechargePackages: rechargePackages.length,
        vipPackages: vipPackages.length,
      },
    });
  } catch (error) {
    console.error('初始化失败:', error);
    return NextResponse.json(
      { error: '初始化失败' },
      { status: 500 }
    );
  }
}
