'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Eye, Crown, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ContentItem {
  id: number;
  title: string;
  poster: string;
  rating?: number;
  views?: number;
  year?: number;
  type?: string;
  isVipOnly?: boolean;
  coinPrice?: number;
  tags?: string[];
}

interface ContentCardProps {
  item: ContentItem;
  showRating?: boolean;
  showViews?: boolean;
  showVipBadge?: boolean;
  showPlayButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ContentCard({
  item,
  showRating = true,
  showViews = false,
  showVipBadge = true,
  showPlayButton = true,
  size = 'md',
  className,
}: ContentCardProps) {
  const sizeClasses = {
    sm: 'aspect-[2/3]',
    md: 'aspect-[2/3]',
    lg: 'aspect-[16/9]',
  };

  const widthClasses = {
    sm: 'w-32',
    md: 'w-40',
    lg: 'w-full',
  };

  return (
    <Link href={`/movies/${item.id}`}>
      <Card
        className={cn(
          'group relative overflow-hidden border-0 shadow-none transition-all hover:scale-105',
          widthClasses[size],
          className
        )}
      >
        <div className={cn('relative overflow-hidden rounded-lg', sizeClasses[size])}>
          {/* Poster Image */}
          <Image
            src={item.poster || '/placeholder.jpg'}
            alt={item.title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Play Button */}
          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm">
                <Play className="h-6 w-6 fill-current" />
              </div>
            </div>
          )}

          {/* VIP Badge */}
          {showVipBadge && item.isVipOnly && (
            <Badge className="absolute left-2 top-2 bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
              <Crown className="mr-1 h-3 w-3" />
              VIP
            </Badge>
          )}

          {/* Coin Price Badge */}
          {item.coinPrice && item.coinPrice > 0 && (
            <Badge className="absolute left-2 top-2 bg-orange-500 text-white hover:bg-orange-500">
              <Lock className="mr-1 h-3 w-3" />
              {item.coinPrice} 金币
            </Badge>
          )}

          {/* Rating Badge */}
          {showRating && item.rating && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-sm text-white backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Views Badge */}
          {showViews && item.views && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              <span>{(item.views / 10000).toFixed(1)}万</span>
            </div>
          )}

          {/* Year Badge */}
          {item.year && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 text-xs"
            >
              {item.year}
            </Badge>
          )}
        </div>

        {/* Title */}
        <CardContent className="p-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          {item.tags && item.tags.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {item.tags.slice(0, 3).join(' / ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Horizontal Scroll List
interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  showMore?: boolean;
  moreHref?: string;
}

export function ContentRow({
  title,
  icon,
  children,
  showMore = true,
  moreHref,
}: ContentRowProps) {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          {icon}
          {title}
        </h2>
        {showMore && moreHref && (
          <Link
            href={moreHref}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            查看更多 →
          </Link>
        )}
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {children}
        </div>
      </div>
    </section>
  );
}
