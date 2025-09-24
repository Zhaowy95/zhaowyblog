import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "写博客 | Zhao某人",
  description: "开启新的记录吧，它们总会在某一天闪闪发光！",
  icons: [
    { rel: "icon", url: "/boyicon.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/boyicon.png" },
    { rel: "apple-touch-icon", url: "/boyicon.png", sizes: "180x180" },
  ],
};

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
