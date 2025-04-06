import { getQuestionsAPI } from "@/services/apiQuestions";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";

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
    queryFn: async () => {
      refreshJwtExpiration();
      return await getQuestionsAPI(questionsType, 1);
    },
  });

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  return { totalPages, isPending, error, page };
}
