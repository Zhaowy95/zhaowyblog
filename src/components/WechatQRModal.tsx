"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface WechatQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function WechatQRModal({ isOpen, onClose, triggerRef }: WechatQRModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 计算弹窗位置
  const calculatePosition = useCallback(() => {
    if (!triggerRef?.current) return { top: 0, left: 0 };
    
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    return {
      top: rect.bottom + scrollTop + 8, // icon底部 + 8px间距
      left: rect.left + scrollLeft + rect.width / 2 // icon水平中心
    };
  }, [triggerRef]);

  // 处理弹窗开关状态
  useEffect(() => {
    if (isOpen) {
      // 计算位置
      const newPosition = calculatePosition();
      setPosition(newPosition);
      
      setShouldRender(true);
      // 延迟显示动画
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // 等待动画完成后移除DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, calculatePosition]);

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

  // 监听滚动和窗口大小变化，更新位置
  useEffect(() => {
    if (!isOpen) return;
    
    const updatePosition = () => {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    };
    
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, calculatePosition]);

  if (!shouldRender || !mounted) return null;

  const modalContent = (
    <>
      {/* 背景遮罩 */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 9998
        }}
        onClick={handleBackdropClick}
      />
      
      {/* 弹窗内容 */}
      <div 
        ref={modalRef}
        className={`absolute transition-all duration-300 ease-in-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          zIndex: 9999
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <Image
            src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/wehcat-click.png`}
            alt="微信二维码"
            width={120}
            height={120}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
