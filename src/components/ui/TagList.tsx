"use client";

import { useState, useEffect } from 'react';
import { allBlogs } from 'content-collections';

interface Tag {
  name: string;
  count: number;
}

interface TagListProps {
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
  className?: string;
}

export default function TagList({ onTagClick, selectedTag, className = "" }: TagListProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 统计所有文章的标签
    const tagCount: { [key: string]: number } = {};
    
    allBlogs.forEach((blog: any) => {
      // 处理 tags 字段
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag: string) => {
          if (tag && tag.trim()) {
            const tagName = tag.trim();
            tagCount[tagName] = (tagCount[tagName] || 0) + 1;
          }
        });
      }
      
      // 处理 keywords 字段（兼容现有文章）
      if (blog.keywords && Array.isArray(blog.keywords)) {
        blog.keywords.forEach((keyword: string) => {
          if (keyword && keyword.trim()) {
            const keywordName = keyword.trim();
            tagCount[keywordName] = (tagCount[keywordName] || 0) + 1;
          }
        });
      }
    });

    // 转换为数组并按文章数量排序
    const tagArray = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setTags(tagArray);
  }, []);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className={`flex flex-wrap gap-2 ${isExpanded ? '' : 'max-h-8 overflow-hidden'}`}>
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagClick?.(tag.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTag === tag.name
                ? 'bg-blue-500 text-white shadow-md transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            {tag.name} ({tag.count})
          </button>
        ))}
      </div>
      
      {tags.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          {isExpanded ? '收起' : `展开全部 (${tags.length})`}
        </button>
      )}
    </div>
  );
}
