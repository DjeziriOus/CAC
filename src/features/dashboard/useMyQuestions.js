import { getMyQuestions, getQuestionsAPI } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

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
    queryFn: () => getMyQuestions(page),
  });

  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE);
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
