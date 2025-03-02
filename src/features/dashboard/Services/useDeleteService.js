import { deleteService as deleteServiceAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteService() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingService, mutate: deleteService } = useMutation({
    mutationFn: (id) => deleteServiceAPI(id), // mutationFn: DeleteServiceAPI,
    onSuccess: () => {
      toast.success("Service supprimé", {
        description: "le service a bien été supprimé.",
      });
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message}, 
      Erreur lors de la suppression du Service.`,
      });
    },
  });
  return { isDeletingService, deleteService };
}
