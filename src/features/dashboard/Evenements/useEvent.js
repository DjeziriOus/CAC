import { getEvent } from "@/services/apiQuestions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { refreshJwtExpiration } from "@/lib/utils";
export function useEvent() {
  const { eventId } = useParams();

  const {
    isPending,
    data: { event } = {},
    error,
  } = useQuery({
    queryKey: ["event", Number(eventId)],
    queryFn: async () => {
      refreshJwtExpiration();
      return await getEvent(eventId);
    },
  });
  // console.log(event);
  return { event, isPending, error };
}
