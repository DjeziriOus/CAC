import { addQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";
export function useAddQuestion() {
  const queryClient = useQueryClient();

  const { isPending: isAddingQuestion, mutate: addQuestion } = useMutation({
    mutationFn: async (question) => {
      return await addQuestionAPI(question);
    }, // mutationFn: addQuestionAPI,
    onSuccess: () => {
      toast.success("Question ajoutée", {
        description: "La question a bien été ajoutée.",
      });
      queryClient.refetchQueries({
        queryKey: ["myQuestions"],
      });
      refreshJwtExpiration();
      return queryClient.refetchQueries({
        queryKey: ["questions"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout de la question.`,
      });
      refreshJwtExpiration();
    },
  });
  return { isAddingQuestion, addQuestion };
}
