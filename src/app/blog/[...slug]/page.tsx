import { allBlogs } from "content-collections"
import type { Metadata } from "next"
import { absoluteUrl, formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { getTableOfContents } from "@/lib/toc"
import { DashboardTableOfContents } from "@/components/toc"
import { MDXRemote } from 'next-mdx-remote-client/rsc'
import count from 'word-count'
import { components } from "@/components/mdx-components"
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import 'highlight.js/styles/github-dark.min.css'
import { GoToTop } from "@/components/go-to-top"
import ValineComments from "@/components/comments/ValineComments"
import 'katex/dist/katex.min.css';
import { config } from "@/lib/config";
import WechatShareOptimization from "@/components/WechatShareOptimization";
import AnalyticsTracker from "@/components/AnalyticsTracker";

type BlogsPageProps = {
  params: Promise<{slug: string[]}>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const options = {
  mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeKatex,
        rehypeHighlight,
        rehypeSlug
      ],
  }
}

async function getBlogsFromParams(slugs: string[]) {
  const slug = slugs?.join("/") || ""
  const blog = allBlogs.find((blog: any) => blog.slug === slug)

  if (!blog) {
    return null
  }

  return blog
}

export async function generateMetadata({ params }: BlogsPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    return {}
  }

  const publishedTime = new Date(blog.date).toISOString();
  const modifiedTime = blog.updated ? new Date(blog.updated).toISOString() : publishedTime;
  
  return {
    title: `${blog.title} | ${config.site.title}`,
    description: blog.summary || blog.title,
    keywords: blog.keywords,
    authors: [{ name: config.author.name, url: config.site.url }],
    openGraph: {
      title: blog.title,
      description: blog.summary || blog.title,
      type: "article",
      url: absoluteUrl("/blog/" + blog.slug),
      siteName: config.site.name,
      locale: "zh_CN",
      publishedTime,
      modifiedTime,
      authors: [config.author.name],
      images: [
        {
          url: config.site.image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary || blog.title,
      images: [config.site.image],
      creator: config.seo.twitter.creator,
    },
    alternates: {
      canonical: absoluteUrl("/blog/" + blog.slug),
    },
  }
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    // 如果没有博客文章，返回空数组
    if (!allBlogs || allBlogs.length === 0) {
      console.log('No blogs found, returning empty array for static params')
      return []
    }
    
    console.log(`Found ${allBlogs.length} blogs for static generation`)
    
    // @ts-ignore
    return allBlogs.map((blog: any) => ({
      slug: blog.slug.split('/'),
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // 返回空数组而不是抛出错误，这样构建可以继续
    return []
  }
}

export default async function BlogPage(props: BlogsPageProps) {
  const { slug } = await props.params;
  const blog = await getBlogsFromParams(slug)

  if (!blog) {
    notFound()
  }

  const toc = await getTableOfContents(blog.content)

  // 结构化数据
  const publishedTime = new Date(blog.date).toISOString();
  const modifiedTime = blog.updated ? new Date(blog.updated).toISOString() : publishedTime;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.summary || blog.title,
    "author": {
      "@type": "Person",
      "name": config.author.name,
      "url": config.site.url
    },
    "publisher": {
      "@type": "Organization",
      "name": config.site.name,
      "url": config.site.url,
      "logo": {
        "@type": "ImageObject",
        "url": config.site.image
      }
    },
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "url": absoluteUrl("/blog/" + blog.slug),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl("/blog/" + blog.slug)
    },
    "keywords": blog.keywords?.join(", "),
    "wordCount": count(blog.content),
    "inLanguage": "zh-CN"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WechatShareOptimization
        title={blog.title}
        description={blog.summary || blog.title}
        image={config.site.image}
        url={absoluteUrl("/blog/" + blog.slug)}
      />
      <main className="relative py-6 max-w-full md:max-w-6xl mx-auto lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="max-w-4xl mx-auto w-full px-6">
          <div className="my-8">
            <h1 className="text-[32px] font-bold">{blog.title}</h1>
          </div>

        <div className="my-4 flex items-center justify-between">
          <p className="text-sm">
            {formatDate(blog.date)} · {count(blog.content)} 字
          </p>
        </div>

        <div className="">
          <MDXRemote source={blog.content} components={components} options={options} />
        </div>

        {/* 文章评论 */}
        <ValineComments articleId={blog.slug} title={blog.title} />
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-6 h-[calc(100vh-3.5rem)]">
          <div className="h-full overflow-auto pb-10 flex flex-col justify-between mt-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <DashboardTableOfContents toc={toc} />
            <GoToTop />
          </div>
        </div>
      </div>
      </main>
      
      {/* 博客文章浏览统计 */}
      <AnalyticsTracker 
        type="blog_view" 
        blogSlug={blog.slug} 
        blogTitle={blog.title}
      />
    </>
  );
}
