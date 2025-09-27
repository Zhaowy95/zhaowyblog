"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { NavDesktopMenu } from "./nav-desktop-menu";
import { NavMobileMenu } from "./nav-mobile-menu";
import { motion } from "framer-motion";
// import { SquareTerminal } from "lucide-react";
import { config } from "@/lib/config";
import PasswordModal from "@/components/auth/PasswordModal";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // 检测是否为需要调整宽度的页面
  const isWidePage = pathname.includes("/blog/") || pathname.includes("/write");

  const handleWriteBlogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const handleAuthSuccess = () => {
    router.push("/write");
  };


  return (
    <header className="pt-4">
      <motion.div
        initial={{ maxWidth: "48rem" }}
        animate={{ maxWidth: isWidePage ? "72rem" : "48rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`container mx-auto flex h-16 items-center justify-between px-4 ${
          isWidePage ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        {/* Mobile navigation */}
        <NavMobileMenu />

        {/* Logo */}
        <Link href="/" title="Home" className="flex items-center gap-4 md:order-first">
          {config.author.avatar && (
            <Image 
              src={config.author.avatar} 
              alt="Home" 
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              priority
            />
          )}
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:block">
          <NavDesktopMenu />
        </div>

        {/* Write Blog Button */}
        <div className="flex items-center relative">
          <button 
            onClick={handleWriteBlogClick}
            className="flex items-center"
            title="写博客"
          >
            <Image 
              src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/writeblog.png`}
              alt="写博客" 
              width={32}
              height={32}
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              priority
            />
          </button>
          
          {/* Password Modal */}
          <PasswordModal 
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            onSuccess={handleAuthSuccess}
          />
        </div>

      </motion.div>
    </header >
  );
}
