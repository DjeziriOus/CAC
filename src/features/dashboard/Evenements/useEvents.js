import { getEvents } from "@/services/apiQuestions";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";
import { EVENTS_PER_PAGE } from "@/utils/constants";
export function useEvents() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "national";

  const {
    isPending,
    data: { total, events } = {},
    error,
  } = useQuery({
    queryKey: ["events", type, page],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getEvents(page, type);
    },
  });
  const totalPages = Math.ceil(total / EVENTS_PER_PAGE);
  const nextPage = page + 1;
  const prevPage = page - 1;
  if (page < totalPages)
    queryClient.prefetchQuery({
      queryKey: ["events", type, nextPage],
      queryFn: () => getEvents(nextPage, type),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["events", type, prevPage],
      queryFn: () => getEvents(prevPage, type),
    });
  return { events, isPending, error, total };
}
