import { getUser } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

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
  console.log(error);
  return { user, error, isPending };
}
