# 星影娱乐 - 一站式影视娱乐平台

## 项目概述

星影娱乐是一个功能丰富的影视娱乐平台，集成了电影、电视剧、动漫、漫画、小说、游戏等多种娱乐内容。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 组件**: shadcn/ui + Tailwind CSS 4
- **数据库**: Supabase (PostgreSQL)
- **对象存储**: S3 兼容存储
- **AI 能力**: coze-coding-dev-sdk (LLM)

## 核心功能

### 1. 影视播放系统
- 支持电影、电视剧、动漫、综艺、纪录片等多种类型
- 自研视频播放器，支持全屏、倍速、画中画等功能
- 观看历史记录和进度保存

### 2. 会员订阅系统
- 多种会员套餐（月度、季度、年度、终身）
- VIP 专属内容解锁
- 免广告观影体验

### 3. 金币充值系统
- 多种充值套餐
- 游戏奖励金币
- 签到赠送金币

### 4. IM 即时通讯
- 多类型聊天室（公开、私有、VIP专属）
- 实时消息发送
- 表情、图片、礼物支持

### 5. 娱乐游戏
- 多种休闲小游戏
- 排行榜系统
- 金币奖励机制

### 6. 内容模块
- 漫画阅读器
- 小说阅读器
- 趣味图库

### 7. 广告系统
- 多种广告位支持
- 用户定向投放
- 展示统计

### 8. 后台管理
- 用户管理
- 内容管理
- 数据统计
- 主题配置

### 9. 主题系统
- 浅色/深色/自动切换
- 自定义主题色
- 响应式设计

## API 接口

### 影视相关
- `GET /api/movies` - 获取影视列表
- `POST /api/movies` - 创建影视内容

### 用户相关
- `GET /api/user` - 获取用户信息
- `PUT /api/user` - 更新用户信息

### AI 推荐
- `POST /api/recommend` - AI 智能推荐

### 数据初始化
- `POST /api/seed` - 初始化示例数据

## 数据库结构

项目包含以下主要数据表：

- **用户系统**: users, user_profiles, user_settings
- **会员系统**: memberships, vip_packages
- **金币系统**: coin_balances, coin_transactions, recharge_packages
- **影视系统**: movies, episodes
- **漫画系统**: comics, comic_chapters
- **小说系统**: novels, novel_chapters
- **图库系统**: galleries
- **聊天系统**: chat_rooms, chat_room_members, chat_messages, private_messages
- **游戏系统**: games, game_scores
- **广告系统**: ads, ad_clicks
- **系统配置**: site_config, themes, ui_components

## 快速开始

1. 访问首页查看推荐内容
2. 点击导航浏览不同板块
3. 点击内容卡片查看详情
4. 使用主题切换按钮切换深色模式
5. 调用 `/api/seed` 接口初始化示例数据

## 页面路由

- `/` - 首页
- `/movies` - 影视列表
- `/movies/[id]` - 影视详情/播放
- `/comics` - 漫画列表
- `/novels` - 小说列表
- `/gallery` - 图库
- `/games` - 游戏中心
- `/chat` - 聊天室
- `/vip` - VIP 会员中心
- `/wallet` - 钱包/充值
- `/admin` - 后台管理

## 开发说明

- 使用 `pnpm` 作为包管理器
- 项目已配置热更新，修改代码自动刷新
- 使用 Supabase SDK 进行数据库操作
- 支持对象存储上传和管理媒体文件
- 集成 AI 能力提供智能推荐服务

## 许可证

MIT License
