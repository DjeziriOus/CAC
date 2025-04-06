import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSection as updateSectionAPI } from "@/services/apiQuestions";
import { toast } from "sonner";
import { refreshJwtExpiration } from "@/lib/utils";

export function useUpdateSection() {
  // Use the global QueryClient provided via QueryClientProvider
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateSection,
    isPending: isEditingSection,
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
        "service",
        signal,
      );
    },
    onSuccess: (data) => {
      // Invalidate and refetch the query for the updated service
      queryClient.cancelQueries({ queryKey: ["service", data.serviceId] });
      queryClient.invalidateQueries({ queryKey: ["service", data.serviceId] });
      // queryClient.refetchQueries({
      //   queryKey: ["service", data.serviceId],
      //   refetchType: "active",
      // });

      toast.success("Section modifiée", {
        description: "La section a été modifiée avec succès.",
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
    isEditingSection,
    error,
  };
}
