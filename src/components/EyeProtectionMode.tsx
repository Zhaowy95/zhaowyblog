"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function EyeProtectionMode() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null); // 初始为null，表示未设置
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // 不提前 return，保证后续 hooks 顺序一致

  // 浮层容器，悬浮于页面之上
  const floating = (
    <div
      id="eye-protection-floating-layer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: 'none',
      }}
    >
      <button
        onClick={toggleEyeProtection}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
          isEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        style={{
          position: 'fixed',
          right: '16px',
          bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'auto',
          minHeight: '48px',
          minWidth: '48px'
        }}
        title={isEnabled ? "关闭护眼模式" : "开启护眼模式"}
        id="eye-protection-button"
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
    </div>
  );

  // 使用 visualViewport 将按钮锚定到可见视图右下角
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const btn = () => document.getElementById('eye-protection-button') as HTMLElement | null;
    let raf = 0;

    const update = () => {
      const el = btn();
      if (!el) return;
      const rightPadding = 16;
      const bottomPadding = 16;
      const safeBottom = 0; // env(safe-area...) 已在 bottom 里处理
      const width = vv?.width ?? window.innerWidth;
      const height = vv?.height ?? window.innerHeight;
      const offsetLeft = vv?.offsetLeft ?? 0;
      const offsetTop = vv?.offsetTop ?? 0;
      // 使用可见视口的偏移与尺寸，锚定到右下角
      const x = offsetLeft + width - rightPadding - el.offsetWidth;
      const y = offsetTop + height - bottomPadding - safeBottom - el.offsetHeight;
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    };

    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    // 初次定位
    schedule();
    // 监听 visualViewport 滚动与尺寸变化（不监听 window.scroll）
    vv?.addEventListener('scroll', schedule);
    vv?.addEventListener('resize', schedule);
    window.addEventListener('resize', schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      vv?.removeEventListener('scroll', schedule);
      vv?.removeEventListener('resize', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [mounted, isEnabled]);

  if (!mounted || isEnabled === null) return null;
  return createPortal(floating, document.body);
}
