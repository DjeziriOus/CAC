import { getMyQuestions } from "@/services/apiQuestions";
import { PAGE_SIZE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useTotalPagesMyQuestions() {
  // const containsMy = location.pathname.includes("my");
  // const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const questionsType = location.pathname.includes("patient")
    ? "patient"
    : "etudiant";
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { totalPages } = {},
    error,
  } = useQuery({
    queryKey: ["myQuestions", questionsType],
    queryFn: () => getMyQuestions(1),
  });

  console.log("totalQuestions", totalPages);
  return { totalPages, isPending, error, page };
}
