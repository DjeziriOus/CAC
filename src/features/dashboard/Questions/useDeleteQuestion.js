import { deleteQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingQuestion, mutate: deleteQuestion } = useMutation(
    {
      mutationFn: (id) => deleteQuestionAPI(id), // mutationFn: DeleteQuestionAPI,
      onSuccess: () => {
        refreshJwtExpiration();
        toast.success("Question supprimée", {
          description: "Le question a bien été supprimé.",
        });
        queryClient.invalidateQueries({
          queryKey: ["questions"],
        });
        refreshJwtExpiration();
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression", {
          description: `${error.message} -- 
      Erreur lors de la suppression de la question.`,
        });
        refreshJwtExpiration();
      },
    },
  );
  return { isDeletingQuestion, deleteQuestion };
}
