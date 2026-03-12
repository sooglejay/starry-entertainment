import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, Eye, Heart, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const novels = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    '斗破苍穹', '武动乾坤', '凡人修仙传', '遮天', '完美世界', '大主宰',
    '斗罗大陆', '绝世唐门', '龙王传说', '神印王座', '圣墟', '牧神记',
    '诡秘之主', '万族之劫', '大帝之剑', '天道图书馆', '儒道至圣', '超级神基因',
    '最强弃少', '修真世界', '紫川', '亵渎', '庆余年', '择天记'
  ][i],
  author: ['天蚕土豆', '猫腻', '我吃西红柿', '辰东', '唐家三少', '忘语'][i % 6],
  cover: `https://picsum.photos/seed/novel${i}/200/300`,
  type: ['fantasy', 'romance', 'scifi', 'urban'][i % 4],
  words: 100 + i * 50 + '万字',
  chapters: 500 + i * 50,
  views: Math.floor(Math.random() * 10000000),
  likes: Math.floor(Math.random() * 100000),
  isVipOnly: i % 4 === 0,
  tags: ['玄幻', '修仙', '穿越', '都市'].slice(0, (i % 4) + 1),
  description: '这是一部精彩绝伦的小说，讲述了一个普通人逆袭成神的热血故事...',
  status: i % 3 === 0 ? '连载中' : '已完结',
}));

const categories = [
  { label: '玄幻', value: 'fantasy' },
  { label: '言情', value: 'romance' },
  { label: '科幻', value: 'scifi' },
  { label: '都市', value: 'urban' },
  { label: '历史', value: 'history' },
  { label: '游戏', value: 'game' },
];

export default function NovelsPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">小说阅读</h1>
      </div>

      {/* Type Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            {categories.slice(0, 4).map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Input
            type="search"
            placeholder="搜索小说..."
            className="w-[200px]"
          />
        </div>
      </Tabs>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['全部', '玄幻', '修仙', '都市', '穿越', '重生', '系统', '无敌', '热血', '爽文'].map((tag, i) => (
          <Badge
            key={tag}
            variant={i === 0 ? 'default' : 'outline'}
            className="cursor-pointer"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Novels List */}
      <div className="space-y-4">
        {novels.map((novel) => (
          <Link key={novel.id} href={`/novels/${novel.id}`}>
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Cover */}
                  <div className="relative w-20 h-28 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={novel.cover}
                      alt={novel.title}
                      fill
                      className="object-cover"
                    />
                    {novel.isVipOnly && (
                      <Badge className="absolute left-1 top-1 bg-yellow-500 text-yellow-900 text-xs px-1">
                        <Crown className="h-2 w-2 mr-0.5" />
                        VIP
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {novel.title}
                      </h3>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {novel.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {novel.author} · {novel.words} · {novel.chapters}章
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {novel.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {(novel.views / 10000).toFixed(0)}万阅读
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {(novel.likes / 1000).toFixed(0)}k
                      </span>
                      <div className="flex gap-1">
                        {novel.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <Button variant="outline" size="lg">
          加载更多
        </Button>
      </div>
    </div>
  );
}
