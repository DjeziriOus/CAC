import { refreshJwtExpiration } from "@/lib/utils";
import { updateService as updateServiceAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function useUpdateService() {
  const queryClient = useQueryClient();
  // const { serviceId } = useParams();
  const { isPending: isUpdatingService, mutateAsync: updateService } =
    useMutation({
      mutationFn: async (formdata) => {
        const { abortControllerRef } = formdata;
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;
        await updateServiceAPI(formdata, signal);
      }, // mutationFn: updateServiceAPI,
      onSuccess: () => {
        toast.success("Service modifié", {
          description: "Le service a bien été modifié.",
        });
        queryClient.invalidateQueries({
          queryKey: ["services"],
        });
        queryClient.invalidateQueries({
          queryKey: ["service"],
        });
        refreshJwtExpiration();
      },
      onError: (error) => {
        toast.error("Erreur lors de la modification", {
          description: `${error.message} -- 
          Erreur lors de la modification du service.`,
        });
        refreshJwtExpiration();
      },
    });
  return { isUpdatingService, updateService };
}
