'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, Heart, Eye, Grid, LayoutGrid, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Mock data
const galleries = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: [
    '绝美风景', '萌宠大合集', '美食诱惑', '旅行摄影', '星空银河', '城市夜景',
    '自然奇观', '动物世界', '人物肖像', '艺术创意', '搞笑表情包', '治愈系',
    '二次元美图', '科技感', '复古风', '极简主义', '手绘插画', '3D艺术',
    '建筑之美', '微观世界', '水下摄影', '航拍视角', '街头艺术', '抽象艺术'
  ][i],
  cover: `https://picsum.photos/seed/gallery${i}/400/300`,
  images: Array.from({ length: 10 }, (_, j) => `https://picsum.photos/seed/gallery${i}-${j}/800/600`),
  type: ['curious', 'funny', 'art', 'nature'][i % 4],
  imageCount: 10 + Math.floor(Math.random() * 20),
  views: Math.floor(Math.random() * 50000),
  likes: Math.floor(Math.random() * 5000),
  isVipOnly: i % 5 === 0,
}));

const categories = [
  { label: '全部', value: 'all', icon: '📷' },
  { label: '猎奇', value: 'curious', icon: '🔮' },
  { label: '搞笑', value: 'funny', icon: '😂' },
  { label: '艺术', value: 'art', icon: '🎨' },
  { label: '自然', value: 'nature', icon: '🌿' },
  { label: '科技', value: 'tech', icon: '🔬' },
];

export default function GalleryPage() {
  const [viewMode, setViewMode] = React.useState<'grid' | 'masonry'>('grid');

  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">趣味图库</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'masonry' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('masonry')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Gallery Grid */}
      <div
        className={cn(
          'grid gap-4',
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        )}
      >
        {galleries.map((gallery) => (
          <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
            <Card className="group overflow-hidden">
              <div
                className={cn(
                  'relative overflow-hidden',
                  viewMode === 'grid' ? 'aspect-square' : 'aspect-auto'
                )}
                style={
                  viewMode === 'masonry'
                    ? { height: `${200 + (gallery.id % 4) * 50}px` }
                    : undefined
                }
              >
                <Image
                  src={gallery.cover}
                  alt={gallery.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {gallery.isVipOnly && (
                  <Badge className="absolute left-2 top-2 bg-yellow-500 text-yellow-900">
                    VIP
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white font-medium text-sm line-clamp-1">
                    {gallery.title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/80 text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {gallery.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {gallery.likes}
                    </span>
                    <span>{gallery.imageCount}张</span>
                  </div>
                </div>
              </div>
              {viewMode === 'grid' && (
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{gallery.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{gallery.imageCount}张图片</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {gallery.views}
                    </span>
                  </div>
                </CardContent>
              )}
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

      {/* Scroll to Top */}
      <Button
        className="fixed bottom-8 right-8 rounded-full shadow-lg"
        size="icon"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
