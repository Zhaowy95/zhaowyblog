"use client";

import { allBlogs } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { formatDate } from "@/lib/utils";
import TagList from "@/components/ui/TagList";
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 标签展示 */}
      <div className="mb-8">
        <TagList onTagClick={handleTagClick} selectedTag={selectedTag} />
      </div>

      {/* 文章列表 */}
      <div className="space-y-8">
        {filteredBlogs.map((blog: any) => (
          <article 
            key={blog.slug} 
            className=""
          >
            <Link href={`/blog/${blog.slug}`}>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold underline underline-offset-4">
                    {blog.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(blog.date)} · {count(blog.content)} 字
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {blog.summary}
                </p>
                {/* 显示所有标签（包括tags和keywords） */}
                {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags && blog.tags.map((tag: string, index: number) => (
                      <span 
                        key={`tag-${index}`} 
                        className={`px-2 py-1 text-xs rounded ${
                          selectedTag === tag 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.keywords && blog.keywords.map((keyword: string, index: number) => (
                      <span 
                        key={`keyword-${index}`} 
                        className={`px-2 py-1 text-xs rounded ${
                          selectedTag === keyword 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}