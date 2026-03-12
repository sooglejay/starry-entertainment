import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, BookOpen, Filter, SortAsc, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const comics = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    '海贼王', '火影忍者', '进击的巨人', '鬼灭之刃', '咒术回战', '我的英雄学院',
    '一拳超人', '死神', '龙珠', '名侦探柯南', '间谍过家家', '葬送的芙莉莲',
    '电锯人', 'JOJO的奇妙冒险', '钢之炼金术师', '全职猎人', '排球少年', '黑色五叶草',
    '妖精的尾巴', '七大罪', '东京喰种', '寄生兽', '死亡笔记', '网球王子'
  ][i],
  author: ['尾田荣一郎', '岸本齐史', '谏山创', '吾峠呼世晴'][i % 4],
  cover: `https://picsum.photos/seed/comic${i}/300/400`,
  type: ['manga', 'manhua', 'manhwa'][i % 3],
  chapters: 100 + i * 10,
  views: Math.floor(Math.random() * 1000000),
  likes: Math.floor(Math.random() * 50000),
  isVipOnly: i % 4 === 0,
  tags: ['热血', '冒险', '奇幻', '战斗'].slice(0, (i % 4) + 1),
}));

const types = [
  { label: '全部', value: 'all' },
  { label: '日漫', value: 'manga' },
  { label: '国漫', value: 'manhua' },
  { label: '韩漫', value: 'manhwa' },
];

const categories = ['热血', '冒险', '恋爱', '校园', '奇幻', '科幻', '悬疑', '搞笑', '运动', '治愈'];

export default function ComicsPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">漫画频道</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="hot">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot">最热门</SelectItem>
            <SelectItem value="latest">最新更新</SelectItem>
            <SelectItem value="rating">评分最高</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="搜索漫画..."
          className="w-[200px] ml-auto"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Comics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {comics.map((comic) => (
          <Link key={comic.id} href={`/comics/${comic.id}`}>
            <Card className="group overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image
                  src={comic.cover}
                  alt={comic.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {comic.isVipOnly && (
                  <Badge className="absolute left-2 top-2 bg-yellow-500 text-yellow-900">
                    VIP
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {(comic.views / 1000).toFixed(0)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {(comic.likes / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{comic.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{comic.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {comic.chapters}话
                  </span>
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
