import { addService as addServiceAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useAddService() {
  const queryClient = useQueryClient();
  const { isPending: isAddingService, mutateAsync: addService } = useMutation({
    mutationFn: async ({ formData, abortControllerRef }) => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      return await addServiceAPI(formData, signal); // mutationFn: addServiceAPI,
    },
    onSuccess: () => {
      toast.success("Service ajouté", {
        description: "Le service a bien été ajouté.",
      });
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      refreshJwtExpiration();
      if (error.message === "signal is aborted without reason") {
        toast.error("Annulation de l'ajout", {
          description: "L'ajout du service a été annulé.",
        });
      } else {
        toast.error("Erreur lors de l'ajout", {
          description: `${error.message}, 
      Erreur lors de l'ajout du service.`,
        });
      }
    },
  });
  return { isAddingService, addService };
}
