import { updateResponseAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  const { isPending: isUpdatingReponse, mutate: updateResponse } = useMutation({
    mutationFn: ({ id, response }) => updateResponseAPI(id, response), // mutationFn: updateResponseAPI,
    onSuccess: () => {
      toast.success("Réponse modifiée", {
        description: "La réponse a bien été modifiée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification", {
        description: `${error.message} -- 
      Erreur lors de la modification de la réponse.`,
      });
    },
  });
  return { isUpdatingReponse, updateResponse };
}
