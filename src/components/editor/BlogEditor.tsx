"use client";

import { useState, useEffect } from "react";
import AdvancedTiptapEditor from "./AdvancedTiptapEditor";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;
  status: "draft" | "published";
  featured: boolean;
  tags: string;
}

export default function BlogEditor() {
  const [post, setPost] = useState<BlogPost>({
    id: "",
    title: "",
    content: "",
    summary: "",
    date: "",
    status: "draft",
    featured: false,
    tags: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    // 检查是否有正在编辑的草稿
    const editingDraft = sessionStorage.getItem("editing-draft");
    if (editingDraft) {
      try {
        const draftData = JSON.parse(editingDraft);
        setPost(draftData);
        sessionStorage.removeItem("editing-draft"); // 清除编辑标记
      } catch (error) {
        console.error("加载编辑草稿失败:", error);
      }
    } else {
      // 生成新的文章ID
      const newId = `blog-${Date.now()}`;
      const currentDate = new Date().toISOString().split('T')[0];
      
      setPost(prev => ({
        ...prev,
        id: newId,
        date: currentDate,
      }));
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (content: string) => {
    setPost(prev => ({ ...prev, content }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost(prev => ({ ...prev, featured: e.target.checked }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost(prev => ({ ...prev, tags: e.target.value }));
  };


  const saveDraft = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      setSaveStatus("标题和内容不能为空");
      return;
    }

    setIsSaving(true);
    try {
      // 保存到 localStorage
      const drafts = JSON.parse(localStorage.getItem("blog-drafts") || "[]");
      const existingIndex = drafts.findIndex((draft: BlogPost) => draft.id === post.id);
      
      const draftToSave = {
        ...post,
        status: "draft" as const,
      };

      if (existingIndex >= 0) {
        drafts[existingIndex] = draftToSave;
      } else {
        drafts.push(draftToSave);
      }

      localStorage.setItem("blog-drafts", JSON.stringify(drafts));
      setSaveStatus("草稿保存成功！");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch {
      setSaveStatus("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const publishPost = async () => {
    if (!post.title.trim() || !post.content.trim()) {
      setSaveStatus("标题和内容不能为空");
      return;
    }

    setIsSaving(true);
    setSaveStatus("🚀 正在发布文章...");

    // 计算基础路径（在 GitHub Pages 下应为 /zhaowyblog）
    const basePath = (typeof window !== 'undefined' && window.location.pathname.startsWith('/zhaowyblog'))
      ? '/zhaowyblog'
      : '';
    
    try {
      // 生成Markdown内容
      const timestamp = Date.now();
      const fileName = `blog-${timestamp}.md`;
      const tagsArray = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      
      const markdownContent = `---
title: "${post.title}"
date: "${post.date}"
summary: "${post.summary || ''}"
featured: ${post.featured || false}
tags: [${tagsArray.map((tag: string) => `"${tag}"`).join(', ')}]
---

${post.content}`;

      // 使用 GitHub API 直接提交文件
      // 优先使用编译期注入的 NEXT_PUBLIC_GITHUB_TOKEN；
      // 若未注入（例如 CDN 缓存旧构建），则尝试从 public/runtime-env.json 读取运行时变量。
      let githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      if (!githubToken) {
        try {
          const runtime = await fetch('/runtime-env.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null);
          githubToken = runtime?.NEXT_PUBLIC_GITHUB_TOKEN;
        } catch {}
      }
      
      if (!githubToken) {
        setSaveStatus("❌ 请配置 GitHub Token 以实现自动发布功能");
        return;
      }

      // 将内容编码为 base64
      const encodedContent = btoa(unescape(encodeURIComponent(markdownContent)));
      
      // 调用 GitHub API
      const response = await fetch(`https://api.github.com/repos/Zhaowy95/zhaowyblog/contents/src/content/blog/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `发布新文章: ${post.title}`,
          content: encodedContent,
          branch: 'main'
        })
      });

      if (response.ok) {
        // Read and discard the response body to avoid unhandled promise without
        // introducing an unused variable that breaks the ESLint build step.
        await response.json();
        setSaveStatus("🎉 文章发布成功！正在自动部署中，请稍候...");
        
        // 清除草稿
        const drafts = JSON.parse(localStorage.getItem("blog-drafts") || "[]");
        const filteredDrafts = drafts.filter((draft: BlogPost) => draft.id !== post.id);
        localStorage.setItem("blog-drafts", JSON.stringify(filteredDrafts));
        
        // 3秒后跳转到首页（考虑 GitHub Pages 二级路径 /zhaowyblog）
        setTimeout(() => {
          window.location.href = `${basePath}/`;
        }, 3000);
      } else {
        const errorData = await response.json();
        setSaveStatus(`❌ 发布失败：${errorData.message || '未知错误'}`);
      }
      
    } catch (error) {
      console.error('发布文章失败:', error);
      setSaveStatus(`❌ 发布失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* 标题输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章标题 *
          </label>
          <input
            type="text"
            value={post.title}
            onChange={handleTitleChange}
            placeholder="请输入文章标题"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 摘要输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章摘要
          </label>
          <textarea
            value={post.summary}
            onChange={handleSummaryChange}
            placeholder="请输入文章摘要（可选）"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 标签输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章标签
          </label>
          <input
            type="text"
            value={post.tags}
            onChange={handleTagsChange}
            placeholder="请输入标签，多个标签用逗号分隔（可选）"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">例如：产品经理, 技术分享, 个人成长</p>
        </div>

        {/* 内容编辑 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文章内容 *
          </label>
          <AdvancedTiptapEditor
            content={post.content}
            onChange={handleContentChange}
            placeholder="请输入文章内容..."
          />
        </div>

        {/* 特色文章选项 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={post.featured}
            onChange={handleFeaturedChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            设为置顶文章（在首页推荐阅读中显示）
          </label>
        </div>

        {/* 状态提示 */}
        {saveStatus && (
          <div className={`p-3 rounded-md ${
            saveStatus.includes("成功") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            <div className="whitespace-pre-line">{saveStatus}</div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between">
          <button
            onClick={saveDraft}
            disabled={isSaving}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {isSaving ? "保存中..." : "保存草稿"}
          </button>
          
          <button
            onClick={publishPost}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "发布中..." : "发布文章"}
          </button>
        </div>
      </div>
    </div>
  );
}
