import { getMyQuestions } from "@/services/apiQuestions";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";
refreshJwtExpiration();
export function useMyQuestions() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { total: totalQuestions, questions: myQuestions } = {},
    error,
  } = useQuery({
    queryKey: ["myQuestions", page],

    queryFn: async () => {
      refreshJwtExpiration();
      return await getMyQuestions(page);
    },
  });

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const nextPage = page + 1;
  const prevPage = page - 1;
  if (page < totalPages)
    queryClient.prefetchQuery({
      queryKey: ["myQuestions", nextPage],
      queryFn: () => getMyQuestions(nextPage),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["myQuestions", prevPage],
      queryFn: () => getMyQuestions(prevPage),
    });
  console.log(myQuestions);
  return { myQuestions, totalPages, isPending, error, page };
}
