"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
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
