import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "统计 | ZhaoLabs",
  description: "网站访问统计和数据分析",
  icons: [
    { rel: "icon", url: "/boyicon.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "48x48", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/boyicon.png" },
    { rel: "apple-touch-icon", url: "/boyicon.png", sizes: "180x180" },
  ],
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
