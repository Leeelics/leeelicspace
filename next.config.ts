import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // 内存优化
  poweredByHeader: false,
  generateEtags: false,
  
  // 实验性功能：减少内存占用
  experimental: {
    // 禁用某些实验性功能以减少内存
    optimizeCss: false,
  },
  
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/en/projects',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/zh/projects',
        destination: '/zh/about',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
