import { getUser } from "@/services/apiQuestions";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
const fullTabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];
const defaultTabs = [{ name: "Questions les plus récentes", link: "recents" }];
export function useUser() {
  const stuff = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
  const { isPending, data: { user } = {}, error, isSuccess, isError } = stuff;

  const [searchParams] = useSearchParams();
  let allowedTabs = defaultTabs;
  allowedTabs =
    user?.role === searchParams.get("type") ? fullTabs : defaultTabs;
  return { user, allowedTabs, error, isPending, isSuccess, isError };
}
