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

export default function Sidebar() {
  return (
    // 普段は左端の細い帯だけを見せ、ホバーまたはフォーカスでスライドして表示する
    <div className="hidden md:block fixed inset-y-0 left-0 z-40 w-[14rem] -translate-x-[calc(100%_-_8px)] transition-transform duration-200 hover:translate-x-0 focus-within:translate-x-0 after:absolute after:inset-y-0 after:right-0 after:w-1 after:bg-primary">
      <SidebarPrimitive collapsible="none" className="w-full h-full ps-4">
        <SidebarHeader>
          <h2 className="text-lg font-semibold px-4 py-2">
            <Link href="/">Web Dev Utils</Link>
          </h2>
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
    </div>
  )
}
