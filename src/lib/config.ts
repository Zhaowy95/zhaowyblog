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
      ico: "/boyicon.png",
      png: "/boyicon.png",
      svg: "/boyicon.png",
      appleTouchIcon: "/boyicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "Zhao某人",
      description: "专注于产品经理转独立开发之路",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "zhaowy",
    email: "zhaowy95@163.com",
    bio: "专注于产品经理转独立开发之路",
    avatar: "/avatar.jpg",
  },
  social: {
    github: "https://github.com/Zhaowy95",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/5c7f632d000000001600761a",
    wechat: "/images/wechat-qr.png",
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
