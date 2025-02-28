import { deleteQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingQuestion, mutate: deleteQuestion } = useMutation(
    {
      mutationFn: (id) => deleteQuestionAPI(id), // mutationFn: DeleteQuestionAPI,
      onSuccess: () => {
        toast.success("Question supprimée", {
          description: "Le question a bien été supprimé.",
        });
        queryClient.invalidateQueries({
          queryKey: ["questions"],
        });
      },
      onError: (error) => {
        toast.error("Erreur lors de la suppression", {
          description: `${error.message} -- 
      Erreur lors de la suppression de la question.`,
        });
      },
    },
  );
  return { isDeletingQuestion, deleteQuestion };
}
