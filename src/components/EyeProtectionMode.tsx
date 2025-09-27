"use client";

import { useState, useEffect } from "react";

export default function EyeProtectionMode() {
  const [isEnabled, setIsEnabled] = useState(true); // 默认开启

  useEffect(() => {
    // 每次刷新页面都强制开启护眼模式
    setIsEnabled(true);
    document.body.classList.add("eye-protection-mode");
    localStorage.setItem("eye-protection-mode", "true");
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

  return (
    <button
      onClick={toggleEyeProtection}
      className={`absolute bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
        isEnabled 
          ? "bg-green-500 text-white" 
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999
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
