"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SubsQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export default function SubsQRModal({ isOpen, onClose, triggerRef }: SubsQRModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 延迟一帧确保DOM更新后再显示
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // 等待动画完成后移除DOM元素
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 与CSS动画时间一致
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 处理背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* 弹窗内容 - 透明背景 */}
      <div 
        className={`absolute bg-transparent max-w-xs w-full mx-4 transform transition-all duration-300 ease-in-out sm:max-w-sm ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          top: triggerRef?.current ? 
            `${triggerRef.current.getBoundingClientRect().bottom + window.scrollY + 8}px` : 
            '50%',
          left: triggerRef?.current ? 
            `${triggerRef.current.getBoundingClientRect().left + window.scrollX + (triggerRef.current.getBoundingClientRect().width / 2)}px` : 
            '50%',
          transform: triggerRef?.current ? 'translateX(-50%)' : 'translate(-50%, -50%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 内容区域 */}
        <div className="p-3 sm:p-4 text-center">
          <div className="relative">
            <Image
              src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/wechatsubs.png`}
              alt="订阅二维码"
              width={200}
              height={200}
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg shadow-md"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
