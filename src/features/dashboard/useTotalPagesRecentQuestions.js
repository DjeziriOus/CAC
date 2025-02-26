import { getQuestionsAPI } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useTotalPagesRecentQuestions() {
  // const containsMy = location.pathname.includes("my");
  // const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const questionsType = location.pathname.includes("patient")
    ? "patient"
    : "etudiant";
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
  return { totalPages, isPending, error, page };
}
