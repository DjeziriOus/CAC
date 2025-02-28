import { deleteEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingEvent, mutate: deleteEvent } = useMutation({
    mutationFn: (id) => deleteEventAPI(id), // mutationFn: DeleteEventAPI,
    onSuccess: () => {
      toast.success("Evenement supprimé", {
        description: "Le Evenement a bien été supprimé.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message}, 
      Erreur lors de la suppression du Evenement.`,
      });
    },
  });
  return { isDeletingEvent, deleteEvent };
}
