"use client";

import { allBlogs } from "content-collections";
import Link from "next/link";
import Image from "next/image";
import count from 'word-count'
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";
import FeaturedBlogsList from "@/components/FeaturedBlogsList";
import { useState } from "react";

export default function Home() {
  const [selectedTag] = useState<string | undefined>();

  // 推荐文章列表（仅基于服务端featured状态）
  const featuredBlogs = allBlogs
    .filter((blog: any) => blog.featured === true)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allBlogsSorted = allBlogs
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());


  // 获取推荐文章的slug列表，用于去重
  const featuredSlugs = featuredBlogs.map((blog: any) => blog.slug);
  
  const filteredBlogs = selectedTag 
    ? allBlogsSorted.filter((blog: any) => 
        (blog.tags && blog.tags.includes(selectedTag)) ||
        (blog.keywords && blog.keywords.includes(selectedTag))
      )
    : allBlogsSorted;



  const socialLinks = [
    { name: "赞赏", key: "buyMeACoffee" },
    { name: "X", key: "x" },
    { name: "小红书", key: "xiaohongshu" },
    { name: "公众号", key: "wechat" },
    { name: "GitHub", key: "github" },
  ]
    .map(item => ({
      name: item.name,
      href: config.social && config.social[item.key as keyof typeof config.social]
    }))
    .filter(link => !!link.href);

  // 主页结构化数据
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": config.author.name,
    "description": config.author.bio,
    "url": config.site.url,
    "image": config.site.image,
    "sameAs": [
      config.social?.github,
      config.social?.xiaohongshu,
    ].filter(Boolean),
    "jobTitle": "产品经理 & 独立开发者",
    "knowsAbout": ["产品管理", "前端开发", "独立开发", "技术博客"],
    "alumniOf": "技术博客作者"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 个人介绍部分 */}
      <div className="mb-16 space-y-6">
        <div className="text-left">
          <h1 className="text-4xl font-bold mb-3">{config.site.title}</h1>
          <p className="text-md text-gray-600 mb-2">{config.author.bio}</p>
          <p className="text-md text-gray-600">国内大厂产品 | 认真生活家 | 理想主义者</p>
        </div>
        
        {/* 社交链接 - 仅当有链接时才显示 */}
        {socialLinks.length > 0 && (
          <div className="flex space-x-4 items-center">
            {socialLinks.map((link) => (
              <div key={link.name} className="flex items-center">
                {link.name === "公众号" ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Image src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/wechat.png`} alt="公众号" width={24} height={24} className="w-6 h-6" />
                  </a>
                ) : link.name === "GitHub" ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Image src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/github.png`} alt="GitHub" width={24} height={24} className="w-6 h-6" />
                  </a>
                ) : link.name === "小红书" ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <Image src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/redbook.png`} alt="小红书" width={24} height={24} className="w-6 h-6" />
                  </a>
                ) : (
                  <Link href={link.href} className="underline underline-offset-4">
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 近期文章 */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-left">近期文章</h2>
        <FeaturedBlogsList 
          initialFeaturedBlogs={featuredBlogs} 
          selectedTag={selectedTag}
        />
        {filteredBlogs.filter((blog: any) => !featuredSlugs.includes(blog.slug)).slice(0, 4).map((blog: any) => (
            <article key={blog.slug} className="group">
              <Link href={`/blog/${blog.slug}`} className="block">
                <div className="flex flex-col space-y-2 transition-transform group-hover:translate-x-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h2 className="text-xl font-semibold underline underline-offset-4 group-hover:text-blue-600 transition-colors flex-shrink-0">
                        {blog.title}
                      </h2>
                      {/* 标签放在标题后面，一行展示 */}
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
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                      {formatDate(blog.date)} · {count(blog.content)} 字
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {blog.summary}
                  </p>
                </div>
              </Link>
            </article>
        ))}
        
        {/* 查看更多按钮 */}
        <div className="text-center mt-8">
          <Link 
            href="/blog" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            查看更多 &gt;
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
