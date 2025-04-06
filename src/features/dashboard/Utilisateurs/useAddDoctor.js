import { refreshJwtExpiration } from "@/lib/utils";
import { addDoctorAPI } from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddDoctor() {
  const queryClient = useQueryClient();

  const { isPending: isAddingDoctor, mutate: addDoctor } = useMutation({
    mutationFn: (doctor) => addDoctorAPI(doctor), // mutationFn: addDoctorAPI,
    onSuccess: () => {
      toast.success("Docteur ajouté", {
        description: "Le docteur a bien été ajouté.",
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      refreshJwtExpiration();
    },
    onError: (error) => {
      refreshJwtExpiration();
      toast.error("Erreur lors de l'ajout", {
        description: `${error.message}, 
      Erreur lors de l'ajout du médecin, email déjà utilisé.`,
      });
    },
  });
  return { isAddingDoctor, addDoctor };
}
