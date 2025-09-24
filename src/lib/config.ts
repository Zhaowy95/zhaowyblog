const basePath = process.env.NODE_ENV === 'production' ? '/zhaowyblog' : '';

export const config = {
  site: {
    title: "Zhao某人",
    name: "Zhao某人",
    description: "专注于产品经理转独立开发之路",
    keywords: ["产品经理", "独立开发", "前端开发", "技术博客"],
    url: "https://zhaowy95.github.io/zhaowyblog/",
    baseUrl: "https://zhaowy95.github.io/zhaowyblog/",
    image: "https://zhaowy95.github.io/zhaowyblog/avatar.jpg",
    favicon: {
      ico: `${basePath}/boyicon.png`,
      png: `${basePath}/boyicon.png`,
      svg: `${basePath}/boyicon.png`,
      appleTouchIcon: `${basePath}/boyicon.png`,
    },
    manifest: `${basePath}/site.webmanifest`,
    rss: {
      title: "Zhao某人",
      description: "专注于产品经理转独立开发之路",
      feedLinks: {
        rss2: `${basePath}/rss.xml`,
        json: `${basePath}/feed.json`,
        atom: `${basePath}/atom.xml`,
      },
    },
  },
  author: {
    name: "zhaowy",
    email: "zhaowy95@163.com",
    bio: "专注于产品经理转独立开发之路",
    avatar: `${basePath}/avatar.jpg`,
  },
  social: {
    github: "https://github.com/Zhaowy95",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/5c7f632d000000001600761a",
    wechat: `${basePath}/images/wechat-qr.png`,
  },
  giscus: {
    repo: "guangzhengli/hugo-ladder-exampleSite",
    repoId: "R_kgDOHyVOjg",
    categoryId: "DIC_kwDOHyVOjs4CQsH7",
  },
  navigation: {
    main: [
      { 
        title: "文章", 
        href: "/blog",
      },
      { 
        title: "留言板", 
        href: "/guestbook",
      },
    ],
  },
  auth: {
    password: "123456",
  },
  seo: {
    metadataBase: new URL("https://zhaowy95.github.io/zhaowyblog/"),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@zhaowy",
    },
  },
};
