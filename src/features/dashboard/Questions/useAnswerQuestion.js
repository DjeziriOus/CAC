import { answerQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  const { isPending: isAnsweringQuestion, mutate: answerQuestion } =
    useMutation({
      mutationFn: ({ id, response }) => answerQuestionAPI(id, response), // mutationFn: updateResponseAPI,
      onSuccess: () => {
        toast.success("Réponse ajoutée", {
          description: "La réponse a bien été ajoutée.",
        });
        queryClient.invalidateQueries({
          queryKey: ["questions"],
        });
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la réponse", {
          description: `${error.message}`,
        });
      },
    });
  return { isAnsweringQuestion, answerQuestion };
}
