import { postLoginUser } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState(null);

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        return await postLoginUser(credentials);
      } catch (error) {
        // Only handle auth errors here - prevent them from triggering the global error boundary
        console.log(error.isAuthError);
        if (error.isAuthError) {
          setAuthError(error.message);
          // toast.error("Échec de la connexioxxn", {
          //   description: error.message,
          // });
          return null; // Return null to prevent error propagation
        }
        // Let other errors propagate
        throw error;
      }
    },
    onSuccess: (data) => {
      // Skip null returns from auth errors
      if (!data) return;

      if (!data?.token) return;
      const { token } = data;
      localStorage.setItem("token", token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setAuthError(null); // Clear any previous errors
    },
    onError: (error) => {
      console.log(error.message);

      if (error.message !== "Route non trouvée (ERREUR 404)") {
        toast.error("Erreur lors de la connexion", {
          description: `${error.message}`,
        });
      }
    },
  });

  const loginUser = (credentials) => {
    setAuthError(null);
    mutation.mutate(credentials);
  };

  return {
    isConnecting: mutation.isLoading,
    error: authError || mutation.error, // String error message, not an object
    hasAuthError: !!authError,
    loginUser,
  };
}
