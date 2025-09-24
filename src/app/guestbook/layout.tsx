import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "留言板 | Can某人",
  description: "欢迎在这里留下您的想法、建议或任何想说的话",
  icons: [
    { rel: "icon", url: "/boyicon.png", sizes: "16x16", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", sizes: "48x48", type: "image/png" },
    { rel: "icon", url: "/boyicon.png", type: "image/png" },
    { rel: "shortcut icon", url: "/boyicon.png" },
    { rel: "apple-touch-icon", url: "/boyicon.png", sizes: "180x180" },
  ],
};

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
