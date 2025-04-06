import { refreshJwtExpiration } from "@/lib/utils";

import { getService } from "@/services/apiQuestions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useService() {
  const { serviceId } = useParams();

  const {
    isPending,
    data: { service } = {},
    error,
  } = useQuery({
    queryKey: ["service", Number(serviceId)],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getService(serviceId);
    },
  });
  // console.log(service);
  return { service, isPending, error };
}
