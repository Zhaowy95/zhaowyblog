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
      
      // 微信浏览器缩放优化
      const setViewport = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }
      };
      
      // 立即设置viewport
      setViewport();
      
      // 监听窗口大小变化，重新设置viewport
      const handleResize = () => {
        setViewport();
        // 强制重新计算布局
        document.body.style.display = 'none';
        document.body.offsetHeight; // 触发重排
        document.body.style.display = '';
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      // 添加微信浏览器特定的CSS类
      document.documentElement.classList.add('wechat-browser');
      document.body.classList.add('wechat-browser');
      
      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  return null;
}
