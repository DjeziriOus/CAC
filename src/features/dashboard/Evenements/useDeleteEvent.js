import { refreshJwtExpiration } from "@/lib/utils";
import { deleteEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingEvent, mutate: deleteEvent } = useMutation({
    mutationFn: (id) => deleteEventAPI(id), // mutationFn: DeleteEventAPI,
    onSuccess: () => {
      toast.success("Événement supprimé", {
        description: "l'Événement a bien été supprimé.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message}, 
      Erreur lors de la suppression de l'Événement.`,
      });
      refreshJwtExpiration();
    },
  });
  return { isDeletingEvent, deleteEvent };
}
