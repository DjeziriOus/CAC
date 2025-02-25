import { deleteResponseAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteAnswer() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingAnswer, mutate: deleteAnswer } = useMutation({
    mutationFn: (id) => deleteResponseAPI(id), // mutationFn: DeleteAnswerAPI,
    onSuccess: () => {
      toast.success("Réponse supprimée", {
        description: "La réponse a bien été supprimé.",
      });
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message} -- 
      Erreur lors de la suppression de la réponse.`,
      });
    },
  });
  return { isDeletingAnswer, deleteAnswer };
}
