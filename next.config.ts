import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Get allowed origins from environment or use defaults
const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(",").map((o) => o.trim());
  }
  // Default origins for development
  return [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ];
};

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

  // CORS 和安全响应头配置
  async headers() {
    const allowedOrigins = getAllowedOrigins();

    return [
      {
        // 应用于所有路由
        source: "/:path*",
        headers: [
          // 安全响应头
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // HSTS (仅在生产环境启用)
          ...(process.env.NODE_ENV === "production"
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          // CSP (Content Security Policy)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data:",
              "font-src 'self'",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        // API 路由的 CORS 配置
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(", "),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, X-API-Secret, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/en/projects",
        destination: "/en/about",
        permanent: true,
      },
      {
        source: "/zh/projects",
        destination: "/zh/about",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
