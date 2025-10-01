"use client";

import { useState, useEffect, useRef } from "react";

export default function EyeProtectionMode() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isWechatBrowser, setIsWechatBrowser] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    if (!mounted || !isWechatBrowser) return;

    // 创建 iframe 内容
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              background: transparent;
              overflow: hidden;
            }
            .eye-protection-button {
              position: fixed;
              right: 16px;
              bottom: calc(16px + env(safe-area-inset-bottom, 0px));
              width: 48px;
              height: 48px;
              border: none;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              z-index: 2147483647;
            }
            .eye-protection-button.enabled {
              background-color: #10b981;
              color: white;
            }
            .eye-protection-button.disabled {
              background-color: #e5e7eb;
              color: #374151;
            }
            .eye-protection-button:hover {
              transform: scale(1.05);
            }
            .eye-protection-button svg {
              width: 24px;
              height: 24px;
            }
          </style>
        </head>
        <body>
          <button class="eye-protection-button" id="eyeProtectionBtn" title="护眼模式">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          </button>
          <script>
            let isEnabled = false;
            
            function updateButton() {
              const btn = document.getElementById('eyeProtectionBtn');
              if (isEnabled) {
                btn.className = 'eye-protection-button enabled';
                btn.title = '关闭护眼模式';
                btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>';
              } else {
                btn.className = 'eye-protection-button disabled';
                btn.title = '开启护眼模式';
                btn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>';
              }
            }
            
            function toggleEyeProtection() {
              isEnabled = !isEnabled;
              updateButton();
              // 通知父页面
              window.parent.postMessage({
                type: 'toggleEyeProtection',
                enabled: isEnabled
              }, '*');
            }
            
            // 监听父页面的状态变化
            window.addEventListener('message', function(event) {
              if (event.data.type === 'updateEyeProtectionState') {
                isEnabled = event.data.enabled;
                updateButton();
              }
            });
            
            document.getElementById('eyeProtectionBtn').addEventListener('click', toggleEyeProtection);
            
            // 初始化
            updateButton();
          </script>
        </body>
      </html>
    `;

    // 创建 iframe
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      background: transparent;
      pointer-events: none;
      z-index: 2147483647;
    `;
    
    iframe.srcdoc = iframeContent;
    iframeRef.current = iframe;
    document.body.appendChild(iframe);

    // 监听来自 iframe 的消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'toggleEyeProtection') {
        toggleEyeProtection();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      if (iframeRef.current) {
        document.body.removeChild(iframeRef.current);
      }
      window.removeEventListener('message', handleMessage);
    };
  }, [mounted, isWechatBrowser]);

  // 同步状态到 iframe
  useEffect(() => {
    if (iframeRef.current && isEnabled !== null) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'updateEyeProtectionState',
        enabled: isEnabled
      }, '*');
    }
  }, [isEnabled]);

  if (isEnabled === null || !mounted) {
    return null;
  }

  // 非微信浏览器使用普通方案
  if (!isWechatBrowser) {
    return (
      <button
        onClick={toggleEyeProtection}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
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

  // 微信浏览器使用 iframe 方案，不渲染任何内容
  return null;
}