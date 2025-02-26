import { CalendarDays, Hospital, MailQuestion, Users } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import SkeletonUser from "./ui/SkeletonUser";
import { useUser } from "@/features/user/useUser";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Utilisateurs",
      url: "utilisateurs",
      icon: Users,
    },
    {
      title: "Événements",
      url: "evenements",
      icon: CalendarDays,
    },
    {
      title: "Services",
      url: "services",
      icon: Hospital,
    },
    {
      title: "Questions",
      url: "questions",
      icon: MailQuestion,
    },
  ],
};

export function AppSidebar({ ...props }) {
  // console.log("nice");

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //   }
  // }, []);

  const { isPending } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {isPending ? <SkeletonUser /> : <NavUser />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
