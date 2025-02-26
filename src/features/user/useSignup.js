import { postSignupUser } from "@/services/apiQuestions";
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
    onSuccess: (user) => {
      toast.success(
        //TODO: forgot password
        "Account successfully created!",
      );
      localStorage.setItem("token", user.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      const errorMessage = error?.message
        ? String(error.message)
        : "An unknown error occurred";
      toast.error("Echec de l'inscription", {
        description: errorMessage,
      });

      mailInUse = error.message.includes("Mail déja utilisé.");
      console.log(mailInUse);
    },
  });

  return { signup, isSigningUp, isError, error, isSuccess, mailInUse };
}
