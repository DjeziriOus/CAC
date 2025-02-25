import { deleteAccountAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  const { isPending: isDeletingAccount, mutate: deleteAccount } = useMutation({
    mutationFn: (id) => deleteAccountAPI(id), // mutationFn: DeleteAccountAPI,
    onSuccess: () => {
      toast.success("Compte supprimé", {
        description: "Le compte a bien été supprimé.",
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression", {
        description: `${error.message}, 
      Erreur lors de la suppression du compte.`,
      });
    },
  });
  return { isDeletingAccount, deleteAccount };
}
