import { deleteSectionAPI as deleteSectionAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";
export function useDeleteSection() {
  const queryClient = useQueryClient();
  const { eventId } = useParams();
  const { isPending: isDeletingSection, mutate: deleteSection } = useMutation({
    mutationFn: (sectionId) => {
      console.log(sectionId, eventId);
      return deleteSectionAPI({ id: sectionId, eventId: eventId });
    }, // mutationFn: DeleteSectionAPI,
    onSuccess: () => {
      toast.success("Section supprimée", {
        description: "La Section a bien été supprimée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["event"],
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message} -- 
      Erreur lors de la suppression de la Section.`,
      });
      refreshJwtExpiration();
    },
  });
  return { isDeletingSection, deleteSection };
}
