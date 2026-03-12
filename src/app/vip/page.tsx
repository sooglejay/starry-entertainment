import { Suspense } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Film,
  Download,
  Bell,
  Shield,
  Zap,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const vipFeatures = [
  { icon: Film, title: '海量内容', description: '解锁全部VIP专属影视、漫画、小说' },
  { icon: Sparkles, title: '免广告', description: '告别广告干扰，纯净观影体验' },
  { icon: Download, title: '离线下载', description: '支持下载到本地，随时随地观看' },
  { icon: Zap, title: '高速通道', description: '专属CDN加速，更快更稳定' },
  { icon: Bell, title: '抢先看', description: '热门新片提前观看' },
  { icon: Shield, title: '尊贵标识', description: '专属VIP徽章，彰显尊贵身份' },
];

const vipPlans = [
  {
    id: 1,
    name: '月度会员',
    duration: 30,
    price: 25,
    originalPrice: 30,
    isPopular: false,
  },
  {
    id: 2,
    name: '季度会员',
    duration: 90,
    price: 68,
    originalPrice: 90,
    isPopular: true,
    discount: '省22元',
  },
  {
    id: 3,
    name: '年度会员',
    duration: 365,
    price: 198,
    originalPrice: 360,
    isPopular: false,
    discount: '省162元',
  },
  {
    id: 4,
    name: '终身会员',
    duration: -1,
    price: 398,
    originalPrice: 999,
    isPopular: false,
    discount: '一次购买永久使用',
  },
];

export default function VIPPage() {
  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-10 w-10 text-yellow-500" />
          <h1 className="text-3xl font-bold">VIP会员中心</h1>
        </div>
        <p className="text-muted-foreground">
          开通VIP会员，畅享海量优质内容
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {vipFeatures.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">选择会员套餐</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {vipPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isPopular ? 'border-yellow-500 shadow-lg' : ''
              }`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-yellow-900">
                  最受欢迎
                </Badge>
              )}
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-muted-foreground line-through ml-2">
                      ¥{plan.originalPrice}
                    </span>
                  )}
                </div>
                {plan.discount && (
                  <Badge variant="secondary" className="mb-4">
                    {plan.discount}
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.duration === -1 ? '永久有效' : `${plan.duration}天有效期`}
                </p>
                <Button
                  className={`w-full ${
                    plan.isPopular
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
                      : ''
                  }`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                >
                  立即开通
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            会员权益对比
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">权益</th>
                  <th className="text-center py-3 px-4">普通用户</th>
                  <th className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      VIP会员
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: '免费内容', free: '✓', vip: '✓' },
                  { feature: 'VIP专属内容', free: '✗', vip: '✓' },
                  { feature: '广告', free: '有广告', vip: '无广告' },
                  { feature: '画质', free: '720P', vip: '1080P/4K' },
                  { feature: '下载', free: '✗', vip: '✓' },
                  { feature: '抢先看', free: '✗', vip: '✓' },
                  { feature: '专属客服', free: '✗', vip: '✓' },
                ].map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-3 px-4">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">
                      {row.free}
                    </td>
                    <td className="text-center py-3 px-4 text-yellow-600 dark:text-yellow-400 font-medium">
                      {row.vip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { q: 'VIP会员可以退款吗？', a: '开通后不支持退款，请谨慎购买。' },
            { q: '会员可以共享吗？', a: '会员账号仅限个人使用，禁止共享。' },
            { q: '如何取消自动续费？', a: '在账户设置中可以随时取消自动续费。' },
            { q: '支持哪些支付方式？', a: '支持支付宝、微信支付、银行卡等多种方式。' },
          ].map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
