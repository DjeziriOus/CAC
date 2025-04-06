import { refreshJwtExpiration } from "@/lib/utils";
import { postSignupUser } from "@/services/apiQuestions";
import { EXPIRATION_TIME } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSignup() {
  const queryClient = useQueryClient();
  let mailInUse = false;
  const {
    mutate: signup,
    isPending: isSigningUp,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (credentials) => postSignupUser(credentials),
    onSuccess: (data) => {
      if (!data || !data?.token) return;
      const { token } = data;
      const expirationTime = Date.now() + EXPIRATION_TIME;
      localStorage.setItem(
        "jwt",
        JSON.stringify({ token: token, exp: expirationTime }),
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
      toast.success(
        //TODO: forgot password
        "Account successfully created!",
      );
      refreshJwtExpiration();
    },
    onError: (error) => {
      const errorMessage = error?.message
        ? String(error.message)
        : "An unknown error occurred";
      toast.error("Echec de l'inscription", {
        description: errorMessage,
      });

      mailInUse = error.message.includes("Mail déja utilisé.");
      refreshJwtExpiration();
    },
  });

  return { signup, isSigningUp, isError, error, isSuccess, mailInUse };
}
