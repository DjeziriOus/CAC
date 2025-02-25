import { postLoginUser } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();

  const {
    isPending: isConnecting,
    mutate: loginUser,
    error,
  } = useMutation({
    mutationFn: (credentials) => postLoginUser(credentials), // mutationFn: postLoginUser,
    onSuccess: ({ token }) => {
      localStorage.setItem("token", token);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la connexion", {
        description: `${error.message}, Erreur lors de la connexion. Veuillez vérifier vos identifiants.`,
      });
    },
  });
  return { isConnecting, loginUser };
}
