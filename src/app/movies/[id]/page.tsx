import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Heart,
  Share2,
  Download,
  Star,
  Eye,
  Calendar,
  Clock,
  Users,
  Crown,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentCard } from '@/components/content-card';
import { VideoPlayer } from '@/components/video-player';

// Mock data - 在实际应用中从数据库获取
const mockMovie = {
  id: 1,
  title: '星际穿越',
  originalTitle: 'Interstellar',
  type: 'movie',
  description: `在不久的未来，地球面临着严重的环境危机。沙尘暴肆虐，农作物逐渐灭绝，人类的生存岌岌可危。前NASA宇航员库珀（马修·麦康纳饰）被选中执行一项穿越星际的任务，寻找人类新的家园。

他们穿越虫洞，来到遥远的星系，探索了几个可能适合人类居住的行星。在这里，时间和空间的法则被打破，每一个决定都关乎全人类的命运。库珀必须在完成任务和回到家人身边之间做出艰难的选择。`,
  poster: 'https://picsum.photos/seed/interstellar/450/675',
  backdrop: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&h=1080&fit=crop',
  trailer: 'https://www.w3schools.com/html/mov_bbb.mp4',
  releaseYear: 2014,
  duration: 169,
  rating: 9.4,
  ratingCount: 125680,
  views: 5680000,
  likes: 89000,
  isVipOnly: false,
  coinPrice: 0,
  tags: ['科幻', '冒险', '剧情'],
  categories: ['科幻电影', '太空探索'],
  actors: [
    { name: '马修·麦康纳', role: '库珀', avatar: 'https://picsum.photos/seed/actor1/100/100' },
    { name: '安妮·海瑟薇', role: '布兰德', avatar: 'https://picsum.photos/seed/actor2/100/100' },
    { name: '杰西卡·查斯坦', role: '墨菲', avatar: 'https://picsum.photos/seed/actor3/100/100' },
    { name: '迈克尔·凯恩', role: '布兰德教授', avatar: 'https://picsum.photos/seed/actor4/100/100' },
  ],
  directors: [{ name: '克里斯托弗·诺兰', avatar: 'https://picsum.photos/seed/director1/100/100' }],
  episodes: [],
};

const relatedMovies = Array.from({ length: 6 }, (_, i) => ({
  id: i + 2,
  title: ['盗梦空间', '蝙蝠侠：黑暗骑士', '信条', '敦刻尔克', '致命魔术', '记忆碎片'][i],
  poster: `https://picsum.photos/seed/related${i}/300/450`,
  rating: 8.5 + Math.random() * 1.5,
  year: 2010 + i * 2,
  tags: ['科幻', '悬疑', '动作'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

const comments = [
  {
    id: 1,
    user: { name: '影迷小王', avatar: 'https://picsum.photos/seed/user1/50/50' },
    content: '诺兰的神作！视觉效果震撼，剧情烧脑又感人，每次看都有新的收获。',
    likes: 256,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    user: { name: '科幻迷', avatar: 'https://picsum.photos/seed/user2/50/50' },
    content: '这是我看过的最好的科幻电影之一，对时间和空间的探讨让人深思。',
    likes: 189,
    createdAt: '2024-01-14',
  },
];

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    info?: string;
  }>;
}

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  const { id } = await params;
  const { info } = await searchParams;
  
  // 在实际应用中，这里会从数据库获取数据
  const movie = mockMovie;

  if (!movie) {
    notFound();
  }

  const showInfo = info === 'true';

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container px-4 -mt-32 relative z-10">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Poster & Actions */}
          <div className="space-y-4">
            <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
              />
              {movie.isVipOnly && (
                <Badge className="absolute left-2 top-2 bg-yellow-500 text-yellow-900">
                  <Crown className="mr-1 h-3 w-3" />
                  VIP专享
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" size="lg">
                <Play className="h-5 w-5 fill-current" />
                立即观看
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-11 w-11">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-xl font-bold">{movie.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {movie.ratingCount.toLocaleString()} 人评分
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <Eye className="h-5 w-5" />
                  <span className="text-xl font-bold">
                    {(movie.views / 10000).toFixed(0)}万
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">播放量</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                  <Heart className="h-5 w-5 fill-current" />
                  <span className="text-xl font-bold">
                    {(movie.likes / 1000).toFixed(0)}k
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">喜欢</p>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.originalTitle && (
                <p className="text-lg text-muted-foreground">{movie.originalTitle}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{movie.releaseYear}年</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movie.duration}分钟</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{movie.directors[0]?.name}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">剧情简介</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {movie.description}
              </p>
            </div>

            {/* Video Player */}
            {!showInfo && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <VideoPlayer
                  src={movie.trailer}
                  poster={movie.backdrop}
                  title={movie.title}
                />
              </div>
            )}

            {/* Cast & Crew */}
            <div>
              <h3 className="font-semibold mb-3">演员阵容</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {movie.actors.map((actor) => (
                  <div key={actor.name} className="flex-shrink-0 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarImage src={actor.avatar} alt={actor.name} />
                      <AvatarFallback>{actor.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{actor.name}</p>
                    <p className="text-xs text-muted-foreground">{actor.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="episodes" className="mt-8">
          <TabsList>
            <TabsTrigger value="episodes">选集</TabsTrigger>
            <TabsTrigger value="comments">评论 ({comments.length})</TabsTrigger>
            <TabsTrigger value="related">相关推荐</TabsTrigger>
          </TabsList>

          <TabsContent value="episodes" className="mt-4">
            {movie.type === 'movie' ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  这是电影，暂无剧集
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 24 }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === 0 ? 'default' : 'outline'}
                    className="h-12"
                  >
                    第 {i + 1} 集
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-4 space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <Heart className="h-4 w-4" />
                          {comment.likes}
                        </button>
                        <button className="hover:text-foreground">回复</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="related" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((movie) => (
                <ContentCard key={movie.id} item={movie} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* VIP Banner */}
        {movie.isVipOnly && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-yellow-900">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">VIP专享内容</h3>
                  <p className="text-sm text-muted-foreground">
                    开通VIP会员，免费观看此片及更多独家内容
                  </p>
                </div>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                立即开通
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
