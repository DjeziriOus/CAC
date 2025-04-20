import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SectionMediaManager from "./section-media-manager";

const SectionEditForm = ({
  section, //backend's pov of the section
  onSave,
  onCancel,
  errors: openMenuError,
  setErrors: setOpenMenuError,
  // TODO:
  // isDeletingSection,
  // setIsDirtySection,
  // isDirtySection,
}) => {
  const [title, setTitle] = useState(section.title || "");
  const [paragraph, setParagraph] = useState(section.paragraph || "");

  // Convert legacy images array to media format if needed
  const [media, setMedia] = useState(() => {
    if (section.media) return section.media;

    // Convert backend's images format to new media format
    if (section.images && section.images.length > 0) {
      return section.images;
    }

    return [];
  });

  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   const hasDiffrentContent =
  //     title !== section.title ||
  //     paragraph !== section.paragraph ||
  //     media.length !== (section.images?.length || 0) ||
  //     media.some((item, idx) => {
  //       const sectionImage = section.images?.[idx];
  //       return !sectionImage || item?.url !== sectionImage.url;
  //     });
  // setIsDirtySection(hasDiffrentContent);
  // }, [
  // title,
  // paragraph,
  // media,
  // section,
  // , setIsDirtySection
  // isDirtySection,
  // ]);

  const handleSave = async () => {
    const errors = {};
    if (!title.trim()) errors.title = "Titre de la section est requis";
    if (!paragraph.trim())
      errors.paragraph = "Contenu de la section est requis";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    if (openMenuError.sections) {
      const newErrors = { ...openMenuError };
      delete newErrors.sections;
      setOpenMenuError(newErrors);
    }

    // Extract the actual File objects for upload
    // const filesToUpload = media
    //   .filter((item) => item.file)
    //   .map((item) => item.file);
    const filesToUpload = newMediaFiles.map((item) => item.data);

    // Convert media back to images format if needed for API compatibility
    const updatedSection = {
      ...section,
      title,
      paragraph,
      media,
      // Keep images for backward compatibility
      images: media.map((img) => {
        return { url: img.url };
      }),
    };
    await onSave(updatedSection, filesToUpload);
    // setIsDirtySection(false);
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.url && item.url.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [media]);

  const handleAddMedia = (newFiles) => {
    setMedia((prevMedia) => [...prevMedia, ...newFiles]);
    setNewMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveMedia = (indexToRemove) => {
    setMedia((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we're removing a new image, also remove it from newMediaFiles
    if (indexToRemove >= section.images.length) {
      const newMediaIndex = indexToRemove - section.images.length;
      setNewMediaFiles((prev) =>
        prev.filter((_, index) => index !== newMediaIndex),
      );
    }
  };

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
          placeholder="Définissez le titre de la section"
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
          placeholder="Définissez le contenu de la section"
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
        <Label>Fichiers de la Section</Label>
        <SectionMediaManager
          media={media}
          onMediaAdd={handleAddMedia}
          onMediaRemove={handleRemoveMedia}
        />
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            await handleSave();
          }}
          // disabled={isEditingSection || isDeletingSection || !isDirtySection}
        >
          {/* {isEditingSection || isDeletingSection ? (
            <>
              <Spinner className="flex text-white"></Spinner>
              Sauvegarde en cours...
            </>
          ) : (
            "Sauvegarder"
          )} */}
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};
export default SectionEditForm;
