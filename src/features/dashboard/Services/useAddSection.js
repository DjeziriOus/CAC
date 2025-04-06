import { addSectionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useAddSection() {
  const queryClient = useQueryClient();
  const { isPending: isAddingSection, mutateAsync: addSection } = useMutation({
    mutationFn: async (Section) => {
      const { abortControllerRef } = Section;
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      return await addSectionAPI(Section, signal, "service");
    }, // mutationFn: addSectionAPI,
    onSuccess: () => {
      toast.success("Section ajoutée", {
        description: "La section a bien été ajoutée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["service"],
      });
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      queryClient.refetchQueries(["service"]);
      refreshJwtExpiration();
    },
    onError: (error) => {
      refreshJwtExpiration();
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout de la section.`,
      });
    },
  });
  return { isAddingSection, addSection };
}
