"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SubsQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
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
    // 只有点击背景区域才关闭弹窗，点击内容区域不关闭
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理触摸事件（微信浏览器优化）
  const handleTouchEnd = (e: React.TouchEvent) => {
    // 只有触摸背景区域才关闭弹窗，触摸内容区域不关闭
    if (e.target === e.currentTarget) {
      e.preventDefault();
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

    // 移除全局点击监听器，改为只在背景点击时关闭

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 使用 visualViewport + 回退实时定位弹窗
  useEffect(() => {
    if (!isOpen) return;
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const reposition = () => {
      if (!triggerRef?.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const pageTop = vv?.pageTop ?? window.pageYOffset ?? window.scrollY ?? document.documentElement.scrollTop ?? 0;
      const pageLeft = vv?.pageLeft ?? window.pageXOffset ?? window.scrollX ?? document.documentElement.scrollLeft ?? 0;
      const top = Math.round(rect.bottom + pageTop + 4);
      const left = Math.round(rect.left + pageLeft + rect.width / 2);
      const el = document.getElementById('subs-modal-pos');
      if (el) {
        el.style.top = `${top}px`;
        el.style.left = `${left}px`;
      }
    };
    reposition();
    vv?.addEventListener('scroll', reposition);
    vv?.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    return () => {
      vv?.removeEventListener('scroll', reposition);
      vv?.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [isOpen, triggerRef]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      onTouchEnd={handleTouchEnd}
    >
      {/* 弹窗内容 - 精确尺寸，避免覆盖背景 */}
      <div 
        className={`absolute bg-transparent transform transition-all duration-300 ease-in-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        id="subs-modal-pos"
        style={{
          top: triggerRef?.current ? '0px' : '50%',
          left: triggerRef?.current ? '0px' : '50%',
          transform: triggerRef?.current ? 'translateX(-50%)' : 'translate(-50%, -50%)',
          width: '200px', // 固定宽度，避免覆盖背景
          height: '200px'  // 固定高度，避免覆盖背景
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 内容区域 - 精确尺寸 */}
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/wechatsubs.png`}
            alt="订阅二维码"
            width={200}
            height={200}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-md"
            priority
          />
        </div>
      </div>
    </div>
  );
}
