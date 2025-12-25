import { NextResponse } from 'next/server';
import { kvStorage } from '@/lib/kv-storage';
import { kv } from '@vercel/kv';
import path from 'path';

interface HealthInfo {
  status: string;
  timestamp: string;
  environment: {
    node_env?: string;
    vercel_env?: string;
    vercel_url?: string;
    next_public_site_url?: string;
  };
  storage: {
    type: string;
    writable: boolean;
    post_count: number;
    initialized: boolean;
    error?: string;
  };
  auth: {
    has_api_secret: boolean;
    using_default_secret: boolean;
  };
  memory: {
    cwd: string;
  };
}

export async function GET() {
  try {
    const healthInfo: HealthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV,
        vercel_url: process.env.VERCEL_URL,
        next_public_site_url: process.env.NEXT_PUBLIC_SITE_URL,
      },
      storage: {
        type: 'vercel-kv',
        writable: true,
        post_count: 0,
        initialized: false,
      },
      auth: {
        has_api_secret: !!process.env.API_SECRET,
        using_default_secret: !process.env.API_SECRET
      },
      memory: {
        cwd: process.cwd(),
      }
    };

    // 检查KV存储状态（可选）
    const hasKvConfig = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
    
    if (hasKvConfig) {
      try {
        const storageInfo = await kvStorage.getStorageInfo();
        healthInfo.storage.post_count = storageInfo.post_count;
        healthInfo.storage.initialized = storageInfo.connected;
        console.log('KV storage info:', storageInfo);
      } catch (error) {
        console.error('KV storage check failed:', error);
        healthInfo.storage.error = error instanceof Error ? error.message : 'Unknown error';
        // Don't set status to degraded for KV issues - Edge Config can work independently
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
        } else {
          throw new Error('KV storage read/write test failed');
        }
      } catch (error) {
        console.error('KV storage write test failed', error);
        healthInfo.storage.writable = false;
      }
    } else {
      console.log('KV storage not configured - skipping KV checks');
      healthInfo.storage.writable = false;
      healthInfo.storage.initialized = false;
      healthInfo.storage.error = 'KV storage not configured - set KV_REST_API_URL and KV_REST_API_TOKEN to enable';
    }

    // Determine overall status based on available services
    const hasEdgeConfig = !!process.env.EDGE_CONFIG;
    const hasAuth = !!process.env.API_SECRET;

    if (!hasAuth) {
      healthInfo.status = 'degraded';
    } else if (hasKvConfig && healthInfo.storage.writable) {
      // If KV is configured and working
      healthInfo.status = 'healthy';
    } else if (hasEdgeConfig) {
      // If only Edge Config is available, we're functional
      healthInfo.status = 'healthy';
    } else if (hasKvConfig) {
      // KV is configured but not working properly
      healthInfo.status = 'degraded';
    } else {
      // No storage services configured, but auth is working
      healthInfo.status = 'healthy';
    }

    return NextResponse.json(healthInfo);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}