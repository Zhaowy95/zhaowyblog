"use client";

import { allBlogs } from "content-collections";
import Link from "next/link";
import Image from "next/image";
import { config } from "@/lib/config";
import { useState, useRef } from "react";
import WechatQRModal from "@/components/WechatQRModal";
import SubsQRModal from "@/components/SubsQRModal";
import BlogCard from "@/components/BlogCard";

export default function Home() {
  const [selectedTag] = useState<string | undefined>();
  const [showWechatModal, setShowWechatModal] = useState(false);
  const [showSubsModal, setShowSubsModal] = useState(false);
  const wechatIconRef = useRef<HTMLButtonElement>(null);
  const subsIconRef = useRef<HTMLButtonElement>(null);

  const allBlogsSorted = allBlogs.sort((a: any, b: any) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
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
    { name: "订阅", key: "subs" },
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
          <p className="text-md text-gray-600">腾讯音乐PM | 认真生活 | 理想主义者</p>
        </div>
        
        {/* 社交链接 - 仅当有链接时才显示 */}
        {socialLinks.length > 0 && (
          <div className="flex space-x-4 items-center">
            {socialLinks.map((link) => (
              <div key={link.name} className="flex items-center">
                {link.name === "公众号" ? (
                  <button 
                    ref={wechatIconRef}
                    onClick={() => setShowWechatModal(true)}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    aria-label="显示微信二维码"
                  >
                    <Image src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/wechat.png`} alt="公众号" width={24} height={24} className="w-6 h-6" />
                  </button>
                ) : link.name === "订阅" ? (
                  <button 
                    ref={subsIconRef}
                    onClick={() => setShowSubsModal(true)}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    aria-label="显示订阅二维码"
                  >
                    <Image src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/subs-logo.png`} alt="订阅" width={24} height={24} className="w-6 h-6 object-contain" />
                  </button>
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

      {/* 文章列表 */}
      <div className="space-y-8 mt-4">
        {filteredBlogs.slice(0, 5).map((blog: any, index: number) => (
          <BlogCard 
            key={blog.slug} 
            blog={blog} 
            index={index}
            showAll={false}
          />
        ))}
        
        {/* 查看更多链接 */}
        <div className="text-center mt-8">
          <Link 
            href="/blog" 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            查看更多 &gt;
          </Link>
        </div>
      </div>
      </div>

      {/* 微信二维码弹窗 */}
      <WechatQRModal 
        isOpen={showWechatModal}
        onClose={() => setShowWechatModal(false)}
        triggerRef={wechatIconRef}
      />

      {/* 订阅二维码弹窗 */}
      <SubsQRModal 
        isOpen={showSubsModal}
        onClose={() => setShowSubsModal(false)}
        triggerRef={subsIconRef}
      />
    </>
  );
}
