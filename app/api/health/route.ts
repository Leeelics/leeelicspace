import { NextResponse } from 'next/server';
import { kvStorage } from '@/lib/kv-storage';
import { kv } from '@vercel/kv';
import { logger } from '@/lib/logger';

interface HealthInfo {
  status: string;
  timestamp: string;
  // 简化的环境信息，不包含敏感数据
  environment: {
    node_env?: string;
  };
  storage: {
    type: string;
    writable: boolean;
    post_count: number;
    initialized: boolean;
    error?: string;
  };
  // 仅返回认证是否配置，不暴露细节
  auth: {
    configured: boolean;
  };
  // 版本信息
  version: string;
}

const APP_VERSION = '1.0.0';

export async function GET() {
  try {
    const healthInfo: HealthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        node_env: process.env.NODE_ENV,
      },
      storage: {
        type: 'vercel-kv',
        writable: false,
        post_count: 0,
        initialized: false,
      },
      auth: {
        configured: !!process.env.API_SECRET && process.env.API_SECRET.length >= 16,
      },
      version: APP_VERSION,
    };

    // 检查KV存储状态（可选）
    const hasKvConfig = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
    
    if (hasKvConfig) {
      try {
        const storageInfo = await kvStorage.getStorageInfo();
        healthInfo.storage.post_count = storageInfo.post_count;
        healthInfo.storage.initialized = storageInfo.connected;
      } catch (error) {
        logger.error('KV storage check failed', error instanceof Error ? error : new Error(String(error)));
        healthInfo.storage.error = 'Storage check failed';
      }

      // 测试KV存储写入
      try {
        const testKey = 'blog:health-check';
        const testValue = { timestamp: new Date().toISOString() };
        await kv.set(testKey, testValue);
        const retrieved = await kv.get(testKey);
        await kv.del(testKey);
        
        if (JSON.stringify(retrieved) === JSON.stringify(testValue)) {
          healthInfo.storage.writable = true;
        }
      } catch (error) {
        logger.error('KV storage write test failed', error instanceof Error ? error : new Error(String(error)));
        healthInfo.storage.writable = false;
        healthInfo.storage.error = 'Storage write test failed';
      }
    } else {
      healthInfo.storage.error = 'Storage not configured';
    }

    // Determine overall status based on available services
    const hasAuth = healthInfo.auth.configured;

    if (!hasAuth) {
      healthInfo.status = 'degraded';
    } else if (hasKvConfig && healthInfo.storage.writable) {
      healthInfo.status = 'healthy';
    } else if (hasKvConfig) {
      // KV is configured but not working properly
      healthInfo.status = 'degraded';
    } else {
      // No KV configured, but auth is working (using memory storage)
      healthInfo.status = 'healthy';
    }

    // 根据状态返回不同的 HTTP 状态码
    const statusCode = healthInfo.status === 'unhealthy' ? 503 : 200;
    
    return NextResponse.json(healthInfo, { status: statusCode });
  } catch (error) {
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
    }, { status: 503 });
  }
}
