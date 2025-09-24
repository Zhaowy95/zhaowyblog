"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import count from 'word-count';
import { formatDate } from "@/lib/utils";

interface FeaturedBlogsListProps {
  initialFeaturedBlogs: any[];
  selectedTag?: string;
}

export default function FeaturedBlogsList({ initialFeaturedBlogs, selectedTag }: FeaturedBlogsListProps) {
  const [featuredBlogs, setFeaturedBlogs] = useState(initialFeaturedBlogs);

  useEffect(() => {
    // 如果有标签筛选，筛选推荐文章
    if (selectedTag) {
      const filteredBlogs = initialFeaturedBlogs.filter((blog: any) => 
        (blog.tags && blog.tags.includes(selectedTag)) ||
        (blog.keywords && blog.keywords.includes(selectedTag))
      );
      setFeaturedBlogs(filteredBlogs);
    } else {
      setFeaturedBlogs(initialFeaturedBlogs);
    }
  }, [selectedTag, initialFeaturedBlogs]);

  return (
    <>
      {featuredBlogs.map((blog: any) => (
        <article key={blog.slug} className="group">
          <Link href={`/blog/${blog.slug}`} className="block">
            <div className="flex flex-col space-y-2 transition-transform group-hover:translate-x-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h2 className="text-xl font-semibold underline underline-offset-4 group-hover:text-blue-600 transition-colors flex-shrink-0">
                    {blog.title}
                  </h2>
                  {/* 推荐文章图标 */}
                  <img 
                    src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/icon_set top.png`}
                    alt="推荐" 
                    className="w-6 h-4 flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                  {formatDate(blog.date)} · {count(blog.content)} 字
                </span>
              </div>
              <p className="text-gray-600 line-clamp-2">
                {blog.summary}
              </p>
              {/* 标签放在描述下面，一行展示 */}
              {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
                <div className="flex gap-1 overflow-hidden">
                  {blog.tags && blog.tags.map((tag: string, index: number) => (
                    <span 
                      key={`tag-${index}`} 
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
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
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
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
    </>
  );
}
