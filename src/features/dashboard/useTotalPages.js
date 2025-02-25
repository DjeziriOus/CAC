import { getQuestionsAPI } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useTotalPages() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const questionsType = searchParams.get("type") || "patient";
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { total: totalQuestions } = {},
    error,
  } = useQuery({
    queryKey: ["questions", questionsType],
    queryFn: () => getQuestionsAPI(questionsType, 1),
  });

  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE);
  // if (page < totalPages)
  //   queryClient.prefetchQuery({
  //     queryKey: ["questions", questionsType, page + 1],
  //     queryFn: () => getQuestionsAPI({ questionsType, page: page + 1 }),
  //   });

  // if (page > 1)
  //   queryClient.prefetchQuery({
  //     queryKey: ["questions", questionsType, page - 1],
  //     queryFn: () => getQuestionsAPI({ questionsType, page: page - 1 }),
  //   });
  return { totalPages, isPending, error, page };
}
