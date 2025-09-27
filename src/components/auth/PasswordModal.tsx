"use client";

import { useState, useEffect } from "react";
import { config } from "@/lib/config";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 简单的密码验证（生产环境建议使用更安全的加密方式）
      if (password === config.auth.password) {
        // 保存认证状态
        localStorage.setItem("blog-auth", "true");
        localStorage.setItem("blog-auth-time", Date.now().toString());
        onSuccess();
        onClose();
        setPassword("");
      } else {
        setError("密码错误，请重新输入");
      }
    } catch {
      setError("验证失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="请输入验证密码"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs text-center">{error}</div>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm touch-manipulation"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading) {
                  handleSubmit(e);
                }
              }}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm touch-manipulation"
            >
              {isLoading ? "验证中..." : "确认"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
