"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Navigate, NavLink } from "react-router-dom";
import LinkButton from "./ui/LinkButton";
import styles from "./ui/SidebarMenuButton.module.css";

export function NavMain({ items }) {
  return (
    <div className={styles.nav}>
      <SidebarGroup>
        {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} className={styles.button}>
                  {item.icon && <item.icon className="mr-2 scale-125" />}
                  <span className="text-base font-medium">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
