import { Suspense } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Film,
  Crown,
  Coins,
  MessageCircle,
  Gamepad2,
  Image as ImageIcon,
  BookOpen,
  Settings,
  BarChart3,
  Megaphone,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: '今日访问', value: '12,345', change: '+12%', positive: true },
  { label: '活跃用户', value: '3,456', change: '+5%', positive: true },
  { label: '新增注册', value: '234', change: '-2%', positive: false },
  { label: 'VIP会员', value: '567', change: '+8%', positive: true },
  { label: '今日收入', value: '¥8,765', change: '+15%', positive: true },
  { label: '视频播放', value: '45,678', change: '+10%', positive: true },
];

const menuItems = [
  { icon: LayoutDashboard, title: '仪表盘', href: '/admin', description: '系统概览' },
  { icon: Users, title: '用户管理', href: '/admin/users', description: '管理用户账户' },
  { icon: Film, title: '影视管理', href: '/admin/movies', description: '管理影视内容' },
  { icon: Crown, title: '会员管理', href: '/admin/vip', description: '管理会员订阅' },
  { icon: Coins, title: '金币管理', href: '/admin/coins', description: '管理金币充值' },
  { icon: MessageCircle, title: '聊天管理', href: '/admin/chat', description: '管理聊天室' },
  { icon: Gamepad2, title: '游戏管理', href: '/admin/games', description: '管理游戏' },
  { icon: ImageIcon, title: '漫画管理', href: '/admin/comics', description: '管理漫画内容' },
  { icon: BookOpen, title: '小说管理', href: '/admin/novels', description: '管理小说内容' },
  { icon: Megaphone, title: '广告管理', href: '/admin/ads', description: '管理广告投放' },
  { icon: Palette, title: '主题配置', href: '/admin/themes', description: '配置网站主题' },
  { icon: Settings, title: '系统设置', href: '/admin/settings', description: '系统配置' },
];

const recentActivities = [
  { user: '张三', action: '注册了新账户', time: '5分钟前' },
  { user: '李四', action: '开通了VIP会员', time: '10分钟前' },
  { user: '王五', action: '充值了1000金币', time: '15分钟前' },
  { user: '赵六', action: '评论了《星际穿越》', time: '20分钟前' },
  { user: '钱七', action: '上传了新视频', time: '30分钟前' },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">管理后台</span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.href === '/admin' ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">仪表盘</h1>
              <p className="text-muted-foreground">欢迎回来，管理员</p>
            </div>
            <Button>刷新数据</Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p
                    className={`text-xs mt-1 ${
                      stat.positive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change} 较昨日
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {menuItems.slice(1, 9).map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-center">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground text-center">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm">
                        {activity.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  查看全部
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  访问趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  图表区域（可接入图表库）
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  收入统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  图表区域（可接入图表库）
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
