import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { API_URL } from "@/utils/constants";
import { AlertCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
const SectionEditForm = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || "");
  const [paragraph, setParagraph] = useState(section.paragraph || "");
  const [images, setImages] = useState(section.images || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleAddImage = (newImage) => {
    console.log();
    if (newImage instanceof File) {
      setNewImageFiles((prev) => [...prev, newImage]);
      // Create a temporary URL for preview
      setImages((prev) => [...prev, { imgUrl: URL.createObjectURL(newImage) }]);
    } else {
      setNewImageFiles((prev) => [...prev, newImage]);
      setImages((prev) => [...prev, { imgUrl: newImage }]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we're removing a new image, also remove it from newImageFiles
    if (indexToRemove >= section.images.length) {
      const newImageIndex = indexToRemove - section.images.length;
      setNewImageFiles((prev) =>
        prev.filter((_, index) => index !== newImageIndex),
      );
    }
  };

  const handleSave = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Titre de la section est requis";
    if (!paragraph.trim())
      errors.paragraph = "Contenu de la section est requis";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    onSave(
      {
        ...section,
        title,
        paragraph,
        images,
      },
      newImageFiles,
    );
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.imgUrl)
          if (image.imgUrl.startsWith("blob:")) {
            URL.revokeObjectURL(image.imgUrl);
          }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4 rounded-lg border border-primary bg-card p-6">
      <h3 className="text-lg font-medium">Modifier la Section</h3>

      <div className="space-y-2">
        <Label
          htmlFor="section-title"
          className={cn(errors.title && "text-destructive")}
        >
          Titre de la Section *
        </Label>
        <Input
          id="section-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              const newErrors = { ...errors };
              delete newErrors.title;
              setErrors(newErrors);
            }
          }}
          placeholder="Définissez le titre de la section"
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.title}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="section-paragraph"
          className={cn(errors.paragraph && "text-destructive")}
        >
          Contenu de la Section *
        </Label>
        <Textarea
          id="section-paragraph"
          value={paragraph}
          onChange={(e) => {
            setParagraph(e.target.value);
            if (errors.paragraph) {
              const newErrors = { ...errors };
              delete newErrors.paragraph;
              setErrors(newErrors);
            }
          }}
          placeholder="Définissez le contenu de la section"
          rows={4}
          className={cn(errors.paragraph && "border-destructive")}
        />
        {errors.paragraph && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.paragraph}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Section Images</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="group relative aspect-video">
              <img
                // src={`${API_URL}${image.imgUrl}`}
                //TODO:
                src={
                  image.imgUrl
                    ? image.imgUrl.startsWith("data:image/")
                      ? image.imgUrl
                      : `${API_URL}${image.imgUrl}`
                    : image
                }
                alt={`Section image ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="aspect-video">
            <ImageUpload
              inputId={`section-image-upload-${images.length}`}
              currentImage={null}
              onImageSelect={handleAddImage}
              onImageRemove={() => {}}
              height="h-full"
              className="h-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>Sauvegarder</Button>
      </div>
    </div>
  );
};

export default SectionEditForm;
