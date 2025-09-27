"use client"

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { menuItems, MenuItem } from "./nav-data"
import Link from "next/link"

const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number; onClose?: () => void }> = ({ item, depth = 0, onClose }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.submenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between py-2 text-lg font-medium transition-colors hover:text-primary",
              depth > 0 && "pl-4"
            )}
          >
            {item.title}
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {item.submenu.map((subItem) => (
            <MenuItemComponent key={subItem.title} item={subItem} depth={depth + 1} onClose={onClose} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      href={item.href || "/"}
      title={item.title}
      className={cn(
        "block py-2 text-lg font-medium transition-colors hover:text-primary",
        depth > 0 && "pl-4",
        item.href === "/" && "text-primary"
      )}
      onClick={onClose}
    >
      {item.title}
    </Link>
  )
}

export function NavMobileMenu() {
  const [open, setOpen] = React.useState(false)
  const [isWechat, setIsWechat] = React.useState(false)

  React.useEffect(() => {
    // 检测微信浏览器
    const checkWechat = () => {
      const isWechatBrowser = /micromessenger/i.test(navigator.userAgent);
      setIsWechat(isWechatBrowser);
      
      if (isWechatBrowser) {
        // 微信浏览器中，当菜单打开时防止页面滚动
        if (open) {
          document.body.classList.add('sheet-open');
        } else {
          document.body.classList.remove('sheet-open');
        }
      }
    };
    
    checkWechat();
    
    // 监听菜单状态变化
    if (isWechat) {
      if (open) {
        document.body.classList.add('sheet-open');
      } else {
        document.body.classList.remove('sheet-open');
      }
    }
    
    return () => {
      if (isWechat) {
        document.body.classList.remove('sheet-open');
      }
    };
  }, [open, isWechat]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden flex items-center justify-start">
          <svg className="h-6 w-6" viewBox="0 0 1050 1024" fill="currentColor">
            <path d="M404.348718 21.005128c28.882051 0 52.512821 23.630769 52.51282 52.512821v351.835897c0 28.882051-23.630769 52.512821-52.51282 52.512821H52.512821c-28.882051 0-52.512821-23.630769-52.512821-52.512821V73.517949c0-28.882051 23.630769-52.512821 52.512821-52.512821h351.835897z m538.25641 540.882051c28.882051 0 52.512821 23.630769 52.512821 52.512821v351.835897c0 28.882051-23.630769 52.512821-52.512821 52.512821H593.394872c-28.882051 0-52.512821-23.630769-52.512821-52.512821V614.4c0-28.882051 23.630769-52.512821 52.512821-52.512821h349.210256z m78.769231-406.974358c23.630769 13.128205 31.507692 42.010256 21.005128 65.641025L892.717949 504.123077c-13.128205 23.630769-42.010256 31.507692-65.641026 21.005128l-283.569231-149.661538c-23.630769-13.128205-31.507692-42.010256-21.005128-65.641026L674.789744 26.25641c13.128205-23.630769 42.010256-31.507692 65.641025-21.005128l280.94359 149.661539zM404.348718 561.887179c28.882051 0 52.512821 23.630769 52.51282 52.512821v351.835897c0 28.882051-23.630769 52.512821-52.51282 52.512821H52.512821c-28.882051 0-52.512821-23.630769-52.512821-52.512821V614.4c0-28.882051 23.630769-52.512821 52.512821-52.512821h351.835897z"/>
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={`w-[240px] sm:w-[300px] ${isWechat ? 'wechat-browser:!w-full wechat-browser:!h-full wechat-browser:!max-w-none wechat-browser:!max-h-none' : ''}`}
      >
        <nav className="flex flex-col space-y-4 ml-4 mt-4">
          {menuItems.map((item) => (
            <MenuItemComponent key={item.title} item={item} onClose={() => setOpen(false)} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}