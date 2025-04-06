import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection as updateSectionAPI } from "@/services/apiQuestions";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";
export function useUpdateSection() {
  // Use the global QueryClient provided via QueryClientProvider
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateSection,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({
      originalSection,
      updatedSection,
      newImageFiles,
      abortControllerRef,
    }) => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      return await updateSectionAPI(
        originalSection,
        updatedSection,
        newImageFiles,
        "event",
        signal,
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch the event query to get the updated data
      queryClient.cancelQueries({ queryKey: ["event", data.eventId] });
      queryClient.invalidateQueries({ queryKey: ["event", data.eventId] });
      toast.success("Section modifiée", {
        description: "La section a bien été modifiée.",
      });
      refreshJwtExpiration();
    },
    onError: (error) => {
      refreshJwtExpiration();
      toast.error("Erreur lors de la modification", {
        description: `${error.message} -- Erreur lors de la modification de la section.`,
      });
    },
  });

  return {
    updateSection,
    isUpdating,
    error,
  };
}
