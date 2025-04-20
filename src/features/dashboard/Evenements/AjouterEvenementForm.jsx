"use client";

import ImageUpload from "@/features/dashboard/Evenements/ImageUpload";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, AlertCircle, Trash } from "lucide-react";
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
import { useAddEvent } from "./useAddEvent";
import { useBlocker, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SectionItem from "./SectionItem";
import SectionEditForm from "./SectionEditForm";
import { Spinner } from "@/components/ui/Spinner";
import SectionMediaManager from "../Services/section-media-manager";

// Validation helper
const validateForm = (formData, editingSectionId, isAddingSectionOpen) => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Veuilliez donner un titre à l'événement";
  }

  if (!formData.description.trim()) {
    errors.description = "Veuilliez donner une description à l'événement";
  }

  if (!formData.location.trim()) {
    errors.location = "Veuilliez specifier au se déroulera l'événement";
  }

  if (!formData.date) {
    errors.date = "Date de l'événement est requise";
  }

  if (!formData.coverImage) {
    errors.coverImage = "Image de couverture est requise";
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
    // errors.sections = "Au moins une section est requise";
  } else {
    const sectionsErrors = formData.sections.map((section) => {
      const sectionError = {};
      if (!section.title.trim())
        sectionError.title = "Titre de la section est requis";
      if (!section.paragraph.trim())
        sectionError.paragraph = "Contenu de la section est requis";
      // if (!section.media?.length)
      //   sectionError.media = "Au moins une image est requise";
      return Object.keys(sectionError).length ? sectionError : null;
    });

    if (sectionsErrors.some((error) => error !== null)) {
      errors.sectionsErrors = sectionsErrors;
    }
  }

  return errors;
};

export default function AjouterEvenementForm() {
  const abortControllerRef = useRef(null);
  const { addEvent, isAddingEvent } = useAddEvent();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(undefined);
  const [eventType, setEventType] = useState("national");
  const [coverImage, setCoverImage] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    paragraph: "",
    media: [],
  });

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newSectionErrors, setNewSectionErrors] = useState({});

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
      title !== "" ||
      description !== "" ||
      location !== "" ||
      date !== undefined ||
      coverImage !== null ||
      sections.length > 0 ||
      newSection.title !== "" ||
      newSection.paragraph !== "" ||
      newSection.media.length > 0;

    setIsDirty(hasContent);
  }, [title, description, location, date, coverImage, sections, newSection]);

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
    const errors = {};
    if (newSection.title.trim() === "")
      errors.title = "Titre de la section est requis";
    if (newSection.paragraph.trim() === "")
      errors.paragraph = "Contenu de la section est requis";
    if (Object.keys(errors).length > 0) {
      setNewSectionErrors(errors);
      return;
    }

    if (errors.sections) {
      const newErrors = { ...errors };
      delete newErrors.sections;
      setErrors(newErrors);
    }

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
      media: [],
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
      navigate("/dashboard/evenements");
    }
  };

  const handlePublish = async () => {
    // Validate form
    const formData = {
      title,
      description,
      location,
      date,
      type: eventType,
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
      await addEvent({ formData, abortControllerRef });
      setIsDirty(false);
      setTimeout(() => navigate("/dashboard/evenements"), 0);
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

      <div className="mb-2 flex justify-between space-x-2">
        <h1 className="mb-2 text-3xl font-bold">Ajouter un événement</h1>
        <div className="flex gap-5">
          <Button variant="outline" onClick={handleCancel}>
            Fermer et Quitter
          </Button>
          <Button onClick={handlePublish} disabled={isAddingEvent}>
            {isAddingEvent ? (
              <>
                <Spinner className="flex text-white"></Spinner>
                Publication en cours...
              </>
            ) : (
              "Publier l'Événement"
            )}
          </Button>
        </div>
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
            Titre de l&apos;Événement *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) {
                const newErrors = { ...errors };
                delete newErrors.title;
                setErrors(newErrors);
              }
            }}
            placeholder="Introduisez le titre de l'événement"
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
            Description de l&apos;Événement *
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
            placeholder="Introduissez une description"
            rows={4}
            className={cn(errors.description && "border-destructive")}
          />
          <ErrorMessage error={errors.description} />
        </div>

        <div className="space-y-2" data-error={!!errors.location}>
          <Label
            htmlFor="location"
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.location && "text-destructive")
            }
          >
            Lieu de l&apos;Événement *
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location) {
                const newErrors = { ...errors };
                delete newErrors.location;
                setErrors(newErrors);
              }
            }}
            placeholder="Où se dérouleras votre événement?"
            className={cn(errors.location && "border-destructive")}
          />
          <ErrorMessage error={errors.location} />
        </div>

        <div className="flex justify-between gap-2" data-error={!!errors.date}>
          <div className="flex items-center gap-10">
            <Label
              className={
                "text-2xl font-semibold text-primary" +
                cn(errors.date && "text-destructive")
              }
            >
              Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-destructive",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Selectioner un date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (errors.date) {
                      const newErrors = { ...errors };
                      delete newErrors.date;
                      setErrors(newErrors);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ErrorMessage error={errors.date} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-10">
              <Label className="text-2xl font-semibold text-primary">
                Type d&apos;Événement
              </Label>
              <RadioGroup
                defaultValue="national"
                value={eventType}
                onValueChange={setEventType}
                className="flex gap-10 rounded-lg border bg-lgt-1 py-2 pl-3 pr-10"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="national" id="national" />
                  <Label
                    htmlFor="national"
                    className="text-lg hover:cursor-pointer"
                  >
                    National
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="international" id="international" />
                  <Label
                    htmlFor="international"
                    className="text-lg hover:cursor-pointer"
                  >
                    International
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div> </div>
        </div>

        <div className="space-y-2" data-error={!!errors.coverImage}>
          <Label
            className={
              "text-2xl font-semibold text-primary" +
              cn(errors.coverImage && "text-destructive")
            }
          >
            Image de Couverture *
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
            Sections de l&apos;Événement
          </h2>
          {errors.sections && <ErrorMessage error={errors?.sections} />}
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id}>
              {editingSectionId === section.id ? (
                <SectionEditForm
                  section={section}
                  onSave={handleSaveSection}
                  onCancel={() => {
                    setEditingSectionId(null);
                    if (errors.sections) {
                      const newErrors = { ...errors };
                      delete newErrors.sections;
                      setErrors(newErrors);
                    }
                  }}
                  errors={errors}
                  setErrors={setErrors}
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
              <Label
                htmlFor="section-title"
                className={cn(newSectionErrors?.title && "text-destructive")}
              >
                Titre de Section *
              </Label>
              <Input
                id="section-title"
                value={newSection.title}
                onChange={(e) => {
                  setNewSection((prev) => ({ ...prev, title: e.target.value }));
                  if (newSectionErrors.title) {
                    const newErrors = { ...newSectionErrors };
                    delete newErrors.title;
                    setNewSectionErrors(newErrors);
                  }
                }}
                placeholder="Entrez le titre de la section"
                className={cn(newSectionErrors?.title && "border-destructive")}
              />
              {newSectionErrors.title && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{newSectionErrors.title}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="section-paragraph"
                className={cn(newSectionErrors.paragraph && "text-destructive")}
              >
                Contenu de Section *
              </Label>
              <Textarea
                id="section-paragraph"
                value={newSection.paragraph}
                onChange={(e) => {
                  setNewSection((prev) => ({
                    ...prev,
                    paragraph: e.target.value,
                  }));
                  if (newSectionErrors.paragraph) {
                    const newErrors = { ...newSectionErrors };
                    delete newErrors.paragraph;
                    setNewSectionErrors(newErrors);
                  }
                }}
                placeholder="Décrivez le contenu de la section"
                rows={4}
                className={cn(
                  newSectionErrors?.paragraph && "border-destructive",
                )}
              />
              {newSectionErrors.paragraph && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{newSectionErrors.paragraph}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Images de la Section</Label>
              <SectionMediaManager
                media={newSection.media}
                onMediaAdd={(files) => {
                  setNewSection((prev) => ({
                    ...prev,
                    media: [...prev.media, ...files],
                  }));
                }}
                onMediaRemove={(index) => {
                  setNewSection((prev) => ({
                    ...prev,
                    media: prev.media.filter((_, i) => i !== index),
                  }));
                }}
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingSectionOpen(false);
                  setNewSection({ title: "", paragraph: "", media: [] });
                  if (errors.sections) {
                    const newErrors = { ...errors };
                    delete newErrors.sections;
                    setErrors(newErrors);
                  }
                }}
              >
                Annuler
              </Button>
              <Button onClick={addSection}>Ajouter la Section</Button>
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
                navigate("/dashboard/evenements");
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
