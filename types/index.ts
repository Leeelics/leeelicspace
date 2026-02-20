/**
 * Platform publish status
 */
export interface PlatformStatus {
  published: boolean;
  url?: string;
  publishedAt?: string;
  // Platform-specific data
  cardImages?: string[]; // For Xiaohongshu (image URLs if stored)
  draftUrl?: string; // For WeChat
  threadUrls?: string[]; // For X
}

/**
 * Xiaohongshu-specific config
 */
export interface XiaohongshuConfig {
  cardStyle: "gradient" | "minimal" | "photo";
  fontSize: number;
  background: string;
  textColor: string;
  padding: number;
  pages: number;
}

/**
 * WeChat-specific config
 */
export interface WechatConfig {
  template: "default" | "tech" | "minimal";
  autoToc: boolean;
  codeHighlight: boolean;
}

/**
 * X/Twitter-specific config
 */
export interface XConfig {
  threadMode: boolean;
  splitPoints: number[];
  addNumbering: boolean;
}

/**
 * Jike-specific config
 */
export interface JikeConfig {
  maxLength: number;
  extractImages: boolean;
}

/**
 * Channel configuration for a post
 */
export interface ChannelConfig {
  xiaohongshu: XiaohongshuConfig;
  wechat: WechatConfig;
  x: XConfig;
  jike: JikeConfig;
}

/**
 * Default channel configs
 */
export const defaultChannelConfig: ChannelConfig = {
  xiaohongshu: {
    cardStyle: "gradient",
    fontSize: 32,
    background: "#fdfbf7",
    textColor: "#1f2937",
    padding: 80,
    pages: 1,
  },
  wechat: {
    template: "default",
    autoToc: true,
    codeHighlight: true,
  },
  x: {
    threadMode: false,
    splitPoints: [],
    addNumbering: true,
  },
  jike: {
    maxLength: 2000,
    extractImages: true,
  },
};

/**
 * Publish status for all platforms
 */
export interface PublishStatus {
  blog: PlatformStatus;
  xiaohongshu: PlatformStatus;
  wechat: PlatformStatus;
  jike: PlatformStatus;
  x: PlatformStatus;
}

/**
 * Default publish status
 */
export const defaultPublishStatus: PublishStatus = {
  blog: { published: false },
  xiaohongshu: { published: false },
  wechat: { published: false },
  jike: { published: false },
  x: { published: false },
};

/**
 * Post model - Content management center
 */
export interface Post {
  id: string;
  title: string;
  content: string; // Markdown source
  tags: string[];
  coverImage?: string; // Cover image URL
  created_at: string;
  updated_at: string;

  // Publish status tracking
  publishStatus: PublishStatus;

  // Channel-specific configurations
  channelConfig: ChannelConfig;
}

/**
 * Legacy Post without publish tracking (for migration)
 */
export interface LegacyPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Platform types
 */
export type Platform = "blog" | "xiaohongshu" | "wechat" | "jike" | "x";

/**
 * Platform metadata
 */
export interface PlatformMeta {
  id: Platform;
  name: string;
  nameEn: string;
  color: string;
  icon: string;
  maxLength?: number;
  supportsImages: boolean;
  supportsMarkdown: boolean;
}

/**
 * Platform definitions
 */
export const platforms: PlatformMeta[] = [
  {
    id: "blog",
    name: "博客",
    nameEn: "Blog",
    color: "#3b82f6",
    icon: " Globe",
    supportsImages: true,
    supportsMarkdown: true,
  },
  {
    id: "xiaohongshu",
    name: "小红书",
    nameEn: "Xiaohongshu",
    color: "#ff2442",
    icon: "BookOpen",
    maxLength: 1000,
    supportsImages: true,
    supportsMarkdown: false,
  },
  {
    id: "wechat",
    name: "公众号",
    nameEn: "WeChat",
    color: "#07c160",
    icon: "MessageCircle",
    supportsImages: true,
    supportsMarkdown: false,
  },
  {
    id: "jike",
    name: "即刻",
    nameEn: "Jike",
    color: "#ffe411",
    icon: "Zap",
    maxLength: 2000,
    supportsImages: true,
    supportsMarkdown: false,
  },
  {
    id: "x",
    name: "X",
    nameEn: "X / Twitter",
    color: "#000000",
    icon: "Twitter",
    maxLength: 280,
    supportsImages: true,
    supportsMarkdown: false,
  },
];

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * Post list response
 */
export interface PostResponse {
  posts: Post[];
  pagination: Pagination;
}

/**
 * Card export options (for media-card)
 */
export interface CardExportOptions {
  width: number;
  height: number;
  fontFamily: string;
  titleSize: number;
  bodySize: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right";
  textColor: string;
  background: string;
  padding: number;
  showWatermark: boolean;
  showDate: boolean;
  showTitle: boolean;
}

/**
 * X thread post
 */
export interface XThreadPost {
  number: number;
  total: number;
  content: string;
  charCount: number;
}
