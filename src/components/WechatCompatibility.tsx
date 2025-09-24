"use client";

import { useEffect } from 'react';

export default function WechatCompatibility() {
  useEffect(() => {
    // 检测是否在微信浏览器中
    const isWechat = /micromessenger/i.test(navigator.userAgent);
    
    if (isWechat) {
      // 微信浏览器特殊处理
      console.log('检测到微信浏览器，应用兼容性设置');
      
      // 禁用微信浏览器的缓存
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
        });
      }
      
      // 设置微信浏览器的特殊属性
      const meta = document.createElement('meta');
      meta.name = 'x5-cache';
      meta.content = 'false';
      document.head.appendChild(meta);
      
      const meta2 = document.createElement('meta');
      meta2.name = 'x5-cache-mode';
      meta2.content = 'no-cache';
      document.head.appendChild(meta2);
      
      // 强制刷新页面内容
      const originalTitle = document.title;
      document.title = originalTitle + ' ';
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }
  }, []);

  return null;
}
