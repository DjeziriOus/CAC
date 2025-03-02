"use client";

import ImageUpload from "@/features/dashboard/Evenements/ImageUpload";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Plus, AlertCircle, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAddService } from "./useAddService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SectionItem from "@/features/dashboard/Evenements/SectionItem";
import SectionEditForm from "@/features/dashboard/Evenements/SectionEditForm";

// Validation helper
const validateForm = (formData) => {
  console.log(formData);
  const errors = {};

  if (!formData.nom.trim()) {
    errors.title = "Event title is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Event description is required";
  }

  if (!formData.coverImage) {
    errors.coverImage = "Cover image is required";
  }

  if (!formData.sections.length) {
    errors.sections = "At least one section is required";
  } else {
    const sectionErrors = formData.sections.map((section) => {
      const sectionError = {};
      if (!section.title.trim())
        sectionError.title = "Section title is required";
      if (!section.paragraph.trim())
        sectionError.paragraph = "Section contentsss is required";
      if (!section.images?.length)
        sectionError.images = "At least one section image is required";
      return Object.keys(sectionError).length ? sectionError : null;
    });

    if (sectionErrors.some((error) => error !== null)) {
      errors.sections = sectionErrors;
    }
  }

  return errors;
};

export default function AjouterServiceForm() {
  const { addService, isAddingService } = useAddService();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    paragraph: "",
    images: [],
  });

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [errors]);

  // Track form changes
  useEffect(() => {
    const hasContent =
      nom !== "" ||
      description !== "" ||
      coverImage !== null ||
      sections.length > 0 ||
      newSection.title !== "" ||
      newSection.paragraph !== "" ||
      newSection.images.length > 0;

    setIsDirty(hasContent);
  }, [nom, description, coverImage, sections, newSection]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const addSection = () => {
    if (newSection.title.trim() === "") return;

    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...newSection,
      },
    ]);

    setNewSection({
      title: "",
      paragraph: "",
      images: [],
    });

    setIsAddingSectionOpen(false);
    // Clear section-related errors when adding a new valid section
    const newErrors = { ...errors };
    delete newErrors.sections;
    setErrors(newErrors);
  };

  const removeSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowAlert(true);
      setIsLeaving(true);
    } else {
      navigate("/dashboard/services");
    }
  };

  const handlePublish = () => {
    // Validate form
    const formData = {
      nom,
      description,
      coverImage,
      sections: sections.map((section) => ({
        ...section,
        paragraph: section.paragraph, // Map content to paragraph for API consistency
      })),
    };

    const validationErrors = validateForm(formData);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsDirty(false);
      setErrors({});

      addService(formData);
      navigate("/dashboard/services");
    } catch (error) {
      setIsDirty(true);
      toast.error("Failed to submit the form. Please try again.", {
        description: error.message,
      });
    }
  };

  // Helper component for error message
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <div className="mt-1 flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  };

  const handleDeleteSection = (sectionId) => {
    try {
      // deleteSection(sectionId);
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
    } catch (error) {
      console.error("Failed to delete section:", error);
      // Handle error (could add a toast notification here)
    }
  };

  const handleUpdateSection = (section) => {
    setEditingSectionId(section.id);
  };

  const handleSaveSection = (updatedSection, newImageFiles = []) => {
    try {
      const originalSection = sections.find((s) => s.id === updatedSection.id);

      if (!originalSection) return;
      // updateSection({
      //   originalSection,
      //   updatedSection: {
      //     ...updatedSection,
      //     eventId: initialEvent.id,
      //   },
      //   newImageFiles,
      // });

      setSections((prev) =>
        prev.map((section) =>
          section.id === updatedSection.id ? updatedSection : section,
        ),
      );
      setEditingSectionId(null);
    } catch (error) {
      console.error("Failed to update section:", error);
      // Handle error (could add a toast notification here)
    }
  };

  return (
    <div className="space-y-8" ref={formRef}>
      {errors.submit && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive">
          {errors.submit}
        </div>
      )}

      <div className="mb-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handlePublish} disabled={isAddingService}>
          {isAddingService ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Publishing...
            </>
          ) : (
            "Publish Event"
          )}
        </Button>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <div className="space-y-2" data-error={!!errors.title}>
          <Label
            htmlFor="title"
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.title && "text-destructive")
            }
          >
            Event Title *
          </Label>
          <Input
            id="title"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (errors.title) {
                const newErrors = { ...errors };
                delete newErrors.title;
                setErrors(newErrors);
              }
            }}
            placeholder="Enter event title"
            className={cn(errors.title && "border-destructive")}
          />
          <ErrorMessage error={errors.title} />
        </div>

        <div className="space-y-2" data-error={!!errors.description}>
          <Label
            htmlFor="description"
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.description && "text-destructive")
            }
          >
            Event Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) {
                const newErrors = { ...errors };
                delete newErrors.description;
                setErrors(newErrors);
              }
            }}
            placeholder="Enter event description"
            rows={4}
            className={cn(errors.description && "border-destructive")}
          />
          <ErrorMessage error={errors.description} />
        </div>

        <div className="space-y-2" data-error={!!errors.coverImage}>
          <Label
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.coverImage && "text-destructive")
            }
          >
            Cover Image *
          </Label>
          <ImageUpload
            inputId="cover-image-upload"
            currentImage={coverImage}
            onImageSelect={(image) => {
              setCoverImage(image);
              if (errors.coverImage) {
                const newErrors = { ...errors };
                delete newErrors.coverImage;
                setErrors(newErrors);
              }
            }}
            onImageRemove={() => setCoverImage(null)}
            loading={isUploading}
          />
          <ErrorMessage error={errors.coverImage} />
        </div>
      </div>

      <div
        className="space-y-6 rounded-lg bg-card p-6 shadow-sm"
        data-error={!!errors.sections}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-center text-2xl font-semibold text-primary">
            Event Sections *
          </h2>
          {typeof errors.sections === "string" && (
            <ErrorMessage error={errors.sections} />
          )}
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id}>
              {editingSectionId === section.id ? (
                <SectionEditForm
                  section={section}
                  onSave={handleSaveSection}
                  onCancel={() => setEditingSectionId(null)}
                />
              ) : (
                <SectionItem
                  section={section}
                  onEdit={handleUpdateSection}
                  onDelete={handleDeleteSection}
                />
              )}
            </div>
          ))}
        </div>

        {isAddingSectionOpen ? (
          <div className="space-y-4 rounded-lg border border-primary bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-primary">
              Créer Une Nouvelle Section
            </h3>

            <div className="space-y-2">
              <Label htmlFor="section-title">Titre de Section *</Label>
              <Input
                id="section-title"
                value={newSection.title}
                onChange={(e) =>
                  setNewSection((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Entrez le titre de la section"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section-paragraph">Contenu de Section *</Label>
              <Textarea
                id="section-paragraph"
                value={newSection.paragraph}
                onChange={(e) =>
                  setNewSection((prev) => ({
                    ...prev,
                    paragraph: e.target.value,
                  }))
                }
                placeholder="Décrivez le contenu de la section"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Images de la Section</Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {newSection.images.map((image, index) => (
                  <div key={index} className="group relative aspect-video">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : // : `${API_URL}${image.imgUrl}`
                            `${image.imgUrl}`
                      }
                      alt={`New section image ${index + 1}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setNewSection((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="aspect-video">
                  <ImageUpload
                    inputId={`new-section-image-upload-${newSection.images.length}`}
                    currentImage={null}
                    onImageSelect={(image) =>
                      setNewSection((prev) => ({
                        ...prev,
                        images: [...prev.images, image],
                      }))
                    }
                    onImageRemove={() => {}}
                    height="h-full"
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingSectionOpen(false);
                  setNewSection({ title: "", paragraph: "", images: [] });
                }}
              >
                Annuler
              </Button>
              <Button onClick={addSection}>Add Section</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full border-dashed py-8"
            onClick={() => setIsAddingSectionOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une Nouvelle Section
          </Button>
        )}
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? All your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowAlert(false);
                setIsLeaving(false);
              }}
            >
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsDirty(false);
                navigate("/dashboard/services");
              }}
            >
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
