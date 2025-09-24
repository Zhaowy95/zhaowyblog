"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import PasswordAuth from "@/components/auth/PasswordAuth";

// 懒加载重型编辑器组件
const BlogEditor = dynamic(() => import("@/components/editor/BlogEditor"), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ),
  ssr: false
});

export default function WritePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("blog-auth");
        const authTime = localStorage.getItem("blog-auth-time");
        
        if (authStatus === "true" && authTime) {
          // 检查认证是否过期（7天）
          const now = Date.now();
          const authTimestamp = parseInt(authTime);
          const isExpired = now - authTimestamp > 7 * 24 * 60 * 60 * 1000;
          
          if (!isExpired) {
            setIsAuthenticated(true);
          } else {
            // 清除过期的认证
            localStorage.removeItem("blog-auth");
            localStorage.removeItem("blog-auth-time");
          }
        }
      } catch (error) {
        console.error("检查认证状态失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordAuth onSuccess={handleAuthSuccess} />;
  }

  return (
    <main className="relative py-6 max-w-full md:max-w-6xl mx-auto lg:gap-10 lg:py-8">
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg text-gray-600">
            开启新的记录吧，它们总会在某一天闪闪发光！
          </p>
          <div className="flex items-center space-x-4">
            <Link 
              href="/write/drafts" 
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              草稿箱
            </Link>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <BlogEditor />
        </Suspense>
      </div>
    </main>
  );
}
