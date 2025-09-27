"use client";

import { useEffect } from 'react';

export default function WechatCompatibility() {
  // 同步检测微信浏览器，立即应用样式
  if (typeof window !== 'undefined' && /micromessenger/i.test(navigator.userAgent)) {
    // 立即添加微信浏览器CSS类，防止异步加载导致的跳动
    document.documentElement.classList.add('wechat-browser');
    document.body.classList.add('wechat-browser');
    
    // 立即应用关键样式，防止页面跳动
    const style = document.createElement('style');
    style.textContent = `
      .wechat-browser .max-w-3xl,
      .wechat-browser .max-w-4xl {
        max-width: 100vw !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .wechat-browser body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
        width: 100% !important;
      }
      
      /* 微信浏览器Sheet组件特殊处理 */
      .wechat-browser [data-slot="sheet-content"] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        z-index: 9999 !important;
        transform: none !important;
        border: none !important;
        border-radius: 0 !important;
      }
      
      .wechat-browser [data-slot="sheet-overlay"] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9998 !important;
      }
      
      /* 微信浏览器中防止页面滚动 */
      .wechat-browser body.sheet-open {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

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
        // 触发重排
        void document.body.offsetHeight;
        document.body.style.display = '';
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      // 清理函数
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  return null;
}
