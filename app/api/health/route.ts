import { NextResponse } from 'next/server';
import { fileStorage } from '@/lib/storage';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV,
        vercel_url: process.env.VERCEL_URL,
        next_public_site_url: process.env.NEXT_PUBLIC_SITE_URL,
      },
      storage: {
        type: 'file-based',
        data_path: path.join(process.cwd(), 'tmp', 'posts.json'),
        writable: false,
        post_count: 0,
      },
      memory: {
        cwd: process.cwd(),
        tmp_dir_exists: false,
      }
    };

    // 检查tmp目录是否存在且可写
    try {
      const tmpDir = path.join(process.cwd(), 'tmp');
      await fs.access(tmpDir);
      healthInfo.memory.tmp_dir_exists = true;
      
      // 测试写入权限
      const testFile = path.join(tmpDir, 'test-write.txt');
      try {
        await fs.writeFile(testFile, 'test');
        await fs.unlink(testFile);
        healthInfo.storage.writable = true;
      } catch (writeError) {
        console.error('Write test failed:', writeError);
      }
    } catch (error) {
      console.error('Tmp directory check failed:', error);
    }

    // 获取文章数量
    try {
      const posts = await fileStorage.getAllPosts();
      healthInfo.storage.post_count = posts.length;
    } catch (error) {
      console.error('Failed to get post count:', error);
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