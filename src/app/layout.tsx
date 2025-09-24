import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { config } from "@/lib/config";

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
        {/* 微信相关 meta 标签 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Can某人" />
        <meta name="application-name" content="Can某人" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-w-md overflow-x-hidden">
        <Header />
        {children}
      </body>
    </html>
  );
}
