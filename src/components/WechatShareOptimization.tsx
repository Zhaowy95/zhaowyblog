"use client";

import { useEffect } from "react";
import { config } from "@/lib/config";

interface WechatShareOptimizationProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export default function WechatShareOptimization({
  title,
  description,
  image,
  url
}: WechatShareOptimizationProps) {
  useEffect(() => {
    // 动态更新微信分享的meta标签
    const updateWechatMeta = () => {
      const fullTitle = title ? `ZhaoLabs|${title}` : config.site.title;
      const shareDescription = description || config.site.description;
      const shareImage = image || config.site.image;
      const shareUrl = url || config.site.url;

      // 更新或创建微信分享相关的meta标签
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // 更新或创建标准meta标签
      const updateStandardMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // 更新Open Graph标签
      updateMetaTag('og:title', fullTitle);
      updateMetaTag('og:description', shareDescription);
      updateMetaTag('og:image', shareImage);
      updateMetaTag('og:url', shareUrl);
      updateMetaTag('og:type', 'article');

      // 更新Twitter Card标签
      updateStandardMeta('twitter:title', fullTitle);
      updateStandardMeta('twitter:description', shareDescription);
      updateStandardMeta('twitter:image', shareImage);

      // 更新标准meta标签
      updateStandardMeta('description', shareDescription);
      
      // 更新页面标题
      document.title = fullTitle;
    };

    updateWechatMeta();
  }, [title, description, image, url]);

  return null; // 这是一个无UI组件，只负责更新meta标签
}
