import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export',
  trailingSlash: true,
  basePath: '/zhaowyblog',
  assetPrefix: '/zhaowyblog/',
  images: {
    unoptimized: true,
  },
  // 性能优化配置
  // experimental: {
  //   optimizeCss: true, // 暂时禁用，避免构建错误
  // },
  // 图片优化
  // images: {
  //   formats: ['image/webp', 'image/avif'],
  //   minimumCacheTTL: 60,
  // },
  // 压缩配置
  compress: true,
  // 生产环境优化
  // swcMinify: true, // Next.js 15已默认启用
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 微信浏览器兼容性配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
})

export default withContentCollections(withMDX(nextConfig));
