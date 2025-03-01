import { updateEvent as updateEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  // const { eventId } = useParams();
  const { isPending: isUpdatingEvent, mutate: updateEvent } = useMutation({
    mutationFn: (formdata) => updateEventAPI(formdata), // mutationFn: updateEventAPI,
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
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification", {
        description: `${error.message} -- 
      Erreur lors de la modification de l'événement.`,
      });
    },
  });
  return { isUpdatingEvent, updateEvent };
}
