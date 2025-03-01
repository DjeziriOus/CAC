import {
  updateSectionAPI,
  updateSectionImagesAPI,
} from "@/services/apiQuestions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function useUpdateSection() {
  const queryClient = useQueryClient();
  const { eventId } = useParams();
  const { isPending: isUpdatingSection, mutate: updateSection } = useMutation({
    mutationFn: ({ title, id, images, paragraph }) => {
      return updateSectionAPI({ eventId, title, id, paragraph }).then(
        (textResponse) => {
          // Check if images array exists, is not empty, and contains at least one new (base64) image.
          if (
            images &&
            images.length > 0 &&
            images.some(
              (imgObj) =>
                imgObj.imgUrl && imgObj.imgUrl.startsWith("data:image/"),
            )
          ) {
            return updateSectionImagesAPI({
              eventId,
              sectionId: id,
              images,
            }).then((imagesResponse) => ({
              textResponse,
              imagesResponse,
            }));
          }
          return { textResponse, imagesResponse: null };
        },
      );
    },
    // mutationFn: updateEventAPI,
    onSuccess: () => {
      toast.success("Section modifiée", {
        description: "La section a bien été modifiée.",
      });
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", eventId],
      });
    },
    onError: (error) => {
      toast.error("Erreur lors de la modification", {
        description: `${error.message} -- 
      Erreur lors de la modification de la section.`,
      });
    },
  });
  return { isUpdatingSection, updateSection };
}
