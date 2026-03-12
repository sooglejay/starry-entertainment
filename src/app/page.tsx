import { Suspense } from 'react';
import { Film, Crown, Sparkles, TrendingUp, Clock, Star } from 'lucide-react';
import { HeroCarousel } from '@/components/hero-carousel';
import { ContentCard, ContentRow, type ContentItem } from '@/components/content-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - 在实际应用中从数据库获取
const bannerItems = [
  {
    id: 1,
    title: '星际穿越',
    description: '在不久的未来，地球面临着严重的环境危机。前NASA宇航员库珀被选中执行一项穿越星际的任务，寻找人类新的家园。',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=800&fit=crop',
    link: '/movies/1',
    tags: ['科幻', '冒险'],
    rating: 9.4,
  },
  {
    id: 2,
    title: '盗梦空间',
    description: '道姆·柯布是一名技艺高超的盗贼，专门在目标睡眠时潜入其梦境，窃取潜意识中有价值的秘密。',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=800&fit=crop',
    link: '/movies/2',
    tags: ['科幻', '悬疑'],
    rating: 9.3,
  },
  {
    id: 3,
    title: '复仇者联盟',
    description: '当邪恶势力威胁到地球的安全时，神盾局局长尼克·弗瑞启动了复仇者计划，召集超级英雄们共同抵抗外星入侵。',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=800&fit=crop',
    link: '/movies/3',
    tags: ['动作', '科幻'],
    rating: 8.9,
  },
];

const hotMovies: ContentItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ['星际穿越', '盗梦空间', '复仇者联盟', '泰坦尼克号', '阿凡达', '蜘蛛侠', '钢铁侠', '蝙蝠侠', '黑客帝国', '终结者', '侏罗纪公园', '变形金刚'][i],
  poster: `https://picsum.photos/seed/movie${i}/300/450`,
  rating: 8.5 + Math.random() * 1.5,
  year: 2020 + Math.floor(Math.random() * 5),
  isVipOnly: i % 4 === 0,
  tags: ['科幻', '动作', '冒险'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

const tvSeries: ContentItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 100,
  title: ['权力的游戏', '绝命毒师', '怪奇物语', '黑镜', '西部世界', '纸牌屋', '行尸走肉', '神探夏洛克', '老友记', '生活大爆炸', '绝命律师', '风骚律师'][i],
  poster: `https://picsum.photos/seed/tv${i}/300/450`,
  rating: 8.0 + Math.random() * 2,
  year: 2018 + Math.floor(Math.random() * 6),
  isVipOnly: i % 5 === 0,
  tags: ['剧情', '悬疑', '科幻'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

const animeList: ContentItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 200,
  title: ['进击的巨人', '鬼灭之刃', '咒术回战', '海贼王', '火影忍者', '名侦探柯南', '死神', '龙珠', '一拳超人', '我的英雄学院', '间谍过家家', '葬送的芙莉莲'][i],
  poster: `https://picsum.photos/seed/anime${i}/300/450`,
  rating: 8.5 + Math.random() * 1.5,
  year: 2019 + Math.floor(Math.random() * 5),
  isVipOnly: i % 3 === 0,
  tags: ['热血', '冒险', '奇幻'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

const latestMovies: ContentItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 300,
  title: ['沙丘2', '奥本海默', '芭比', '银河护卫队3', '碟中谍7', '闪电侠'][i],
  poster: `https://picsum.photos/seed/latest${i}/300/450`,
  rating: 7.5 + Math.random() * 2,
  year: 2024,
  views: Math.floor(Math.random() * 1000000) + 100000,
  tags: ['动作', '科幻', '冒险'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="container px-4 py-6">
        <HeroCarousel items={bannerItems} />
      </section>

      {/* Quick Actions */}
      <section className="container px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <Crown className="h-8 w-8" />
              <div>
                <p className="font-semibold">开通VIP</p>
                <p className="text-sm opacity-80">海量内容免费看</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <div>
                <p className="font-semibold">金币充值</p>
                <p className="text-sm opacity-80">充值享优惠</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="font-semibold">排行榜</p>
                <p className="text-sm opacity-80">热门精选推荐</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8" />
              <div>
                <p className="font-semibold">最近更新</p>
                <p className="text-sm opacity-80">每日新内容</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="container px-4 py-6">
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="hot" className="gap-2">
              <Star className="h-4 w-4" />
              热门推荐
            </TabsTrigger>
            <TabsTrigger value="movie" className="gap-2">
              <Film className="h-4 w-4" />
              电影
            </TabsTrigger>
            <TabsTrigger value="tv" className="gap-2">
              📺 电视剧
            </TabsTrigger>
            <TabsTrigger value="anime" className="gap-2">
              🎌 动漫
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hot">
            <ContentRow title="热门电影" moreHref="/movies?type=movie">
              {hotMovies.map((movie) => (
                <ContentCard key={movie.id} item={movie} />
              ))}
            </ContentRow>
            <ContentRow title="热播剧集" moreHref="/movies?type=tv_series">
              {tvSeries.map((tv) => (
                <ContentCard key={tv.id} item={tv} />
              ))}
            </ContentRow>
            <ContentRow title="热门动漫" moreHref="/movies?type=anime">
              {animeList.map((anime) => (
                <ContentCard key={anime.id} item={anime} />
              ))}
            </ContentRow>
          </TabsContent>

          <TabsContent value="movie">
            <ContentRow title="最新上映" moreHref="/movies?type=movie&sort=latest">
              {latestMovies.map((movie) => (
                <ContentCard key={movie.id} item={movie} showViews />
              ))}
            </ContentRow>
            <ContentRow title="经典好片" moreHref="/movies?type=movie&sort=classic">
              {hotMovies.slice(0, 8).map((movie) => (
                <ContentCard key={movie.id} item={movie} />
              ))}
            </ContentRow>
          </TabsContent>

          <TabsContent value="tv">
            <ContentRow title="热播国产剧" moreHref="/movies?type=tv_series&region=cn">
              {tvSeries.slice(0, 6).map((tv) => (
                <ContentCard key={tv.id} item={tv} />
              ))}
            </ContentRow>
            <ContentRow title="美剧推荐" moreHref="/movies?type=tv_series&region=us">
              {tvSeries.slice(6, 12).map((tv) => (
                <ContentCard key={tv.id} item={tv} />
              ))}
            </ContentRow>
          </TabsContent>

          <TabsContent value="anime">
            <ContentRow title="日漫新番" moreHref="/movies?type=anime&region=jp">
              {animeList.slice(0, 6).map((anime) => (
                <ContentCard key={anime.id} item={anime} />
              ))}
            </ContentRow>
            <ContentRow title="国产动画" moreHref="/movies?type=anime&region=cn">
              {animeList.slice(6, 12).map((anime) => (
                <ContentCard key={anime.id} item={anime} />
              ))}
            </ContentRow>
          </TabsContent>
        </Tabs>
      </section>

      {/* VIP Section */}
      <section className="container px-4 py-8">
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Crown className="h-6 w-6" />
              VIP会员特权
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl mb-2">🎬</div>
                <p className="font-medium">海量影视</p>
                <p className="text-sm text-muted-foreground">VIP专享内容</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl mb-2">🚫</div>
                <p className="font-medium">免广告</p>
                <p className="text-sm text-muted-foreground">纯净观影体验</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-medium">多端同步</p>
                <p className="text-sm text-muted-foreground">随时随地观看</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl mb-2">💎</div>
                <p className="font-medium">尊贵标识</p>
                <p className="text-sm text-muted-foreground">专属会员徽章</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                立即开通 ¥25/月
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
