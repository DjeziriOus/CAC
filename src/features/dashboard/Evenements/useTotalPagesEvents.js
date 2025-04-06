import { getEvents } from "@/services/apiQuestions";
import { EVENTS_PER_PAGE } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";

export function useTotalPagesEvents() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "national";
  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { total: totalQuestions } = {},
    error,
  } = useQuery({
    queryKey: ["events", type],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getEvents(1, type);
    },
  });

  const totalPages = Math.ceil(totalQuestions / EVENTS_PER_PAGE);
  return { totalPages, isPending, error, page };
}
