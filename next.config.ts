import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // 性能优化配置
  experimental: {
    optimizeCss: true,
  },
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // 压缩配置
  compress: true,
  // 生产环境优化
  swcMinify: true,
  // 静态资源优化
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

const withMDX = createMDX({
})

export default withContentCollections(withMDX(nextConfig));
