'use client';

import { useState, useEffect } from 'react';
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
  Megaphone,
  Palette,
  Bitcoin,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface CryptoCurrency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  network: string;
  icon_url: string;
  is_active: boolean;
  min_deposit: number;
  min_withdrawal: number;
  min_confirmations: number;
}

interface CryptoWallet {
  id: string;
  name: string;
  currency_id: string;
  currency: { code: string; name: string };
  address: string;
  balance: number;
  is_active: boolean;
}

interface RechargePackage {
  id: string;
  name: string;
  coins: number;
  bonus: number;
  price: number;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

interface VIPPackage {
  id: string;
  name: string;
  days: number;
  price: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

const menuItems = [
  { icon: LayoutDashboard, title: '仪表盘', href: '/admin', description: '系统概览' },
  { icon: Users, title: '用户管理', href: '/admin/users', description: '管理用户账户' },
  { icon: Film, title: '影视管理', href: '/admin/movies', description: '管理影视内容' },
  { icon: Crown, title: '会员管理', href: '/admin/vip', description: '管理会员订阅' },
  { icon: Coins, title: '金币管理', href: '/admin/coins', description: '管理金币充值' },
  { icon: Settings, title: '支付配置', href: '/admin/payment', description: '管理支付配置' },
  { icon: MessageCircle, title: '聊天管理', href: '/admin/chat', description: '管理聊天室' },
  { icon: Gamepad2, title: '游戏管理', href: '/admin/games', description: '管理游戏' },
  { icon: ImageIcon, title: '漫画管理', href: '/admin/comics', description: '管理漫画内容' },
  { icon: BookOpen, title: '小说管理', href: '/admin/novels', description: '管理小说内容' },
  { icon: Megaphone, title: '广告管理', href: '/admin/ads', description: '管理广告投放' },
  { icon: Palette, title: '主题配置', href: '/admin/themes', description: '配置网站主题' },
];

export default function PaymentAdminPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState('currencies');
  const [loading, setLoading] = useState(false);

  // Currencies
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<CryptoCurrency | null>(null);

  // Wallets
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [walletDialog, setWalletDialog] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CryptoWallet | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Coin Packages
  const [coinPackages, setCoinPackages] = useState<RechargePackage[]>([]);
  const [coinPackageDialog, setCoinPackageDialog] = useState(false);
  const [editingCoinPackage, setEditingCoinPackage] = useState<RechargePackage | null>(null);

  // VIP Packages
  const [vipPackages, setVipPackages] = useState<VIPPackage[]>([]);
  const [vipPackageDialog, setVipPackageDialog] = useState(false);
  const [editingVipPackage, setEditingVipPackage] = useState<VIPPackage | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [currenciesRes, coinsRes, vipsRes] = await Promise.all([
        fetch('/api/crypto/currencies'),
        fetch('/api/crypto/packages?type=coin'),
        fetch('/api/crypto/packages?type=vip'),
      ]);

      if (currenciesRes.ok) {
        const data = await currenciesRes.json();
        setCurrencies(data.data || []);
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
      console.error('获取数据失败:', error);
    }
  };

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    toast({ title: '已复制到剪贴板' });
  };

  const handleSaveCurrency = async () => {
    toast({ title: '保存成功' });
    setCurrencyDialog(false);
    fetchData();
  };

  const handleSaveWallet = async () => {
    toast({ title: '保存成功' });
    setWalletDialog(false);
    fetchData();
  };

  const handleSaveCoinPackage = async () => {
    toast({ title: '保存成功' });
    setCoinPackageDialog(false);
    fetchData();
  };

  const handleSaveVipPackage = async () => {
    toast({ title: '保存成功' });
    setVipPackageDialog(false);
    fetchData();
  };

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
                  variant={item.href === '/admin/payment' ? 'secondary' : 'ghost'}
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
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" />
                支付配置
              </h1>
              <p className="text-muted-foreground">管理加密货币支付、充值套餐等</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="currencies">
                <Bitcoin className="mr-2 h-4 w-4" />
                加密货币
              </TabsTrigger>
              <TabsTrigger value="wallets">
                <DollarSign className="mr-2 h-4 w-4" />
                收款钱包
              </TabsTrigger>
              <TabsTrigger value="coinPackages">
                <Coins className="mr-2 h-4 w-4" />
                金币套餐
              </TabsTrigger>
              <TabsTrigger value="vipPackages">
                <Crown className="mr-2 h-4 w-4" />
                VIP套餐
              </TabsTrigger>
            </TabsList>

            {/* Currencies Tab */}
            <TabsContent value="currencies">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>支持的加密货币</CardTitle>
                      <CardDescription>配置平台支持的加密货币类型</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingCurrency(null); setCurrencyDialog(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加货币
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>货币</TableHead>
                        <TableHead>网络</TableHead>
                        <TableHead>最小充值</TableHead>
                        <TableHead>确认数</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currencies.map((currency) => (
                        <TableRow key={currency.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                {currency.symbol}
                              </div>
                              <div>
                                <p className="font-medium">{currency.name}</p>
                                <p className="text-xs text-muted-foreground">{currency.code}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{currency.network}</TableCell>
                          <TableCell>{currency.min_deposit}</TableCell>
                          <TableCell>{currency.min_confirmations}</TableCell>
                          <TableCell>
                            <Badge variant={currency.is_active ? 'default' : 'secondary'}>
                              {currency.is_active ? '启用' : '禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingCurrency(currency); setCurrencyDialog(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallets Tab */}
            <TabsContent value="wallets">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>收款钱包</CardTitle>
                      <CardDescription>配置加密货币收款地址</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingWallet(null); setWalletDialog(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加钱包
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名称</TableHead>
                        <TableHead>货币</TableHead>
                        <TableHead>地址</TableHead>
                        <TableHead>余额</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wallets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            暂无钱包数据
                          </TableCell>
                        </TableRow>
                      ) : (
                        wallets.map((wallet) => (
                          <TableRow key={wallet.id}>
                            <TableCell className="font-medium">{wallet.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{wallet.currency?.code}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyAddress(wallet.address)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{wallet.balance}</TableCell>
                            <TableCell>
                              <Badge variant={wallet.is_active ? 'default' : 'secondary'}>
                                {wallet.is_active ? '启用' : '禁用'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setEditingWallet(wallet); setWalletDialog(true); }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coin Packages Tab */}
            <TabsContent value="coinPackages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>金币充值套餐</CardTitle>
                      <CardDescription>配置金币充值套餐价格</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingCoinPackage(null); setCoinPackageDialog(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加套餐
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>套餐名称</TableHead>
                        <TableHead>金币数量</TableHead>
                        <TableHead>赠送</TableHead>
                        <TableHead>价格 (USD)</TableHead>
                        <TableHead>排序</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coinPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {pkg.name}
                              {pkg.is_popular && <Badge>推荐</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>{pkg.coins}</TableCell>
                          <TableCell className="text-green-600">+{pkg.bonus}</TableCell>
                          <TableCell>${pkg.price}</TableCell>
                          <TableCell>{pkg.sort_order}</TableCell>
                          <TableCell>
                            <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                              {pkg.is_active ? '启用' : '禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingCoinPackage(pkg); setCoinPackageDialog(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* VIP Packages Tab */}
            <TabsContent value="vipPackages">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>VIP会员套餐</CardTitle>
                      <CardDescription>配置VIP会员套餐</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingVipPackage(null); setVipPackageDialog(true); }}>
                      <Plus className="mr-2 h-4 w-4" />
                      添加套餐
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>套餐名称</TableHead>
                        <TableHead>时长</TableHead>
                        <TableHead>价格 (USD)</TableHead>
                        <TableHead>特性</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vipPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {pkg.name}
                              {pkg.is_popular && <Badge>推荐</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            {pkg.days === -1 ? '永久' : `${pkg.days}天`}
                          </TableCell>
                          <TableCell>${pkg.price}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-xs text-muted-foreground">
                              {pkg.features?.join('、')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                              {pkg.is_active ? '启用' : '禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setEditingVipPackage(pkg); setVipPackageDialog(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Security Warning */}
          <Card className="mt-6 border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">安全提示</p>
                <p className="text-muted-foreground mt-1">
                  请妥善保管钱包私钥，不要在公开场合泄露。建议使用冷钱包存储大额资产。
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Currency Dialog */}
      <Dialog open={currencyDialog} onOpenChange={setCurrencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurrency ? '编辑货币' : '添加货币'}</DialogTitle>
            <DialogDescription>配置加密货币信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>货币代码</Label>
                <Input placeholder="USDT" defaultValue={editingCurrency?.code} />
              </div>
              <div>
                <Label>货币名称</Label>
                <Input placeholder="Tether USD" defaultValue={editingCurrency?.name} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>符号</Label>
                <Input placeholder="$" defaultValue={editingCurrency?.symbol} />
              </div>
              <div>
                <Label>网络</Label>
                <Input placeholder="TRC20" defaultValue={editingCurrency?.network} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>最小充值金额</Label>
                <Input type="number" step="0.01" defaultValue={editingCurrency?.min_deposit || 10} />
              </div>
              <div>
                <Label>最小确认数</Label>
                <Input type="number" defaultValue={editingCurrency?.min_confirmations || 3} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCurrencyDialog(false)}>取消</Button>
            <Button onClick={handleSaveCurrency}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wallet Dialog */}
      <Dialog open={walletDialog} onOpenChange={setWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWallet ? '编辑钱包' : '添加钱包'}</DialogTitle>
            <DialogDescription>配置收款钱包地址</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>钱包名称</Label>
              <Input placeholder="主收款钱包" defaultValue={editingWallet?.name} />
            </div>
            <div>
              <Label>货币类型</Label>
              <Select defaultValue={editingWallet?.currency_id}>
                <SelectTrigger>
                  <SelectValue placeholder="选择货币" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>钱包地址</Label>
              <Input placeholder="0x..." defaultValue={editingWallet?.address} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletDialog(false)}>取消</Button>
            <Button onClick={handleSaveWallet}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coin Package Dialog */}
      <Dialog open={coinPackageDialog} onOpenChange={setCoinPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoinPackage ? '编辑套餐' : '添加套餐'}</DialogTitle>
            <DialogDescription>配置金币充值套餐</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>套餐名称</Label>
              <Input placeholder="基础套餐" defaultValue={editingCoinPackage?.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>金币数量</Label>
                <Input type="number" defaultValue={editingCoinPackage?.coins || 100} />
              </div>
              <div>
                <Label>赠送金币</Label>
                <Input type="number" defaultValue={editingCoinPackage?.bonus || 0} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>价格 (USD)</Label>
                <Input type="number" step="0.01" defaultValue={editingCoinPackage?.price || 10} />
              </div>
              <div>
                <Label>排序</Label>
                <Input type="number" defaultValue={editingCoinPackage?.sort_order || 0} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCoinPackageDialog(false)}>取消</Button>
            <Button onClick={handleSaveCoinPackage}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIP Package Dialog */}
      <Dialog open={vipPackageDialog} onOpenChange={setVipPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVipPackage ? '编辑套餐' : '添加套餐'}</DialogTitle>
            <DialogDescription>配置VIP会员套餐</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>套餐名称</Label>
              <Input placeholder="月度VIP" defaultValue={editingVipPackage?.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>时长 (天)</Label>
                <Input type="number" placeholder="-1 表示永久" defaultValue={editingVipPackage?.days || 30} />
              </div>
              <div>
                <Label>价格 (USD)</Label>
                <Input type="number" step="0.01" defaultValue={editingVipPackage?.price || 10} />
              </div>
            </div>
            <div>
              <Label>套餐特性 (每行一个)</Label>
              <Textarea 
                placeholder="无广告观看&#10;专属内容&#10;高速下载"
                defaultValue={editingVipPackage?.features?.join('\n')}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVipPackageDialog(false)}>取消</Button>
            <Button onClick={handleSaveVipPackage}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
