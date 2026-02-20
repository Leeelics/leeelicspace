import { get } from '@vercel/edge-config';
import { logger } from './logger';

export interface EdgeConfigItems {
  greeting?: string;
  // Add more Edge Config items as needed
}

/**
 * 安全地获取 Edge Config 中的配置项。
 * 如果没有配置 EDGE_CONFIG（即没有连接 Edge Config），直接返回 undefined，
 * 避免在构建或运行时出现 "No connection string provided" 的报错。
 */
export async function getEdgeConfigItem<T extends keyof EdgeConfigItems>(
  key: T
): Promise<EdgeConfigItems[T] | undefined> {
  try {
    // 未配置 Edge Config 时，直接跳过远程调用
    if (!process.env.EDGE_CONFIG) {
      if (process.env.NODE_ENV !== 'production') {
        logger.debug(`EDGE_CONFIG env not set, skip fetching key '${String(key)}'`);
      }
      return undefined;
    }

    return (await get(key)) as EdgeConfigItems[T] | undefined;
  } catch (error) {
    logger.error(`Failed to get Edge Config item '${String(key)}'`, error instanceof Error ? error : new Error(String(error)));
    return undefined;
  }
}

export async function getGreeting(): Promise<string | undefined> {
  return getEdgeConfigItem('greeting');
}
