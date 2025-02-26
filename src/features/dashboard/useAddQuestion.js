import { addQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddQuestion() {
  const queryClient = useQueryClient();

  const { isPending: isAddingQuestion, mutate: addQuestion } = useMutation({
    mutationFn: (question) => addQuestionAPI(question), // mutationFn: addQuestionAPI,
    onSuccess: () => {
      toast.success("Question ajoutée", {
        description: "La question a bien été ajoutée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["questions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["myQuestions"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout de la question.`,
      });
    },
  });
  return { isAddingQuestion, addQuestion };
}
