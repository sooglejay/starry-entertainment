# 星影娱乐 🌟

一站式影视娱乐平台，集成电影、电视剧、动漫、漫画、小说、游戏等多种娱乐内容，支持VIP会员、金币充值、IM聊天及后台管理。

## 功能特性

- 🎬 **影视内容** - 电影、电视剧、动漫等视频内容
- 📚 **阅读娱乐** - 漫画、小说在线阅读
- 🎮 **娱乐小游戏** - 多种休闲游戏
- 💬 **IM即时通讯** - 用户聊天互动
- 💰 **会员系统** - VIP会员订阅、金币充值
- 🪙 **加密货币支付** - 支持USDT/BTC/ETH等加密货币支付
- 🎨 **主题配置** - 支持明暗主题切换
- 📱 **响应式设计** - 适配多端设备
- 🔧 **管理后台** - 内容管理、用户管理、支付配置等

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 16 | 全栈框架 (App Router) |
| React | 19 | UI框架 |
| TypeScript | 5 | 类型安全 |
| Tailwind CSS | 4 | 原子化CSS |
| shadcn/ui | latest | UI组件库 |
| Supabase | - | PostgreSQL数据库 |
| coze-coding-dev-sdk | - | LLM集成 |

## 快速开始

### 环境要求

- Node.js 18+ 
- pnpm 9+ （必须使用pnpm，不支持npm/yarn）

### 安装依赖

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 克隆项目
git clone https://github.com/sooglejay/starry-entertainment.git
cd starry-entertainment

# 安装依赖
pnpm install
```

### 环境变量配置

创建 `.env.local` 文件：

```env
# Supabase 数据库配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 对象存储配置 (S3兼容)
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_BUCKET=your_bucket_name
S3_REGION=your_region
S3_ENDPOINT=your_endpoint

# LLM配置 (可选)
COZE_API_KEY=your_coze_api_key
```

### 启动开发服务器

```bash
pnpm dev
```

启动后访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── globals.css              # 全局样式
│   ├── wallet/                  # 钱包页面（金币充值、加密货币支付）
│   ├── admin/                   # 管理后台
│   │   └── payment/             # 支付配置管理
│   └── api/                     # API路由
│       └── crypto/              # 加密货币支付API
├── components/                  # React组件
│   └── ui/                      # shadcn/ui基础组件
├── hooks/                       # 自定义Hooks
├── lib/                         # 工具函数
└── storage/                     # 存储层
    └── database/                # 数据库配置与Schema
```

## 核心功能模块

### 加密货币支付

支持多种加密货币支付：
- USDT (TRC20/ERC20)
- BTC (Bitcoin)
- ETH (Ethereum)

支付流程：
1. 用户选择加密货币类型
2. 选择充值套餐（金币或VIP）
3. 系统生成收款地址和订单
4. 用户转账到指定地址
5. 区块链确认后自动发放奖励

### 管理后台

访问 `/admin` 进入管理后台：
- 用户管理
- 影视内容管理
- 会员管理
- 金币管理
- **支付配置** - 加密货币、收款钱包、套餐管理
- 聊天管理
- 游戏管理
- 漫画/小说管理
- 广告管理
- 主题配置

## 开发规范

### 包管理器

**必须使用 pnpm**，项目已配置强制检查：

```bash
# ✅ 正确
pnpm add package-name

# ❌ 错误 - 会报错
npm install package-name
yarn add package-name
```

### 组件开发

优先使用 shadcn/ui 组件：

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>标题</CardHeader>
      <CardContent>
        <Button>提交</Button>
      </CardContent>
    </Card>
  );
}
```

### 样式开发

使用 Tailwind CSS：

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "flex items-center gap-4",
  isActive && "bg-primary"
)}>
```

## 许可证

MIT License
