import { postLoginUser } from "@/services/apiQuestions";
import { EXPIRATION_TIME } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState(null);

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await postLoginUser(credentials);
        console.log("response", response);
        return response;
      } catch (error) {
        // Only handle auth errors here - prevent them from triggering the global error boundary
        console.log(error.isAuthError);
        // if (error.isAuthError) {
        setAuthError(error.message);
        // toast.error("Échec de la connexioxxn", {
        //   description: error.message,
        // });
        return null; // Return null to prevent error propagation
        // }
        // Let other errors propagate
        // throw error;
      }
    },
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
      setAuthError(null); // Clear any previous errors
    },
    onError: (error) => {
      // if (error.message !== "Route non trouvée (ERREUR 404)") {
      toast.error("Erreur lors de la connexion", {
        description: `${error.message}`,
      });
      // }
    },
  });

  const loginUser = (credentials) => {
    setAuthError(null);
    mutation.mutate(credentials);
  };

  return {
    isConnecting: mutation.isPending,
    error: authError || mutation.error, // String error message, not an object
    hasAuthError: !!authError,
    loginUser,
  };
}
