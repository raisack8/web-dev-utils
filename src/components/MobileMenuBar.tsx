"use client"

import Link from "next/link"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { navigationItems } from "@/data/navigation"

export default function MobileMenuBar() {
  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Menu</MenubarTrigger>
          <MenubarContent align="end">
            {navigationItems.map((item, index) => (
              <MenubarItem key={index} asChild>
                <Link
                  href={item.path}
                  target={item.target}
                  className="flex items-center"
                >
                  {item.label}
                </Link>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}
