import { updateResponseAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  const { isPending: isUpdatingReponse, mutateAsync: updateResponse } =
    useMutation({
      mutationFn: async ({ id, response }) =>
        await updateResponseAPI(id, response), // mutationFn: updateResponseAPI,
      onSuccess: () => {
        toast.success("Réponse modifiée", {
          description: "La réponse a bien été modifiée.",
        });
        queryClient.invalidateQueries({
          queryKey: ["questions"],
        });
        refreshJwtExpiration();
      },
      onError: (error) => {
        refreshJwtExpiration();
        toast.error("Erreur lors de la modification", {
          description: `${error.message} -- 
      Erreur lors de la modification de la réponse.`,
        });
      },
    });
  return { isUpdatingReponse, updateResponse };
}
