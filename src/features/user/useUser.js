import { getUser } from "@/services/apiQuestions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { CalendarDays, Hospital, MailQuestion, Users } from "lucide-react";
// import { de } from "date-fns/locale";
import { refreshJwtExpiration } from "@/lib/utils";
const fullTabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];
let navSidebar = [];
const defaultTabs = [{ name: "Questions les plus récentes", link: "recents" }];
[
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
];
export function useUser() {
  const stuff = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { isPending, data: { user } = {}, error, isSuccess, isError } = stuff;
  switch (user?.role) {
    case "medecin":
      navSidebar = [
        {
          title: "Questions",
          url: "questions",
          icon: MailQuestion,
        },
        {
          title: "Événements",
          url: "evenements",
          icon: CalendarDays,
        },
      ];
      break;
    case "admin":
      navSidebar = [
        {
          title: "Questions",
          url: "questions",
          icon: MailQuestion,
        },
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
      ];
      break;
    default:
      navSidebar = [];
      refreshJwtExpiration();
      break;
  }
  const [searchParams] = useSearchParams();
  let allowedTabs = defaultTabs;
  allowedTabs =
    user?.role === searchParams.get("type") ? fullTabs : defaultTabs;
  return {
    user,
    allowedTabs,
    error,
    isPending,
    isSuccess,
    isError,
    navSidebar,
  };
}
