"use client";

import Link from "next/link";
import Image from "next/image";
import count from 'word-count';
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  blog: any;
  index?: number;
  showAll?: boolean; // 是否显示所有文章（博客列表页）还是只显示前5篇（首页）
  selectedTag?: string; // 当前选中的标签
}

export default function BlogCard({ blog, selectedTag }: BlogCardProps) {
  // 检查标签是否被选中
  const isTagSelected = (tag: string) => selectedTag === tag;
  
  // 获取标签样式
  const getTagStyle = (tag: string) => {
    return isTagSelected(tag)
      ? "px-2 py-1 text-xs rounded-full bg-blue-500 text-white whitespace-nowrap flex-shrink-0"
      : "px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 whitespace-nowrap flex-shrink-0";
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/blog/${blog.slug}`}>
        {/* 移动端：上下结构 */}
        <div className="md:hidden">
          {/* 封面图 */}
          {blog.coverImage && (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          
          {/* 内容区域 - 适宜间距 */}
          <div className="px-3 py-4 flex flex-col justify-center overflow-hidden">
            {/* 标题 */}
            <h2 className="text-xl font-bold text-gray-900 mb-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {blog.title}
            </h2>
            
            {/* 时间字数 */}
            <p className="text-sm text-gray-500 mb-1">
              发布于{formatDate(blog.date)} {count(blog.content)}字
            </p>
            
            {/* 摘要 - 3行 */}
            {blog.summary && (
              <p className="text-gray-600 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                {blog.summary}
              </p>
            )}
            
            {/* 标签 - 严格控制一行 */}
            {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
              <div className="flex gap-1 overflow-hidden">
                {blog.tags && blog.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                  <span 
                    key={`tag-${tagIndex}`} 
                    className={getTagStyle(tag)}
                  >
                    {tag}
                  </span>
                ))}
                {blog.keywords && blog.keywords.slice(0, 3).map((keyword: string, keywordIndex: number) => (
                  <span 
                    key={`keyword-${keywordIndex}`} 
                    className={getTagStyle(keyword)}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PC端：上下布局 */}
        <div className="hidden md:block">
          {/* 封面图 */}
          {blog.coverImage && (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          
          {/* 内容区域 - 适宜间距 */}
          <div className="px-4 py-6 flex flex-col justify-center overflow-hidden">
            {/* 标题 */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {blog.title}
            </h2>
            
            {/* 时间字数 */}
            <p className="text-sm text-gray-500 mb-2">
              发布于{formatDate(blog.date)} {count(blog.content)}字
            </p>
            
            {/* 摘要 - 3行 */}
            {blog.summary && (
              <p className="text-gray-600 mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                {blog.summary}
              </p>
            )}
            
            {/* 标签 - 严格控制一行 */}
            {((blog.tags && blog.tags.length > 0) || (blog.keywords && blog.keywords.length > 0)) && (
              <div className="flex gap-1 overflow-hidden">
                {blog.tags && blog.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                  <span 
                    key={`tag-${tagIndex}`} 
                    className={getTagStyle(tag)}
                  >
                    {tag}
                  </span>
                ))}
                {blog.keywords && blog.keywords.slice(0, 3).map((keyword: string, keywordIndex: number) => (
                  <span 
                    key={`keyword-${keywordIndex}`} 
                    className={getTagStyle(keyword)}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}