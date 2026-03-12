import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, Play, Trophy, Coins, Users, Star, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data
const games = [
  {
    id: 1,
    title: '2048',
    description: '经典数字益智游戏，合并数字到达2048',
    cover: 'https://picsum.photos/seed/game1/400/300',
    type: 'puzzle',
    coinReward: 10,
    playCount: 125000,
    rating: 4.8,
    isVipOnly: false,
  },
  {
    id: 2,
    title: '贪吃蛇',
    description: '经典贪吃蛇游戏，控制蛇吃食物不断变长',
    cover: 'https://picsum.photos/seed/game2/400/300',
    type: 'classic',
    coinReward: 5,
    playCount: 89000,
    rating: 4.5,
    isVipOnly: false,
  },
  {
    id: 3,
    title: '俄罗斯方块',
    description: '永恒的经典，堆叠方块消除得分',
    cover: 'https://picsum.photos/seed/game3/400/300',
    type: 'puzzle',
    coinReward: 15,
    playCount: 156000,
    rating: 4.9,
    isVipOnly: false,
  },
  {
    id: 4,
    title: '打地鼠',
    description: '快速反应游戏，击打冒出的地鼠得分',
    cover: 'https://picsum.photos/seed/game4/400/300',
    type: 'action',
    coinReward: 8,
    playCount: 67000,
    rating: 4.3,
    isVipOnly: false,
  },
  {
    id: 5,
    title: '消消乐',
    description: '三消游戏，交换相邻方块消除得分',
    cover: 'https://picsum.photos/seed/game5/400/300',
    type: 'puzzle',
    coinReward: 20,
    playCount: 234000,
    rating: 4.7,
    isVipOnly: true,
  },
  {
    id: 6,
    title: '跑酷达人',
    description: '跑酷跳跃游戏，躲避障碍收集金币',
    cover: 'https://picsum.photos/seed/game6/400/300',
    type: 'action',
    coinReward: 12,
    playCount: 178000,
    rating: 4.6,
    isVipOnly: false,
  },
];

const leaderboard = [
  { rank: 1, user: '游戏高手', avatar: 'https://picsum.photos/seed/lb1/50/50', score: 999999, game: '消消乐' },
  { rank: 2, user: '达人小明', avatar: 'https://picsum.photos/seed/lb2/50/50', score: 888888, game: '2048' },
  { rank: 3, user: '快乐玩家', avatar: 'https://picsum.photos/seed/lb3/50/50', score: 777777, game: '俄罗斯方块' },
  { rank: 4, user: '小王同学', avatar: 'https://picsum.photos/seed/lb4/50/50', score: 666666, game: '贪吃蛇' },
  { rank: 5, user: '游戏达人', avatar: 'https://picsum.photos/seed/lb5/50/50', score: 555555, game: '打地鼠' },
];

const gameTypes = [
  { label: '全部游戏', value: 'all' },
  { label: '益智游戏', value: 'puzzle' },
  { label: '动作游戏', value: 'action' },
  { label: '经典游戏', value: 'classic' },
  { label: '卡片游戏', value: 'card' },
  { label: '休闲游戏', value: 'casual' },
];

export default function GamesPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">游戏中心</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">今日玩家</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">56,789</p>
            <p className="text-sm text-muted-foreground">金币发放</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">6</p>
            <p className="text-sm text-muted-foreground">在线游戏</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">4.7</p>
            <p className="text-sm text-muted-foreground">平均评分</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Games List */}
        <div>
          {/* Type Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              {gameTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Games Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Card key={game.id} className="group overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={game.cover}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="gap-2">
                      <Play className="h-5 w-5 fill-current" />
                      开始游戏
                    </Button>
                  </div>
                  {game.isVipOnly && (
                    <Badge className="absolute left-2 top-2 bg-yellow-500 text-yellow-900">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{game.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{game.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Coins className="h-4 w-4" />
                      <span>+{game.coinReward}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {(game.playCount / 1000).toFixed(0)}k 玩过
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                排行榜
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                        player.rank === 1
                          ? 'bg-yellow-500 text-yellow-900'
                          : player.rank === 2
                          ? 'bg-gray-300 text-gray-700'
                          : player.rank === 3
                          ? 'bg-orange-400 text-orange-900'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {player.rank}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>{player.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{player.user}</p>
                      <p className="text-xs text-muted-foreground">{player.game}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {player.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                查看完整排行
              </Button>
            </CardContent>
          </Card>

          {/* Rewards Info */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-orange-500" />
                游戏奖励
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>• 每日首次游戏获得双倍金币</li>
                <li>• 打破记录获得额外奖励</li>
                <li>• VIP会员奖励加成50%</li>
                <li>• 分享游戏获得额外金币</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
