"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordAuth from "@/components/auth/PasswordAuth";
import DraftItem from "@/components/editor/DraftItem";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;
  status: "draft" | "published";
  featured: boolean;
}

export default function DraftsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem("blog-auth");
        const authTime = localStorage.getItem("blog-auth-time");
        
        if (authStatus === "true" && authTime) {
          const now = Date.now();
          const authTimestamp = parseInt(authTime);
          const isExpired = now - authTimestamp > 24 * 60 * 60 * 1000;
          
          if (!isExpired) {
            setIsAuthenticated(true);
            loadDrafts();
          } else {
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

  const loadDrafts = () => {
    try {
      const savedDrafts = localStorage.getItem("blog-drafts");
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts);
        setDrafts(parsedDrafts);
      }
    } catch (error) {
      console.error("加载草稿失败:", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    loadDrafts();
  };


  const handleDeleteDraft = (draftId: string) => {
    if (confirm("确定要删除这个草稿吗？")) {
      try {
        const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
        localStorage.setItem("blog-drafts", JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
      } catch (error) {
        console.error("删除草稿失败:", error);
      }
    }
  };

  const handleEditDraft = (draftId: string) => {
    // 将草稿数据存储到 sessionStorage，供编辑器使用
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      sessionStorage.setItem("editing-draft", JSON.stringify(draft));
      router.push("/write");
    }
  };

  const handlePublishDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      try {
        // 生成 Markdown 文件内容
        const markdownContent = `---
title: "${draft.title}"
date: "${draft.date}"
summary: "${draft.summary}"
featured: ${draft.featured}
---

${draft.content}`;

        // 保存到已发布文章
        const publishedPosts = JSON.parse(localStorage.getItem("blog-published") || "[]");
        publishedPosts.push({
          ...draft,
          status: "published" as const,
          markdown: markdownContent,
        });
        
        localStorage.setItem("blog-published", JSON.stringify(publishedPosts));
        
        // 从草稿中移除
        const updatedDrafts = drafts.filter(d => d.id !== draftId);
        localStorage.setItem("blog-drafts", JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        
        alert("文章发布成功！");
      } catch (error) {
        console.error("发布草稿失败:", error);
        alert("发布失败，请重试");
      }
    }
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

        {drafts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有草稿</h3>
            <p className="text-gray-500 mb-6">开始写您的第一篇文章吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">共 {drafts.length} 个草稿</p>
            </div>
            
            <div className="grid gap-4">
              {drafts.map((draft) => (
                <DraftItem
                  key={draft.id}
                  draft={draft}
                  onEdit={handleEditDraft}
                  onDelete={handleDeleteDraft}
                  onPublish={handlePublishDraft}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
