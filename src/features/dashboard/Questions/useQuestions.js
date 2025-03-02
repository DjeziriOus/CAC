import { getQuestionsAPI } from "@/services/apiQuestions";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useQuestions() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const qType = location.pathname.includes("etudiant") ? "etudiant" : "patient";
  const questionsType = searchParams.get("type") || qType;
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { total: totalQuestions, questions } = {},
    error,
  } = useQuery({
    queryKey: ["questions", questionsType, page],
    queryFn: () => getQuestionsAPI(questionsType, page),
  });

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const nextPage = page + 1;
  const prevPage = page - 1;
  if (page < totalPages)
    queryClient.prefetchQuery({
      queryKey: ["questions", questionsType, nextPage],
      queryFn: () => getQuestionsAPI(questionsType, nextPage),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["questions", questionsType, prevPage],
      queryFn: () => getQuestionsAPI(questionsType, prevPage),
    });
  return { questions, totalPages, isPending, error, page };
}
