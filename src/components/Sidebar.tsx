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

export default function Sidebar() {
  const menuItems = [
    {
      label: "文字列",
      path: "/string",
      target: undefined,
    },
    {
      label: "メモ",
      path: "/memo",
      target: undefined,
    },
    {
      label: "MyDocs",
      path: "https://raisack8.github.io/my-skill/",
      target: "_blank",
    },
  ]
  return (
    <SidebarPrimitive>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">
          <Link href="/">Web Dev Utils</Link>
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((x, i) => (
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
