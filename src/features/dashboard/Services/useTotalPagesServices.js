import { getEvents, getServices } from "@/services/apiQuestions";
import { EVENTS_PER_PAGE, SERVICES_PER_PAGE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";

export function useTotalPagesServices() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { total: totalQuestions } = {},
    error,
  } = useQuery({
    queryKey: ["services", "total"],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getServices(1);
    },
  });

  const totalPages = Math.ceil(totalQuestions / SERVICES_PER_PAGE);
  return { totalPages, isPending, error, page };
}
