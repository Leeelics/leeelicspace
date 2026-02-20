import type { SWRConfiguration } from 'swr';

// SWR 全局配置
export const swrConfig: SWRConfiguration = {
  // 刷新间隔：5分钟
  refreshInterval: 5 * 60 * 1000,
  // 聚焦时重新验证
  revalidateOnFocus: true,
  // 重新连接时重新验证
  revalidateOnReconnect: true,
  // 错误时重试
  shouldRetryOnError: true,
  // 错误重试间隔
  errorRetryInterval: 3000,
  // 最大重试次数
  errorRetryCount: 3,
  // 缓存时间：10分钟
  dedupingInterval: 10 * 60 * 1000,
};

// fetcher 函数
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
