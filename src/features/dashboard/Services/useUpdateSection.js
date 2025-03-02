import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection as updateSectionAPI } from "@/services/apiQuestions";
import { toast } from "sonner";

export function useUpdateSection() {
  const queryClient = useQueryClient();

  const {
    mutate: updateSection,
    isPending: isUpdating,
    error,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: ({ originalSection, updatedSection, newImageFiles }) => {
      return updateSectionAPI(
        originalSection,
        updatedSection,
        newImageFiles,
        "service",
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch the event query to get the updated data
      // queryClient.invalidateQueries({ queryKey: ["event", data.eventId] });
      toast.success("Section modifiée", {
        description: "La section a bien été modifiée.",
      });
    },
  });

  return {
    updateSection,
    isUpdating,
    error,
  };
}
