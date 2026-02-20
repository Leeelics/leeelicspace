import { z } from 'zod';

// Platform status schema
const PlatformStatusSchema = z.object({
  published: z.boolean(),
  url: z.string().url().optional(),
  publishedAt: z.string().datetime().optional(),
  cardImages: z.array(z.string()).optional(),
  draftUrl: z.string().url().optional(),
  threadUrls: z.array(z.string().url()).optional(),
});

// Publish status schema
export const PublishStatusSchema = z.object({
  blog: PlatformStatusSchema.optional(),
  xiaohongshu: PlatformStatusSchema.optional(),
  wechat: PlatformStatusSchema.optional(),
  jike: PlatformStatusSchema.optional(),
  x: PlatformStatusSchema.optional(),
});

// Xiaohongshu config schema
const XiaohongshuConfigSchema = z.object({
  cardStyle: z.enum(['gradient', 'minimal', 'photo']),
  fontSize: z.number().min(10).max(100),
  background: z.string().max(500),
  textColor: z.string().max(50),
  padding: z.number().min(0).max(300),
  pages: z.number().min(1).max(50),
});

// WeChat config schema
const WechatConfigSchema = z.object({
  template: z.enum(['default', 'tech', 'minimal']),
  autoToc: z.boolean(),
  codeHighlight: z.boolean(),
});

// X config schema
const XConfigSchema = z.object({
  threadMode: z.boolean(),
  splitPoints: z.array(z.number()),
  addNumbering: z.boolean(),
});

// Jike config schema
const JikeConfigSchema = z.object({
  maxLength: z.number().min(100).max(10000),
  extractImages: z.boolean(),
});

// Channel config schema
export const ChannelConfigSchema = z.object({
  xiaohongshu: XiaohongshuConfigSchema.optional(),
  wechat: WechatConfigSchema.optional(),
  x: XConfigSchema.optional(),
  jike: JikeConfigSchema.optional(),
});

// Create post request schema
export const CreatePostSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题最多 200 个字符'),
  content: z.string()
    .min(1, '内容不能为空')
    .max(50000, '内容最多 50000 个字符'),
  tags: z.array(
    z.string()
      .min(1, '标签不能为空')
      .max(50, '标签最多 50 个字符')
  ).max(10, '最多 10 个标签'),
  coverImage: z.string().url().optional(),
  publishStatus: PublishStatusSchema.optional(),
  channelConfig: ChannelConfigSchema.optional(),
});

// Update post request schema (all fields optional)
export const UpdatePostSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题最多 200 个字符')
    .optional(),
  content: z.string()
    .min(1, '内容不能为空')
    .max(50000, '内容最多 50000 个字符')
    .optional(),
  tags: z.array(
    z.string()
      .min(1, '标签不能为空')
      .max(50, '标签最多 50 个字符')
  ).max(10, '最多 10 个标签').optional(),
  coverImage: z.string().url().optional(),
  publishStatus: PublishStatusSchema.optional(),
  channelConfig: ChannelConfigSchema.optional(),
});

// Pagination params schema
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(10),
  tag: z.string().max(50).optional(),
  search: z.string().max(200).optional(),
});

// Type inference helpers
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;

// Validation helper functions
export function validateCreatePost(data: unknown) {
  return CreatePostSchema.safeParse(data);
}

export function validateUpdatePost(data: unknown) {
  return UpdatePostSchema.safeParse(data);
}

export function validatePagination(data: unknown) {
  return PaginationSchema.safeParse(data);
}

// Sanitize HTML content helper
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
}

// Sanitize tag helper
export function sanitizeTag(tag: string): string {
  return tag
    .replace(/[#<>&\"']/g, '') // Remove special characters
    .trim()
    .slice(0, 50); // Limit length
}
