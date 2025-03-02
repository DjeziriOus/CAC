import { addEvent as addEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddEvent() {
  const queryClient = useQueryClient();

  const { isPending: isAddingEvent, mutate: addEvent } = useMutation({
    mutationFn: (event) => addEventAPI(event), // mutationFn: addEventAPI,
    onSuccess: () => {
      toast.success("événement ajouté", {
        description: "L'événement a bien été ajouté.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout de l'événement.`,
      });
    },
  });
  return { isAddingEvent, addEvent };
}
