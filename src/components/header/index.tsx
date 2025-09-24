"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavDesktopMenu } from "./nav-desktop-menu";
import { NavMobileMenu } from "./nav-mobile-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
// import { SquareTerminal } from "lucide-react";
import { config } from "@/lib/config";
import PasswordModal from "@/components/auth/PasswordModal";

export function Header() {
  const pathname = usePathname();
  const isBlogPage = pathname.includes("/blog/") || pathname.includes("/write");
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
        animate={{ maxWidth: isBlogPage ? "72rem" : "48rem" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn("container mx-auto flex h-16 items-center justify-between md:px-4", isBlogPage ? "max-w-4xl xl:max-w-6xl" : "max-w-3xl")}
      >
        {/* Mobile navigation */}
        <NavMobileMenu />

        {/* Logo */}
        <Link href="/" title="Home" className="flex items-center gap-4 md:order-first">
          {config.author.avatar && (
            <img 
              src={config.author.avatar} 
              alt="Home" 
              className="w-10 h-10 rounded-full object-cover"
              loading="eager"
              decoding="async"
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
            <img 
              src={`${process.env.NODE_ENV === 'production' ? '/zhaowyblog' : ''}/writeblog.png`}
              alt="写博客" 
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              loading="eager"
              decoding="async"
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
