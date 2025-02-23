import {
  AudioWaveform,
  BookOpen,
  Bot,
  CalendarDays,
  Command,
  Frame,
  GalleryVerticalEnd,
  Hospital,
  MailQuestion,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/features/user/userSlice";
import { useEffect } from "react";
import SkeletonUser from "./ui/SkeletonUser";

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
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
  const { user, status } = useSelector((state) => state.user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {status === "loadingUser" ? (
          <SkeletonUser />
        ) : (
          <NavUser user={user} status={status} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
