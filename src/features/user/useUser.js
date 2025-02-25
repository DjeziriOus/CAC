import { getUser } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
const fullTabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];
const defaultTabs = [{ name: "Questions les plus récentes", link: "recents" }];
export function useUser() {
  const {
    isPending,
    data: { user } = {},
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (!localStorage.getItem("token")) return {};
      return getUser();
    },
  });
  const [searchParams] = useSearchParams();
  let allowedTabs = defaultTabs;
  allowedTabs =
    user?.role === searchParams.get("type") ? fullTabs : defaultTabs;
  return { user, error, isPending, allowedTabs };
}
