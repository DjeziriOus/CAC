import { addService as addServiceAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddService() {
  const queryClient = useQueryClient();

  const { isPending: isAddingService, mutate: addService } = useMutation({
    mutationFn: (Service) => addServiceAPI(Service), // mutationFn: addServiceAPI,
    onSuccess: () => {
      toast.success("Service ajouté", {
        description: "Le service a bien été ajouté.",
      });
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout du service.`,
      });
    },
  });
  return { isAddingService, addService };
}
