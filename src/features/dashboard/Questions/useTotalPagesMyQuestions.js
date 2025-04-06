import { getMyQuestions } from "@/services/apiQuestions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";

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
    queryFn: async () => {
      refreshJwtExpiration();
      return await getMyQuestions(1);
    },
  });

  console.log("totalQuestions", totalPages);
  return { totalPages, isPending, error, page };
}
