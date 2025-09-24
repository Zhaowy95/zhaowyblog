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
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");

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
    try {
      // 生成Markdown内容
      const timestamp = Date.now();
      const fileName = `blog-${timestamp}.md`;
      const markdown = `---
title: "${post.title}"
date: "${post.date}"
summary: "${post.summary || ''}"
featured: ${post.featured || false}
---

${post.content}`;

      setMarkdownContent(markdown);
      setSaveStatus(`文章已准备就绪！请按照以下步骤手动同步到GitHub：\n\n1. 复制下面的Markdown内容\n2. 在GitHub仓库中创建新文件\n3. 文件路径：src/content/blog/${fileName}\n4. 粘贴内容并提交\n5. Netlify将自动重新部署\n\n文件名：${fileName}`);
      
      // 清除草稿
      const drafts = JSON.parse(localStorage.getItem("blog-drafts") || "[]");
      const filteredDrafts = drafts.filter((draft: BlogPost) => draft.id !== post.id);
      localStorage.setItem("blog-drafts", JSON.stringify(filteredDrafts));
      
    } catch (error) {
      console.error('发布文章失败:', error);
      setSaveStatus(`发布失败: ${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setSaveStatus("Markdown内容已复制到剪贴板！");
    } catch (error) {
      console.error('复制失败:', error);
      setSaveStatus("复制失败，请手动复制内容");
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
            设为特色文章（在首页推荐阅读中显示）
          </label>
        </div>

        {/* 状态提示 */}
        {saveStatus && (
          <div className={`p-3 rounded-md ${
            saveStatus.includes("成功") || saveStatus.includes("准备就绪") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            <div className="whitespace-pre-line">{saveStatus}</div>
            {markdownContent && (
              <div className="mt-4">
                <button
                  onClick={copyMarkdown}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  复制Markdown内容
                </button>
                <div className="mt-2 p-3 bg-gray-100 rounded text-sm font-mono overflow-auto max-h-40">
                  <pre>{markdownContent}</pre>
                </div>
              </div>
            )}
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
