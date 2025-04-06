import { answerQuestionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  const { isPending: isAnsweringQuestion, mutateAsync: answerQuestion } =
    useMutation({
      mutationFn: async ({ id, response }) => {
        return await answerQuestionAPI(id, response);
      }, // mutationFn: updateResponseAPI,
      onSuccess: () => {
        toast.success("Réponse ajoutée", {
          description: "La réponse a bien été ajoutée.",
        });
        queryClient.invalidateQueries({
          queryKey: ["questions"],
        });
        refreshJwtExpiration();
      },
      onError: (error) => {
        toast.error("Erreur lors de l'ajout de la réponse", {
          description: `${error.message}`,
        });
        refreshJwtExpiration();
      },
    });
  return { isAnsweringQuestion, answerQuestion };
}
