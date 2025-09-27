import { type Metadata } from "next";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `文章 | ${config.site.title}`,
  description: `文章列表 - ${config.site.title}`,
  keywords: `${config.site.title}, blogs, ${config.site.title} blogs, nextjs blog template`,
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
