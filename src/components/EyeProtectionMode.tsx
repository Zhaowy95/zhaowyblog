"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function EyeProtectionMode() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isWechatBrowser, setIsWechatBrowser] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("eye-protection-mode");
    if (savedMode === "true") {
      setIsEnabled(true);
      document.body.classList.add("eye-protection-mode");
    } else if (savedMode === "false") {
      setIsEnabled(false);
      document.body.classList.remove("eye-protection-mode");
    } else {
      setIsEnabled(false);
      document.body.classList.remove("eye-protection-mode");
    }

    const wechatCheck = /MicroMessenger/i.test(navigator.userAgent);
    setIsWechatBrowser(wechatCheck);

    if (wechatCheck) {
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

  // 微信浏览器特殊处理：强制固定定位
  useEffect(() => {
    if (!mounted || !isWechatBrowser || !buttonRef.current) return;

    const forceFixedPosition = () => {
      if (!buttonRef.current) return;
      
      // 强制设置为 fixed 定位
      buttonRef.current.style.position = 'fixed';
      buttonRef.current.style.right = '16px';
      buttonRef.current.style.bottom = 'calc(16px + env(safe-area-inset-bottom, 0px))';
      buttonRef.current.style.left = 'auto';
      buttonRef.current.style.top = 'auto';
      buttonRef.current.style.transform = 'translateZ(0)';
      buttonRef.current.style.willChange = 'transform';
    };

    // 初始设置
    forceFixedPosition();

    // 监听所有可能影响定位的事件
    const events = ['scroll', 'resize', 'orientationchange', 'touchmove', 'touchstart', 'touchend'];
    
    events.forEach(event => {
      window.addEventListener(event, forceFixedPosition, { passive: true });
      document.addEventListener(event, forceFixedPosition, { passive: true });
    });

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(forceFixedPosition);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // 使用 setInterval 强制保持定位
    const interval = setInterval(forceFixedPosition, 100);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, forceFixedPosition);
        document.removeEventListener(event, forceFixedPosition);
      });
      observer.disconnect();
      clearInterval(interval);
    };
  }, [mounted, isWechatBrowser]);

  if (isEnabled === null || !mounted) {
    return null;
  }

  const buttonContent = (
    <button
      ref={buttonRef}
      onClick={toggleEyeProtection}
      className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
        isEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      style={{
        position: 'fixed',
        right: '16px',
        bottom: isWechatBrowser ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : '16px',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        zIndex: 2147483647,
        transform: 'translateZ(0)',
        willChange: 'transform'
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

  return createPortal(buttonContent, document.body);
}