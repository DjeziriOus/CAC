import { getEvent } from "@/services/apiQuestions";
import { API_URL } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export function useEvent() {
  const { eventId } = useParams();

  const {
    isPending,
    data: { event } = {},
    error,
  } = useQuery({
    queryKey: ["event", Number(eventId)],
    queryFn: () => getEvent(eventId),
  });
  // console.log(event);
  return { event, isPending, error };
}
