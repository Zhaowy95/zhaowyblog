"use client";

import { useState, useEffect } from "react";

export default function EyeProtectionMode() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null); // 初始为null，表示未设置

  useEffect(() => {
    // 从缓存中读取护眼模式状态
    const savedMode = localStorage.getItem("eye-protection-mode");
    
    if (savedMode === "true") {
      setIsEnabled(true);
      document.body.classList.add("eye-protection-mode");
    } else if (savedMode === "false") {
      setIsEnabled(false);
      document.body.classList.remove("eye-protection-mode");
    } else {
      // 如果没有缓存记录，默认为非护眼模式
      setIsEnabled(false);
      document.body.classList.remove("eye-protection-mode");
    }

    // 微信浏览器特殊处理
    const isWechatBrowser = /MicroMessenger/i.test(navigator.userAgent);
    if (isWechatBrowser) {
      // 强制设置视口高度
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);
      
      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
      };
    }
  }, []);

  const toggleEyeProtection = () => {
    const newMode = !isEnabled;
    setIsEnabled(newMode);
    
    if (newMode) {
      document.body.classList.add("eye-protection-mode");
      localStorage.setItem("eye-protection-mode", "true");
    } else {
      document.body.classList.remove("eye-protection-mode");
      localStorage.setItem("eye-protection-mode", "false");
    }
  };

  // 如果状态为null，不渲染按钮
  if (isEnabled === null) {
    return null;
  }

  return (
    <button
      onClick={toggleEyeProtection}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isEnabled 
          ? "bg-green-500 text-white" 
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      style={{
        position: 'fixed',
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        right: '1rem',
        zIndex: 9999,
        // 确保在移动端固定在视图右下角
        transform: 'none',
        // 防止按钮被其他元素遮挡
        pointerEvents: 'auto',
        // 确保按钮始终可见
        minHeight: '48px',
        minWidth: '48px'
      }}
      title={isEnabled ? "关闭护眼模式" : "开启护眼模式"}
    >
      {isEnabled ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        </svg>
      )}
    </button>
  );
}
