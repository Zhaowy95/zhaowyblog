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

const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
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
            <MenuItemComponent key={subItem.title} item={subItem} depth={depth + 1} />
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
    >
      {item.title}
    </Link>
  )
}

export function NavMobileMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <!-- 四个方块组成的汉堡菜单图标 -->
            <rect x="2" y="2" width="8" height="8" rx="2" fill="currentColor"/>
            <rect x="14" y="2" width="8" height="8" rx="2" fill="currentColor"/>
            <rect x="2" y="14" width="8" height="8" rx="2" fill="currentColor"/>
            <rect x="14" y="14" width="8" height="8" rx="2" fill="currentColor"/>
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="flex flex-col space-y-4 ml-4 mt-4">
          {menuItems.map((item) => (
            <MenuItemComponent key={item.title} item={item} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}