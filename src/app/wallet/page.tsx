import { Suspense } from 'react';
import {
  Coins,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  CreditCard,
  History,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const rechargePackages = [
  { id: 1, coins: 100, price: 10, bonus: 0, isPopular: false },
  { id: 2, coins: 500, price: 48, bonus: 20, isPopular: false },
  { id: 3, coins: 1000, price: 90, bonus: 100, isPopular: true },
  { id: 4, coins: 2000, price: 170, bonus: 300, isPopular: false },
  { id: 5, coins: 5000, price: 400, bonus: 1000, isPopular: false },
  { id: 6, coins: 10000, price: 750, bonus: 2500, isPopular: false },
];

const transactions = [
  { id: 1, type: 'earn', description: '观看视频奖励', amount: 10, time: '2024-01-15 14:30', balance: 1280 },
  { id: 2, type: 'spend', description: '购买电影《星际穿越》', amount: -50, time: '2024-01-15 12:00', balance: 1270 },
  { id: 3, type: 'recharge', description: '充值1000金币', amount: 1100, time: '2024-01-14 20:00', balance: 1320 },
  { id: 4, type: 'earn', description: '游戏奖励', amount: 20, time: '2024-01-14 18:30', balance: 220 },
  { id: 5, type: 'gift', description: '签到奖励', amount: 5, time: '2024-01-14 08:00', balance: 200 },
  { id: 6, type: 'spend', description: '开通VIP会员', amount: -198, time: '2024-01-13 15:00', balance: 195 },
];

const earnMethods = [
  { icon: Sparkles, title: '每日签到', description: '每日签到获得金币奖励', coins: '+5' },
  { icon: Gift, title: '观看视频', description: '观看完整视频获得奖励', coins: '+1~10' },
  { icon: Coins, title: '游戏奖励', description: '玩游戏获得金币', coins: '+5~50' },
  { icon: Gift, title: '邀请好友', description: '邀请好友注册获得奖励', coins: '+50' },
];

export default function WalletPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">我的钱包</h1>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">当前金币</p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="h-8 w-8" />
                <span className="text-4xl font-bold">1,280</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">累计获得</p>
              <p className="text-2xl font-bold mt-1">5,680</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              充值
            </Button>
            <Button variant="secondary" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0">
              <History className="mr-2 h-4 w-4" />
              明细
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="recharge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recharge">充值</TabsTrigger>
          <TabsTrigger value="history">交易记录</TabsTrigger>
          <TabsTrigger value="earn">赚取金币</TabsTrigger>
        </TabsList>

        {/* Recharge Tab */}
        <TabsContent value="recharge">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                选择充值金额
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {rechargePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                      pkg.isPopular ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    {pkg.isPopular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                        推荐
                      </Badge>
                    )}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Coins className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold">{pkg.coins}</span>
                      </div>
                      {pkg.bonus > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                          赠送 {pkg.bonus} 金币
                        </p>
                      )}
                      <p className="text-xl font-semibold">¥{pkg.price}</p>
                      <Button className="w-full mt-3" variant={pkg.isPopular ? 'default' : 'outline'}>
                        立即充值
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-4">支付方式</h3>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <span className="mr-2">💳</span> 微信支付
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <span className="mr-2">💳</span> 支付宝
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                交易记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          tx.type === 'recharge'
                            ? 'bg-green-500/10 text-green-500'
                            : tx.type === 'spend'
                            ? 'bg-red-500/10 text-red-500'
                            : tx.type === 'gift'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {tx.type === 'recharge' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        余额: {tx.balance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earn Tab */}
        <TabsContent value="earn">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                赚取金币
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {earnMethods.map((method) => (
                  <div
                    key={method.title}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{method.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-green-600 dark:text-green-400">
                      {method.coins}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
