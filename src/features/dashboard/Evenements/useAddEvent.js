import { addEvent as addEventAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";
export function useAddEvent() {
  const queryClient = useQueryClient();

  const { isPending: isAddingEvent, mutateAsync: addEvent } = useMutation({
    mutationFn: async ({ formData, abortControllerRef }) => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      return await addEventAPI(formData, signal); // mutationFn: addEventAPI,
    },
    onSuccess: () => {
      toast.success("événement ajouté", {
        description: "L'événement a bien été ajouté.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      refreshJwtExpiration();
      console.error(error);
      if (error.message === "signal is aborted without reason") {
        toast.error("Annulation de l'ajout", {
          description: "L'ajout de l'événement a été annulé.",
        });
      } else {
        toast.error("Erreur lors de l'ajout", {
          description: `${error.message}, 
      Erreur lors de l'ajout de l'événement.`,
        });
      }
    },
  });
  return { isAddingEvent, addEvent };
}
