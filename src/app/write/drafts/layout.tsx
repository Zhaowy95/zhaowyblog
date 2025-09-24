import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "草稿箱 | Zhao某人",
  description: "管理您的博客草稿",
  icons: [
    { rel: "icon", url: "/boyicon.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/boyicon.png" },
    { rel: "apple-touch-icon", url: "/boyicon.png", sizes: "180x180" },
  ],
};

export default function DraftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
