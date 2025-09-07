import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Settings, Users } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [{
    "label":"文字列",
    "path":"/string"
  },{
    "label":"メモ",
    "path":"/memo" 
  }]
  return (
    <SidebarPrimitive>
      <SidebarHeader>
        <h2 className="text-lg font-semibold px-4 py-2">
          <Link href="/">Web Dev Utils</Link>
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((x,i)=>(
          <SidebarMenuItem key={i}>
            <SidebarMenuButton asChild>
              <Link href={x.path}>
                {x.label}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarPrimitive>
  );
}