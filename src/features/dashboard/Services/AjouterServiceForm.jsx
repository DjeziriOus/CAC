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
import { useBlocker, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SectionItem from "@/features/dashboard/Evenements/SectionItem";
import SectionEditForm from "@/features/dashboard/Evenements/SectionEditForm";
import { Spinner } from "@/components/ui/Spinner";
// Validation helper
const validateForm = (formData, editingSectionId, isAddingSectionOpen) => {
  console.log(formData);
  const errors = {};

  if (!formData.nom.trim()) {
    errors.nom = "le Nom du service est requis";
  }

  if (!formData.description.trim()) {
    errors.description = "la Description du service est requise";
  }

  if (!formData.coverImage) {
    errors.coverImage = "l'image de couverture est requise";
  }

  if (editingSectionId !== null) {
    errors.sections =
      "Une section n'est pas encore validée, Veuilliez valider (ajouter) la section que vous êtes entrain de modifier";
  }
  if (isAddingSectionOpen) {
    errors.sections =
      "Une section n'est pas encore validée, Veuilliez valider (ajouter) la section que vous êtes entrain d'introduire";
  }

  if (!formData.sections.length) {
    errors.sections = "Au moins une section de description est requise";
  } else {
    const sectionErrors = formData.sections.map((section) => {
      const sectionError = {};
      if (!section.title.trim())
        sectionError.title = "Titre de la section est requis";
      if (!section.paragraph.trim())
        sectionError.paragraph = "Contenu de la section est requis";
      // if (!section.images?.length)
      //   sectionError.images = "Au moins une image est requise";
      return Object.keys(sectionError).length ? sectionError : null;
    });

    if (sectionErrors.some((error) => error !== null)) {
      errors.sections = sectionErrors;
    }
  }

  return errors;
};

export default function AjouterServiceForm() {
  const abortControllerRef = useRef(null);
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

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  function usePrompt(message, when = true) {
    const blocker = useBlocker(when);

    useEffect(() => {
      if (blocker.state === "blocked") {
        // Show a native confirmation dialog (you can customize this)
        const answer = window.confirm(message);
        if (answer) {
          console.log("proceed");
          cancelUpload();
          blocker.proceed();
        } else {
          blocker.reset();
        }
      }
    }, [blocker, message]);
  }
  usePrompt(
    "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?",
    isDirty,
  );

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

  // const removeSection = (id) => {
  //   setSections((prev) => prev.filter((section) => section.id !== id));
  // };

  const handleCancel = () => {
    if (isDirty) {
      setShowAlert(true);
      setIsLeaving(true);
    } else {
      navigate("/dashboard/services");
    }
  };
  const handlePublish = async () => {
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

    const validationErrors = validateForm(
      formData,
      editingSectionId,
      isAddingSectionOpen,
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      await addService({ formData, abortControllerRef });
      setIsDirty(false);
      // Either add a small delay before navigation
      setTimeout(() => navigate("/dashboard/services"), 0);
    } catch (error) {
      setIsDirty(true);
      if (error.message === "signal is aborted without reason") return;
      toast.error("Échec de l'envoi du formulaire. Veuillez réessayer.", {
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

  const handleSaveSection = (updatedSection) => {
    try {
      const originalSection = sections.find((s) => s.id === updatedSection.id);

      if (!originalSection) return;
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
          Fermer et Quitter
        </Button>
        <Button onClick={handlePublish} disabled={isAddingService}>
          {isAddingService ? (
            <>
              <Spinner className="flex text-white"></Spinner>
              Publication en cours...
            </>
          ) : (
            "Publier le Service"
          )}
        </Button>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <div className="space-y-2" data-error={!!errors.nom}>
          <Label
            htmlFor="nom"
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.nom && "text-destructive")
            }
          >
            Titre du Service*
          </Label>
          <Input
            id="nom"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (errors.nom) {
                const newErrors = { ...errors };
                delete newErrors.nom;
                setErrors(newErrors);
              }
            }}
            placeholder="Introduisez le nom du service"
            className={cn(errors.nom && "border-destructive")}
          />
          <ErrorMessage error={errors.nom} />
        </div>

        <div className="space-y-2" data-error={!!errors.description}>
          <Label
            htmlFor="description"
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.description && "text-destructive")
            }
          >
            Description du Service *
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
            placeholder="Introduisez la description du service"
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
            Image de couverture *
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
            Sections de la description du Service*
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
                  section={section} // the currrent section as it is rn
                  onEdit={handleUpdateSection} // opens edit form for this section
                  onDelete={handleDeleteSection} // starts deletion (opens a confirmation dialog...)
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
            <AlertDialogTitle>Quitter la Page</AlertDialogTitle>
            <AlertDialogDescription>
              Etes-vous sur de vouloir quitter la page sans enregistrer les
              modifications? Toutes les données non enregistrées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowAlert(false);
                setIsLeaving(false);
              }}
            >
              Rester sur la Page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsDirty(false);
                navigate("/dashboard/services");
              }}
            >
              Quitter la Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
