import { refreshJwtExpiration } from "@/lib/utils";
import { getServices } from "@/services/apiQuestions";
import { SERVICES_PER_PAGE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function useServices() {
  // useEffect(() => {

  // }, []);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: { services, total } = {},
    error,
  } = useQuery({
    queryKey: ["services", page],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getServices(page);
    },
  });

  const totalPages = Math.ceil(total / SERVICES_PER_PAGE);
  const nextPage = page + 1;
  const prevPage = page - 1;
  if (page < totalPages)
    queryClient.prefetchQuery({
      queryKey: ["services", nextPage],
      queryFn: () => getServices(nextPage),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["services", prevPage],
      queryFn: () => getServices(prevPage),
    });
  return { services, isPending, error, total };
}
