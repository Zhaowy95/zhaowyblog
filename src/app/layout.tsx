import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { config } from "@/lib/config";
import WechatCompatibility from "@/components/WechatCompatibility";
import EyeProtectionMode from "@/components/EyeProtectionMode";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import AnalyticsDataProvider from "@/components/AnalyticsDataProvider";

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description,
  keywords: config.site.keywords,
  metadataBase: config.seo.metadataBase,
  alternates: config.seo.alternates,
  icons: [
    { rel: "icon", url: "/boyicon.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "48x48", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/boyicon.png" },
    { rel: "apple-touch-icon", url: "/boyicon.png", sizes: "180x180" },
  ],
  openGraph: {
    url: config.site.url,
    type: config.seo.openGraph.type,
    title: config.site.title,
    description: config.site.description,
    images: [
      { url: config.site.image }
    ]
  },
  twitter: {
    site: config.site.url,
    card: config.seo.twitter.card,
    title: config.site.title,
    description: config.site.description,
    images: [
      { url: config.site.image }
    ]
  },
  manifest: config.site.manifest,
  appleWebApp: {
    title: config.site.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css" 
          as="style" 
        />
        <noscript>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css" />
        </noscript>
        <style>
          {`
            body {
              font-family: "LXGW WenKai Lite", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            }
            
            /* 微信浏览器优化样式 */
            @media screen and (max-width: 768px) {
              html {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                text-size-adjust: 100%;
              }
              
              body {
                -webkit-overflow-scrolling: touch;
                overflow-x: hidden;
                max-width: 100vw;
                box-sizing: border-box;
              }
              
              /* 防止微信浏览器缩放问题 */
              * {
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
              }
              
              /* 确保容器不会超出屏幕宽度 */
              .max-w-3xl, .max-w-4xl {
                max-width: 100vw !important;
                padding-left: 1rem;
                padding-right: 1rem;
              }
              
              /* 优化移动端字体大小 */
              @media screen and (max-width: 480px) {
                html {
                  font-size: 14px;
                }
                
                .text-4xl {
                  font-size: 1.875rem !important;
                }
                
                .text-3xl {
                  font-size: 1.5rem !important;
                }
                
                .text-2xl {
                  font-size: 1.25rem !important;
                }
                
                .text-xl {
                  font-size: 1.125rem !important;
                }
              }
            }
            
            /* 微信浏览器特定优化 */
            .wechat-browser {
              -webkit-text-size-adjust: 100% !important;
              -ms-text-size-adjust: 100% !important;
              text-size-adjust: 100% !important;
            }
            
            .wechat-browser html,
            .wechat-browser body {
              margin: 0 !important;
              padding: 0 !important;
              overflow-x: hidden !important;
              max-width: 100vw !important;
              width: 100% !important;
              position: relative !important;
              left: 0 !important;
              transform: translateX(0) !important;
            }
            
            .wechat-browser .max-w-3xl,
            .wechat-browser .max-w-4xl {
              max-width: 100vw !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              position: relative !important;
              left: 0 !important;
              transform: translateX(0) !important;
            }
            
            /* 微信浏览器容器强制重置 */
            .wechat-browser .container {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              max-width: 100vw !important;
              width: 100% !important;
              position: relative !important;
              left: 0 !important;
              transform: translateX(0) !important;
            }
            
            /* 微信浏览器图片优化 */
            .wechat-browser img {
              max-width: 100% !important;
              height: auto !important;
              display: block !important;
            }
            
            /* 微信浏览器文字优化 */
            .wechat-browser p,
            .wechat-browser div,
            .wechat-browser span {
              word-wrap: break-word !important;
              word-break: break-all !important;
              overflow-wrap: break-word !important;
            }
          `}
        </style>
        <script dangerouslySetInnerHTML={{
          __html: `
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.1.0/style.css';
            document.head.appendChild(link);
          `
        }} />
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml" />
        <link rel="alternate" type="application/json" title="JSON" href="/feed.json" />
        {/* 关键资源预加载 */}
        <link rel="preload" href="/boyicon.png" as="image" />
        <link rel="preload" href="/writeblog.png" as="image" />
        <link rel="preload" href="/avatar.jpg" as="image" />
        <link rel="preload" href="/github.png" as="image" />
        <link rel="preload" href="/wechat.png" as="image" />
        <link rel="preload" href="/redbook.png" as="image" />
        <link rel="icon" href="/boyicon.png" type="image/png" />
        <link rel="icon" href="/boyicon.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/boyicon.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/boyicon.png" sizes="48x48" type="image/png" />
        <link rel="shortcut icon" href="/boyicon.png" />
        <link rel="apple-touch-icon" href="/boyicon.png" />
        <link rel="apple-touch-icon" href="/boyicon.png" sizes="180x180" />
        <meta name="msapplication-TileImage" content="/boyicon.png" />
        {/* 微信相关 meta 标签 - 优化viewport设置 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZhaoLabs" />
        <meta name="application-name" content="ZhaoLabs" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* 微信浏览器兼容性设置 */}
        <meta name="referrer" content="no-referrer" />
        <meta name="referrer" content="never" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="renderer" content="webkit" />
        <meta name="force-rendering" content="webkit" />
        <meta name="x5-orientation" content="portrait" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="x5-cache" content="false" />
        <meta name="x5-cache-mode" content="no-cache" />
        <meta name="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta name="Pragma" content="no-cache" />
        <meta name="Expires" content="0" />
      </head>
      <body className="min-w-md overflow-x-hidden">
        <WechatCompatibility />
        <Header />
        <AnalyticsDataProvider>
          {children}
          <AnalyticsTracker type="page_view" />
        </AnalyticsDataProvider>
        <EyeProtectionMode />
      </body>
    </html>
  );
}
