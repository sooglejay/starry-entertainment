'use client';

import { Suspense, useState, useEffect } from 'react';
import {
  Coins,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  CreditCard,
  History,
  Sparkles,
  Bitcoin,
  Copy,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs as UITabs } from '@/components/ui/tabs';

interface RechargePackage {
  id: string;
  name: string;
  coins: number;
  bonus: number;
  price: number;
  is_popular: boolean;
}

interface VIPPackage {
  id: string;
  name: string;
  days: number;
  price: number;
  features: string[];
  is_popular: boolean;
}

interface CryptoCurrency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  icon_url: string;
  min_deposit: number;
}

interface CryptoPayment {
  id: string;
  order_no: string;
  type: 'coin' | 'vip';
  status: string;
  to_address: string;
  amount: number;
  currency: {
    code: string;
    name: string;
  };
  expired_at: string;
  paid_at?: string;
  confirmed_at?: string;
  tx_hash?: string;
  confirmations?: number;
}

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
  const { toast } = useToast();
  const [paymentTab, setPaymentTab] = useState<'fiat' | 'crypto'>('fiat');
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [coinPackages, setCoinPackages] = useState<RechargePackage[]>([]);
  const [vipPackages, setVipPackages] = useState<VIPPackage[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<RechargePackage | VIPPackage | null>(null);
  const [packageType, setPackageType] = useState<'coin' | 'vip'>('coin');
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<CryptoPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const [currenciesRes, coinsRes, vipsRes] = await Promise.all([
        fetch('/api/crypto/currencies'),
        fetch('/api/crypto/packages?type=coin'),
        fetch('/api/crypto/packages?type=vip'),
      ]);

      if (currenciesRes.ok) {
        const data = await currenciesRes.json();
        setCurrencies(data.data || []);
        if (data.data?.length > 0) {
          setSelectedCurrency(data.data[0]);
        }
      }

      if (coinsRes.ok) {
        const data = await coinsRes.json();
        setCoinPackages(data.data || []);
      }

      if (vipsRes.ok) {
        const data = await vipsRes.json();
        setVipPackages(data.data || []);
      }
    } catch (error) {
      console.error('获取加密货币数据失败:', error);
    }
  };

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: '已复制到剪贴板' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreatePayment = async () => {
    if (!selectedCurrency || !selectedPackage) {
      toast({ title: '请选择货币和套餐', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/crypto/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currencyId: selectedCurrency.id,
          type: packageType,
          packageId: selectedPackage.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentPayment(data.data);
        setPaymentDialog(true);
      } else {
        toast({ title: data.error || '创建订单失败', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: '创建订单失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = (expiredAt: string) => {
    const remaining = new Date(expiredAt).getTime() - Date.now();
    if (remaining <= 0) return '已过期';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: '待支付', variant: 'secondary' },
      paid: { label: '已支付', variant: 'default' },
      confirmed: { label: '已完成', variant: 'default' },
      cancelled: { label: '已取消', variant: 'destructive' },
      expired: { label: '已过期', variant: 'destructive' },
    };
    const config = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
          {/* Payment Method Selector */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Button
                  variant={paymentTab === 'fiat' ? 'default' : 'outline'}
                  onClick={() => setPaymentTab('fiat')}
                  className="flex-1"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  法币支付
                </Button>
                <Button
                  variant={paymentTab === 'crypto' ? 'default' : 'outline'}
                  onClick={() => setPaymentTab('crypto')}
                  className="flex-1"
                >
                  <Bitcoin className="mr-2 h-4 w-4" />
                  加密货币
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fiat Payment */}
          {paymentTab === 'fiat' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  选择充值金额
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((id) => (
                    <div
                      key={id}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                        id === 3 ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      {id === 3 && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                          推荐
                        </Badge>
                      )}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Coins className="h-6 w-6 text-yellow-500" />
                          <span className="text-2xl font-bold">{id * 1000}</span>
                        </div>
                        <p className="text-xl font-semibold">¥{id * 100}</p>
                        <Button className="w-full mt-3" variant={id === 3 ? 'default' : 'outline'}>
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
          )}

          {/* Crypto Payment */}
          {paymentTab === 'crypto' && (
            <div className="space-y-6">
              {/* Currency Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5" />
                    选择加密货币
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currencies.map((currency) => (
                      <div
                        key={currency.id}
                        onClick={() => setSelectedCurrency(currency)}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCurrency?.id === currency.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                          {currency.symbol}
                        </div>
                        <div>
                          <p className="font-medium">{currency.name}</p>
                          <p className="text-sm text-muted-foreground">{currency.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Package Type Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>选择套餐类型</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant={packageType === 'coin' ? 'default' : 'outline'}
                      onClick={() => setPackageType('coin')}
                    >
                      <Coins className="mr-2 h-4 w-4" />
                      金币充值
                    </Button>
                    <Button
                      variant={packageType === 'vip' ? 'default' : 'outline'}
                      onClick={() => setPackageType('vip')}
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      VIP会员
                    </Button>
                  </div>

                  {/* Coin Packages */}
                  {packageType === 'coin' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {coinPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                        >
                          {pkg.is_popular && (
                            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
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
                            <p className="text-sm text-muted-foreground">${pkg.price} USD</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIP Packages */}
                  {packageType === 'vip' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {vipPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedPackage?.id === pkg.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                        >
                          {pkg.is_popular && (
                            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                              最受欢迎
                            </Badge>
                          )}
                          <div className="text-center mb-4">
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            <p className="text-2xl font-bold mt-2">${pkg.price}</p>
                          </div>
                          <ul className="space-y-2 text-sm">
                            {pkg.features?.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full mt-6"
                    onClick={handleCreatePayment}
                    disabled={!selectedCurrency || !selectedPackage || loading}
                  >
                    {loading ? '创建订单中...' : '立即支付'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5" />
              加密货币支付
            </DialogTitle>
            <DialogDescription>
              请向以下地址转账 {currentPayment?.amount} {currentPayment?.currency?.code}
            </DialogDescription>
          </DialogHeader>

          {currentPayment && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">订单状态</span>
                {getStatusBadge(currentPayment.status)}
              </div>

              {/* Address */}
              <div>
                <Label className="text-sm text-muted-foreground">收款地址</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={currentPayment.to_address}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyAddress(currentPayment.to_address)}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">订单号</span>
                  <span className="font-mono">{currentPayment.order_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">剩余时间</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    {formatRemainingTime(currentPayment.expired_at)}
                  </span>
                </div>
              </div>

              {/* Transaction Hash (if paid) */}
              {currentPayment.tx_hash && (
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">已检测到支付</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 font-mono truncate">
                    TX: {currentPayment.tx_hash}
                  </p>
                  {currentPayment.confirmations && (
                    <p className="text-xs text-muted-foreground mt-1">
                      确认数: {currentPayment.confirmations}
                    </p>
                  )}
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-400">
                  <p>请勿向此地址转账其他币种，否则将无法到账。</p>
                  <p className="mt-1">转账后请等待区块链网络确认。</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setPaymentDialog(false)}>
              关闭
            </Button>
            {currentPayment?.tx_hash && (
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                查看交易
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
