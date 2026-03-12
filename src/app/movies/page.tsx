import { Suspense } from 'react';
import { Film, Filter, SortAsc, Grid, List } from 'lucide-react';
import { ContentCard, type ContentItem } from '@/components/content-card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const movies: ContentItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    '星际穿越', '盗梦空间', '复仇者联盟', '泰坦尼克号', '阿凡达', '蜘蛛侠',
    '钢铁侠', '蝙蝠侠', '黑客帝国', '终结者', '侏罗纪公园', '变形金刚',
    '指环王', '哈利波特', '加勒比海盗', '速度与激情', '碟中谍', '007',
    '星球大战', '漫威宇宙', 'DC宇宙', 'X战警', '银河护卫队', '雷神'
  ][i],
  poster: `https://picsum.photos/seed/listmovie${i}/300/450`,
  rating: 7.5 + Math.random() * 2.5,
  year: 2010 + Math.floor(Math.random() * 14),
  isVipOnly: i % 5 === 0,
  views: Math.floor(Math.random() * 1000000),
  tags: ['科幻', '动作', '冒险', '剧情', '悬疑'].slice(0, Math.floor(Math.random() * 3) + 1),
}));

const categories = [
  { label: '全部', value: 'all' },
  { label: '电影', value: 'movie' },
  { label: '电视剧', value: 'tv_series' },
  { label: '动漫', value: 'anime' },
  { label: '综艺', value: 'variety' },
  { label: '纪录片', value: 'documentary' },
];

const regions = [
  { label: '全部地区', value: 'all' },
  { label: '中国大陆', value: 'cn' },
  { label: '中国香港', value: 'hk' },
  { label: '中国台湾', value: 'tw' },
  { label: '美国', value: 'us' },
  { label: '日本', value: 'jp' },
  { label: '韩国', value: 'kr' },
  { label: '英国', value: 'uk' },
];

const years = [
  { label: '全部年份', value: 'all' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
  { label: '2021', value: '2021' },
  { label: '2020', value: '2020' },
  { label: '2010年代', value: '2010s' },
  { label: '2000年代', value: '2000s' },
  { label: '经典老片', value: 'classic' },
];

const sorts = [
  { label: '最新上线', value: 'latest' },
  { label: '最热播放', value: 'hot' },
  { label: '评分最高', value: 'rating' },
  { label: '最多收藏', value: 'favorite' },
];

export default function MoviesPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">影视中心</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="地区" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="年份" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="latest">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="搜索影视..."
          className="w-[200px] ml-auto"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['科幻', '动作', '爱情', '喜剧', '恐怖', '悬疑', '动画', '战争', '犯罪', '奇幻'].map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <ContentCard key={movie.id} item={movie} showViews />
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
