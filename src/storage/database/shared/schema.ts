import { pgTable, serial, timestamp, text, integer, boolean, decimal, jsonb, varchar, bigint, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ==================== 用户系统 ====================

// 用户基础信息
export const users = pgTable("users", {
  id: serial().notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  avatar: text("avatar"),
  role: varchar("role", { length: 20 }).default('user').notNull(), // user, vip, admin
  status: varchar("status", { length: 20 }).default('active').notNull(), // active, banned, deleted
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_users_email").on(table.email),
  index("idx_users_username").on(table.username),
]);

// 用户详细资料
export const userProfiles = pgTable("user_profiles", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  nickname: varchar("nickname", { length: 100 }),
  bio: text("bio"),
  gender: varchar("gender", { length: 10 }),
  birthday: timestamp("birthday", { mode: 'string' }),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_user_profiles_user_id").on(table.userId),
]);

// 用户设置
export const userSettings = pgTable("user_settings", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  theme: varchar("theme", { length: 20 }).default('system').notNull(), // light, dark, system
  autoDarkMode: boolean("auto_dark_mode").default(true).notNull(),
  language: varchar("language", { length: 10 }).default('zh-CN').notNull(),
  notifications: jsonb("notifications").default({ email: true, push: true, sms: false }).notNull(),
  playbackSettings: jsonb("playback_settings").default({ autoPlay: true, quality: 'auto', volume: 1 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_user_settings_user_id").on(table.userId),
]);

// ==================== 会员和金币系统 ====================

// 会员订阅
export const memberships = pgTable("memberships", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  planType: varchar("plan_type", { length: 20 }).notNull(), // monthly, quarterly, yearly, lifetime
  status: varchar("status", { length: 20 }).default('active').notNull(), // active, expired, cancelled
  startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
  autoRenew: boolean("auto_renew").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_memberships_user_id").on(table.userId),
  index("idx_memberships_status").on(table.status),
]);

// 金币余额
export const coinBalances = pgTable("coin_balances", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  balance: integer("balance").default(0).notNull(),
  totalEarned: integer("total_earned").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_coin_balances_user_id").on(table.userId),
]);

// 金币交易记录
export const coinTransactions = pgTable("coin_transactions", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type", { length: 20 }).notNull(), // recharge, spend, earn, refund, gift
  amount: integer("amount").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  description: text("description"),
  referenceType: varchar("reference_type", { length: 50 }), // movie, game, vip, etc.
  referenceId: integer("reference_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_coin_transactions_user_id").on(table.userId),
  index("idx_coin_transactions_type").on(table.type),
  index("idx_coin_transactions_created_at").on(table.createdAt),
]);

// ==================== 影视内容 ====================

// 影视内容
export const movies = pgTable("movies", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  originalTitle: varchar("original_title", { length: 255 }),
  type: varchar("type", { length: 20 }).notNull(), // movie, tv_series, anime, documentary, variety
  description: text("description"),
  poster: text("poster"),
  backdrop: text("backdrop"),
  trailer: text("trailer"),
  releaseYear: integer("release_year"),
  duration: integer("duration"), // 分钟
  rating: decimal("rating", { precision: 3, scale: 1 }).default('0.0'),
  ratingCount: integer("rating_count").default(0),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(), // active, inactive, deleted
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  coinPrice: integer("coin_price").default(0), // 需要金币购买的价格
  tags: jsonb("tags").default([]).notNull(), // 标签数组
  categories: jsonb("categories").default([]).notNull(), // 分类数组
  actors: jsonb("actors").default([]).notNull(), // 演员数组
  directors: jsonb("directors").default([]).notNull(), // 导演数组
  source: varchar("source", { length: 100 }), // 来源平台
  sourceUrl: text("source_url"), // 来源URL
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_movies_type").on(table.type),
  index("idx_movies_status").on(table.status),
  index("idx_movies_rating").on(table.rating),
  index("idx_movies_views").on(table.views),
  index("idx_movies_release_year").on(table.releaseYear),
]);

// 剧集
export const episodes = pgTable("episodes", {
  id: serial().notNull().primaryKey(),
  movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: 'cascade' }),
  seasonNumber: integer("season_number").default(1),
  episodeNumber: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
  videoUrl: text("video_url"),
  sourceUrl: text("source_url"),
  views: integer("views").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_episodes_movie_id").on(table.movieId),
  index("idx_episodes_season").on(table.seasonNumber, table.episodeNumber),
]);

// ==================== 漫画、小说、图库 ====================

// 漫画
export const comics = pgTable("comics", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 100 }),
  description: text("description"),
  cover: text("cover"),
  type: varchar("type", { length: 20 }).notNull(), // manga, manhua, manhwa, comic
  status: varchar("status", { length: 20 }).default('ongoing').notNull(), // ongoing, completed, hiatus
  chapters: integer("chapters").default(0),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  coinPrice: integer("coin_price").default(0),
  tags: jsonb("tags").default([]).notNull(),
  categories: jsonb("categories").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_comics_type").on(table.type),
  index("idx_comics_status").on(table.status),
  index("idx_comics_views").on(table.views),
]);

// 漫画章节
export const comicChapters = pgTable("comic_chapters", {
  id: serial().notNull().primaryKey(),
  comicId: integer("comic_id").notNull().references(() => comics.id, { onDelete: 'cascade' }),
  chapterNumber: integer("chapter_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  images: jsonb("images").default([]).notNull(), // 图片URL数组
  views: integer("views").default(0),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_comic_chapters_comic_id").on(table.comicId),
]);

// 小说
export const novels = pgTable("novels", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 100 }),
  description: text("description"),
  cover: text("cover"),
  type: varchar("type", { length: 20 }).notNull(), // fantasy, romance, scifi, etc.
  status: varchar("status", { length: 20 }).default('ongoing').notNull(),
  words: bigint("words", { mode: 'number' }).default(0),
  chapters: integer("chapters").default(0),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  coinPrice: integer("coin_price").default(0),
  tags: jsonb("tags").default([]).notNull(),
  categories: jsonb("categories").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_novels_type").on(table.type),
  index("idx_novels_status").on(table.status),
  index("idx_novels_views").on(table.views),
]);

// 小说章节
export const novelChapters = pgTable("novel_chapters", {
  id: serial().notNull().primaryKey(),
  novelId: integer("novel_id").notNull().references(() => novels.id, { onDelete: 'cascade' }),
  chapterNumber: integer("chapter_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  words: integer("words").default(0),
  views: integer("views").default(0),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_novel_chapters_novel_id").on(table.novelId),
]);

// 图库（猎奇图片等）
export const galleries = pgTable("galleries", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  cover: text("cover"),
  type: varchar("type", { length: 20 }).notNull(), // curious, funny, art, nature, etc.
  images: jsonb("images").default([]).notNull(), // 图片URL数组
  imageCount: integer("image_count").default(0),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  tags: jsonb("tags").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_galleries_type").on(table.type),
  index("idx_galleries_views").on(table.views),
]);

// ==================== 用户交互 ====================

// 观看历史
export const watchHistory = pgTable("watch_history", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  movieId: integer("movie_id").notNull().references(() => movies.id, { onDelete: 'cascade' }),
  episodeId: integer("episode_id").references(() => episodes.id, { onDelete: 'cascade' }),
  progress: integer("progress").default(0), // 观看进度（秒）
  duration: integer("duration").default(0), // 总时长
  completed: boolean("completed").default(false).notNull(),
  lastWatchedAt: timestamp("last_watched_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_watch_history_user_id").on(table.userId),
  index("idx_watch_history_movie_id").on(table.movieId),
]);

// 收藏
export const favorites = pgTable("favorites", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: varchar("target_type", { length: 20 }).notNull(), // movie, comic, novel, gallery
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_favorites_user_id").on(table.userId),
  index("idx_favorites_target").on(table.targetType, table.targetId),
]);

// 评论
export const comments = pgTable("comments", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: varchar("target_type", { length: 20 }).notNull(), // movie, comic, novel, gallery, game
  targetId: integer("target_id").notNull(),
  parentId: integer("parent_id").references((): any => comments.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(), // active, hidden, deleted
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_comments_user_id").on(table.userId),
  index("idx_comments_target").on(table.targetType, table.targetId),
  index("idx_comments_parent_id").on(table.parentId),
]);

// 点赞
export const likes = pgTable("likes", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: varchar("target_type", { length: 20 }).notNull(), // movie, comic, novel, gallery, game, comment
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_likes_user_id").on(table.userId),
  index("idx_likes_target").on(table.targetType, table.targetId),
]);

// ==================== IM即时通讯 ====================

// 聊天室
export const chatRooms = pgTable("chat_rooms", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).default('public').notNull(), // public, private, group
  avatar: text("avatar"),
  ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  memberCount: integer("member_count").default(1),
  maxMembers: integer("max_members").default(100),
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_chat_rooms_type").on(table.type),
  index("idx_chat_rooms_owner_id").on(table.ownerId),
]);

// 聊天室成员
export const chatRoomMembers = pgTable("chat_room_members", {
  id: serial().notNull().primaryKey(),
  roomId: integer("room_id").notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar("role", { length: 20 }).default('member').notNull(), // owner, admin, member
  lastReadAt: timestamp("last_read_at", { withTimezone: true, mode: 'string' }),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_chat_room_members_room_id").on(table.roomId),
  index("idx_chat_room_members_user_id").on(table.userId),
]);

// 聊天消息
export const chatMessages = pgTable("chat_messages", {
  id: serial().notNull().primaryKey(),
  roomId: integer("room_id").notNull().references(() => chatRooms.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  type: varchar("type", { length: 20 }).default('text').notNull(), // text, image, gift, system
  metadata: jsonb("metadata").default({}), // 额外数据
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_chat_messages_room_id").on(table.roomId),
  index("idx_chat_messages_user_id").on(table.userId),
  index("idx_chat_messages_created_at").on(table.createdAt),
]);

// 私信
export const privateMessages = pgTable("private_messages", {
  id: serial().notNull().primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: integer("receiver_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  type: varchar("type", { length: 20 }).default('text').notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_private_messages_sender_id").on(table.senderId),
  index("idx_private_messages_receiver_id").on(table.receiverId),
]);

// ==================== 游戏系统 ====================

// 游戏列表
export const games = pgTable("games", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  cover: text("cover"),
  type: varchar("type", { length: 20 }).notNull(), // puzzle, action, card, casual, etc.
  url: text("url"), // 游戏链接或嵌入代码
  coinReward: integer("coin_reward").default(0), // 游戏奖励金币
  isVipOnly: boolean("is_vip_only").default(false).notNull(),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  playCount: integer("play_count").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_games_type").on(table.type),
  index("idx_games_status").on(table.status),
  index("idx_games_play_count").on(table.playCount),
]);

// 游戏分数
export const gameScores = pgTable("game_scores", {
  id: serial().notNull().primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  score: bigint("score", { mode: 'number' }).notNull(),
  level: integer("level").default(1),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_game_scores_game_id").on(table.gameId),
  index("idx_game_scores_user_id").on(table.userId),
  index("idx_game_scores_score").on(table.score),
]);

// ==================== 广告系统 ====================

// 广告配置
export const ads = pgTable("ads", {
  id: serial().notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // banner, popup, video, native
  position: varchar("position", { length: 50 }).notNull(), // home_top, player_before, sidebar, etc.
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  linkUrl: text("link_url"),
  html: text("html"), // 自定义HTML广告
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration").default(5), // 视频广告时长（秒）
  skipAfter: integer("skip_after").default(5), // 跳过时间
  targetUser: varchar("target_user", { length: 20 }).default('all').notNull(), // all, free, vip
  priority: integer("priority").default(0),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }),
  endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_ads_type").on(table.type),
  index("idx_ads_position").on(table.position),
  index("idx_ads_status").on(table.status),
]);

// 广告点击记录
export const adClicks = pgTable("ad_clicks", {
  id: serial().notNull().primaryKey(),
  adId: integer("ad_id").notNull().references(() => ads.id, { onDelete: 'cascade' }),
  userId: integer("user_id").references(() => users.id, { onDelete: 'set null' }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_ad_clicks_ad_id").on(table.adId),
  index("idx_ad_clicks_created_at").on(table.createdAt),
]);

// ==================== 系统配置 ====================

// 网站配置
export const siteConfig = pgTable("site_config", {
  id: serial().notNull().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_site_config_key").on(table.key),
]);

// 主题配置
export const themes = pgTable("themes", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).default('color').notNull(), // color, dark, light, custom
  colors: jsonb("colors").notNull(), // 主题色配置
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_themes_name").on(table.name),
  index("idx_themes_type").on(table.type),
]);

// UI组件配置（拖拽定制）
export const uiComponents = pgTable("ui_components", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // banner, carousel, grid, list, sidebar, etc.
  page: varchar("page", { length: 50 }).notNull(), // home, movie, profile, etc.
  position: varchar("position", { length: 50 }).notNull(), // top, left, center, right, bottom
  order: integer("order").default(0),
  config: jsonb("config").default({}).notNull(), // 组件配置
  isVisible: boolean("is_visible").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_ui_components_page").on(table.page),
  index("idx_ui_components_position").on(table.position),
]);

// 充值套餐
export const rechargePackages = pgTable("recharge_packages", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  coins: integer("coins").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  bonus: integer("bonus").default(0), // 赠送金币
  description: text("description"),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_recharge_packages_status").on(table.status),
]);

// VIP套餐
export const vipPackages = pgTable("vip_packages", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  duration: integer("duration").notNull(), // 天数
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  description: text("description"),
  features: jsonb("features").default([]).notNull(), // 功能列表
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_vip_packages_status").on(table.status),
]);

// 健康检查（保留原表）
export const healthCheck = pgTable("health_check", {
	id: serial().notNull().primaryKey(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// ==================== 加密货币支付系统 ====================

// 支持的加密货币配置
export const cryptoCurrencies = pgTable("crypto_currencies", {
  id: serial().notNull().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(), // USDT, BTC, ETH, TRX, etc.
  name: varchar("name", { length: 50 }).notNull(), // Tether, Bitcoin, Ethereum, etc.
  symbol: varchar("symbol", { length: 10 }).notNull(), // ₮, ₿, Ξ, etc.
  network: varchar("network", { length: 20 }).notNull(), // ERC20, TRC20, BEP20, etc.
  decimals: integer("decimals").default(18).notNull(),
  icon: text("icon"), // 货币图标URL
  usdRate: decimal("usd_rate", { precision: 20, scale: 8 }).default('1').notNull(), // 对美元汇率
  minConfirmations: integer("min_confirmations").default(1).notNull(), // 最小确认数
  minDeposit: decimal("min_deposit", { precision: 20, scale: 8 }), // 最小充值金额
  minWithdraw: decimal("min_withdraw", { precision: 20, scale: 8 }), // 最小提现金额
  withdrawFee: decimal("withdraw_fee", { precision: 20, scale: 8 }).default('0'), // 提现手续费
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_currencies_code").on(table.code),
  index("idx_crypto_currencies_is_active").on(table.isActive),
]);

// 系统加密货币钱包地址
export const cryptoWallets = pgTable("crypto_wallets", {
  id: serial().notNull().primaryKey(),
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  address: varchar("address", { length: 255 }).notNull(), // 钱包地址
  tag: varchar("tag", { length: 50 }), // 标签/备注名
  network: varchar("network", { length: 20 }).notNull(), // 网络类型
  balance: decimal("balance", { precision: 30, scale: 8 }).default('0').notNull(), // 当前余额
  totalReceived: decimal("total_received", { precision: 30, scale: 8 }).default('0').notNull(), // 总收入
  totalSent: decimal("total_sent", { precision: 30, scale: 8 }).default('0').notNull(), // 总支出
  isActive: boolean("is_active").default(true).notNull(),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true, mode: 'string' }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_wallets_currency_id").on(table.currencyId),
  index("idx_crypto_wallets_address").on(table.address),
]);

// 用户加密货币钱包地址
export const userCryptoWallets = pgTable("user_crypto_wallets", {
  id: serial().notNull().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  address: varchar("address", { length: 255 }).notNull(), // 钱包地址
  network: varchar("network", { length: 20 }).notNull(), // 网络类型
  label: varchar("label", { length: 100 }), // 用户标签
  isVerified: boolean("is_verified").default(false).notNull(), // 是否已验证
  verificationTx: varchar("verification_tx", { length: 255 }), // 验证交易哈希
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_user_crypto_wallets_user_id").on(table.userId),
  index("idx_user_crypto_wallets_currency_id").on(table.currencyId),
  index("idx_user_crypto_wallets_address").on(table.address),
]);

// 加密货币支付订单
export const cryptoPayments = pgTable("crypto_payments", {
  id: serial().notNull().primaryKey(),
  orderNo: varchar("order_no", { length: 50 }).notNull().unique(), // 订单号
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  walletId: integer("wallet_id").notNull().references(() => cryptoWallets.id), // 收款钱包
  type: varchar("type", { length: 20 }).notNull(), // recharge, vip, coin, product
  amount: decimal("amount", { precision: 30, scale: 8 }).notNull(), // 加密货币金额
  usdAmount: decimal("usd_amount", { precision: 20, scale: 2 }).notNull(), // 美元金额
  coinAmount: integer("coin_amount").default(0), // 获得金币数量
  vipDays: integer("vip_days").default(0), // VIP天数
  rate: decimal("rate", { precision: 20, scale: 8 }).notNull(), // 下单时汇率
  toAddress: varchar("to_address", { length: 255 }).notNull(), // 收款地址
  fromAddress: varchar("from_address", { length: 255 }), // 付款地址
  txHash: varchar("tx_hash", { length: 255 }), // 交易哈希
  status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, paid, confirmed, cancelled, expired
  confirmations: integer("confirmations").default(0), // 确认数
  paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }), // 支付时间
  confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }), // 确认时间
  expiredAt: timestamp("expired_at", { withTimezone: true, mode: 'string' }), // 过期时间
  metadata: jsonb("metadata").default({}), // 额外数据
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_payments_order_no").on(table.orderNo),
  index("idx_crypto_payments_user_id").on(table.userId),
  index("idx_crypto_payments_currency_id").on(table.currencyId),
  index("idx_crypto_payments_status").on(table.status),
  index("idx_crypto_payments_tx_hash").on(table.txHash),
  index("idx_crypto_payments_created_at").on(table.createdAt),
]);

// 加密货币交易记录
export const cryptoTransactions = pgTable("crypto_transactions", {
  id: serial().notNull().primaryKey(),
  txHash: varchar("tx_hash", { length: 255 }).notNull().unique(), // 交易哈希
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  walletId: integer("wallet_id").references(() => cryptoWallets.id), // 关联钱包
  paymentId: integer("payment_id").references(() => cryptoPayments.id), // 关联订单
  type: varchar("type", { length: 20 }).notNull(), // deposit, withdraw, internal
  amount: decimal("amount", { precision: 30, scale: 8 }).notNull(), // 金额
  fee: decimal("fee", { precision: 30, scale: 8 }).default('0'), // 手续费
  fromAddress: varchar("from_address", { length: 255 }), // 发送地址
  toAddress: varchar("to_address", { length: 255 }), // 接收地址
  blockNumber: bigint("block_number", { mode: 'number' }), // 区块高度
  confirmations: integer("confirmations").default(0), // 确认数
  status: varchar("status", { length: 20 }).default('pending').notNull(), // pending, confirmed, failed
  processedAt: timestamp("processed_at", { withTimezone: true, mode: 'string' }), // 处理时间
  metadata: jsonb("metadata").default({}), // 额外数据
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_transactions_tx_hash").on(table.txHash),
  index("idx_crypto_transactions_currency_id").on(table.currencyId),
  index("idx_crypto_transactions_wallet_id").on(table.walletId),
  index("idx_crypto_transactions_payment_id").on(table.paymentId),
  index("idx_crypto_transactions_status").on(table.status),
]);

// 加密货币充值套餐
export const cryptoRechargePackages = pgTable("crypto_recharge_packages", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  coins: integer("coins").notNull(), // 金币数量
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  cryptoAmount: decimal("crypto_amount", { precision: 30, scale: 8 }).notNull(), // 加密货币金额
  usdAmount: decimal("usd_amount", { precision: 20, scale: 2 }).notNull(), // 美元金额
  bonus: integer("bonus").default(0), // 赠送金币
  discount: decimal("discount", { precision: 5, scale: 2 }).default('0'), // 折扣百分比
  description: text("description"),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_recharge_packages_currency_id").on(table.currencyId),
  index("idx_crypto_recharge_packages_status").on(table.status),
]);

// VIP加密货币支付套餐
export const cryptoVipPackages = pgTable("crypto_vip_packages", {
  id: serial().notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  duration: integer("duration").notNull(), // 天数
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  cryptoAmount: decimal("crypto_amount", { precision: 30, scale: 8 }).notNull(), // 加密货币金额
  usdAmount: decimal("usd_amount", { precision: 20, scale: 2 }).notNull(), // 美元金额
  originalUsdAmount: decimal("original_usd_amount", { precision: 20, scale: 2 }), // 原价美元金额
  features: jsonb("features").default([]).notNull(), // 功能列表
  discount: decimal("discount", { precision: 5, scale: 2 }).default('0'), // 折扣
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_vip_packages_currency_id").on(table.currencyId),
  index("idx_crypto_vip_packages_status").on(table.status),
]);

// 汇率历史记录
export const cryptoRateHistory = pgTable("crypto_rate_history", {
  id: serial().notNull().primaryKey(),
  currencyId: integer("currency_id").notNull().references(() => cryptoCurrencies.id, { onDelete: 'cascade' }),
  rate: decimal("rate", { precision: 20, scale: 8 }).notNull(), // 对美元汇率
  source: varchar("source", { length: 50 }).notNull(), // 来源：binance, coinbase, coingecko, etc.
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
  index("idx_crypto_rate_history_currency_id").on(table.currencyId),
  index("idx_crypto_rate_history_created_at").on(table.createdAt),
]);
