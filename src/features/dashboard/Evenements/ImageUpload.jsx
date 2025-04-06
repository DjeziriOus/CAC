"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Image, X, Loader2 } from "lucide-react";
import { API_URL } from "@/utils/constants";
import { toast } from "sonner";

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  currentImage,
  height = "h-64",
  inputId,
  loading = false,
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        validateAndProcessImage(file, onImageSelect);
      }
    },
    [onImageSelect],
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndProcessImage(file, onImageSelect);
      }
    },
    [onImageSelect],
  );

  return (
    <div>
      {currentImage ? (
        <div className={`relative w-full ${height} mb-4`}>
          <img
            src={
              currentImage
                ? currentImage?.startsWith("data:image")
                  ? currentImage
                  : currentImage.startsWith("http")
                    ? currentImage
                    : API_URL + currentImage
                : "placeholder.svg"
            }
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onImageRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 ${dragActive ? "border-primary" : "border-gray-300"} rounded-md border-dashed p-12 text-center transition-colors ${height} relative flex flex-col items-center justify-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {loading ? (
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          ) : (
            <>
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                <label
                  htmlFor={inputId}
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
                >
                  <span>Sélectionnez une image à uploader</span>
                  <input
                    id={inputId}
                    name={inputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleChange}
                  />
                </label>
                <p className="pl-1">
                  ou bien faites un glisser-deposer (drag-and-drop)
                </p>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-600">
                PNG, JPG, GIF jusqu&#39;à 5MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Updated validation function
function validateAndProcessImage(file, onImageSelect) {
  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    // TODO:
    alert("Please upload a valid image file (PNG, JPG, or GIF)");
    return;
  }

  // Validate file size (10MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    // TODO:
    // alert("Taille de fichier trop grande. Limite: 5MB");
    toast.error("Erreur lors de l'ajout", {
      description: "Taille de fichier trop grande. Limite: 5MB",
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    // Create a temporary image element to validate the image data
    const tempImg = document.createElement("img");
    tempImg.onload = () => {
      // Image is valid
      onImageSelect(e.target.result);
    };
    tempImg.onerror = () => {
      // TODO:
      // alert("Error processing image. Please try another file.");
      toast.error("Erreur lors de l'ajout", {
        description:
          "Erreur lors de l'ajout de l'image. Veuillez choisir une autre image.",
      });
    };
    tempImg.src = e.target.result;
  };
  reader.onerror = () => {
    // TODO:
    // alert("Erreur lors de l'ajout de l'image, Veuillez reessayer.");
    toast.error("Erreur lors de l'ajout", {
      description: "Erreur lors de l'ajout de l'image. Veuillez reessayer.",
    });
  };
  reader.readAsDataURL(file);
}
