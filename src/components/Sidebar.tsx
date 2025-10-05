import Link from "next/link"
import { Target } from "lucide-react"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
} from "@/components/ui/sidebar"
import { navigationItems } from "@/data/navigation"
import { ModeToggle } from "./mode-toggle"

export default function Sidebar() {
  return (
    <SidebarPrimitive className="w-[14rem] ps-4">
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">
          <Link href="/">Web Dev Utils</Link>
        </h2>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((x, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton asChild>
                <Link href={x.path} target={x.target}>
                  {x.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarPrimitive>
  )
}
