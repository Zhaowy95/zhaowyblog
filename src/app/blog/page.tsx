"use client";

import { allBlogs } from "content-collections";
import TagList from "@/components/ui/TagList";
import BlogCard from "@/components/BlogCard";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BlogPageContent() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const searchParams = useSearchParams();
  
  // 从URL参数中读取标签
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTag(decodeURIComponent(tagFromUrl));
    }
  }, [searchParams]);
  
  const allBlogsSorted = allBlogs
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredBlogs = selectedTag 
    ? allBlogsSorted.filter((blog: any) => 
        (blog.tags && blog.tags.includes(selectedTag)) ||
        (blog.keywords && blog.keywords.includes(selectedTag))
      )
    : allBlogsSorted;

  const handleTagClick = (tag: string) => {
    const newSelectedTag = selectedTag === tag ? undefined : tag;
    setSelectedTag(newSelectedTag);
    
    // 更新URL参数
    const url = new URL(window.location.href);
    if (newSelectedTag) {
      url.searchParams.set('tag', newSelectedTag);
    } else {
      url.searchParams.delete('tag');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="max-w-3xl mx-auto md:px-4 py-8">
      {/* 标签展示 */}
      <div className="mb-8">
        <TagList onTagClick={handleTagClick} selectedTag={selectedTag} />
      </div>

      {/* 文章列表 - 使用统一的卡片组件 */}
      <div className="space-y-8">
        {filteredBlogs.map((blog: any, index: number) => (
          <BlogCard 
            key={blog.slug} 
            blog={blog} 
            index={index}
            showAll={true}
            selectedTag={selectedTag}
          />
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto md:px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}