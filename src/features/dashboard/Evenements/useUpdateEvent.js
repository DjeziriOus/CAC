import { updateEvent as updateEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  // const { eventId } = useParams();
  const { isPending: isUpdatingEvent, mutateAsync: updateEvent } = useMutation({
    mutationFn: async (formdata) => {
      const { abortControllerRef } = formdata;
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      await updateEventAPI(formdata, signal);
    }, // mutationFn: updateEventAPI,
    onSuccess: () => {
      toast.success("Événement modifié", {
        description: "L'événement a bien été modifié.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification", {
        description: `${error.message} -- 
      Erreur lors de la modification de l'événement.`,
      });
      refreshJwtExpiration();
    },
  });
  return { isUpdatingEvent, updateEvent };
}
