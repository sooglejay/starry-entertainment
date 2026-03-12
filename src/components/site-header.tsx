'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  User,
  Coins,
  Crown,
  MessageCircle,
  Gamepad2,
  BookOpen,
  Image as ImageIcon,
  Film,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: '影视',
    href: '/movies',
    icon: Film,
    children: [
      { title: '电影', href: '/movies?type=movie' },
      { title: '电视剧', href: '/movies?type=tv_series' },
      { title: '动漫', href: '/movies?type=anime' },
      { title: '综艺', href: '/movies?type=variety' },
      { title: '纪录片', href: '/movies?type=documentary' },
    ],
  },
  {
    title: '漫画',
    href: '/comics',
    icon: ImageIcon,
    children: [
      { title: '日漫', href: '/comics?type=manga' },
      { title: '国漫', href: '/comics?type=manhua' },
      { title: '韩漫', href: '/comics?type=manhwa' },
      { title: '美漫', href: '/comics?type=comic' },
    ],
  },
  {
    title: '小说',
    href: '/novels',
    icon: BookOpen,
    children: [
      { title: '玄幻', href: '/novels?type=fantasy' },
      { title: '言情', href: '/novels?type=romance' },
      { title: '科幻', href: '/novels?type=scifi' },
      { title: '都市', href: '/novels?type=urban' },
    ],
  },
  {
    title: '图库',
    href: '/gallery',
    icon: ImageIcon,
  },
  {
    title: '游戏',
    href: '/games',
    icon: Gamepad2,
  },
  {
    title: '聊天',
    href: '/chat',
    icon: MessageCircle,
  },
];

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themeIcon = React.useMemo(() => {
    if (!mounted) return <Monitor className="h-5 w-5" />;
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  }, [theme, mounted]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold text-xl sm:inline-block">
            星影娱乐
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="bg-transparent">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                              )}
                            >
                              {child.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className={cn('relative', searchOpen ? 'w-64' : 'w-auto')}>
            {searchOpen ? (
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="搜索影视、漫画、小说..."
                  className="h-9 w-full"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {themeIcon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                浅色模式
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                深色模式
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                跟随系统
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* Coins */}
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Coins className="mr-1 h-4 w-4 text-yellow-500" />
                <span>1,280</span>
              </Button>

              {/* VIP Badge */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-yellow-500 text-yellow-600 dark:text-yellow-400"
              >
                <Crown className="mr-1 h-4 w-4" />
                VIP
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/user.jpg" alt="用户" />
                      <AvatarFallback>用户</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">星影用户</p>
                      <p className="text-xs text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      个人中心
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vip">
                      <Crown className="mr-2 h-4 w-4" />
                      会员中心
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">
                      <Coins className="mr-2 h-4 w-4" />
                      我的钱包
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      设置
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>
                登录
              </Button>
              <Button size="sm" onClick={() => setIsLoggedIn(true)}>
                注册
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                      >
                        <span className="flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)]">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.title} asChild>
                          <Link href={child.href} className="w-full">
                            {child.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={item.href}>
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
