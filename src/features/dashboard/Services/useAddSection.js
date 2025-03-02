import { addSectionAPI as addSectionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function useAddSection() {
  const queryClient = useQueryClient();
  const { isPending: isAddingSection, mutate: addSection } = useMutation({
    mutationFn: (Section) => addSectionAPI(Section), // mutationFn: addSectionAPI,
    onSuccess: () => {
      toast.success("Section ajoutéé", {
        description: "La section a bien été ajoutée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.refetchQueries(["event"]);
    },
    onError: (error) => {
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout de l'événement.`,
      });
    },
  });
  return { isAddingSection, addSection };
}
