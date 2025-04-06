"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBlocker, useNavigate } from "react-router-dom";
import { useDeleteSection } from "./useDeleteSection";

import { AlertCircle, CalendarIcon, Plus, Trash, Edit } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn, isEqual } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Loader from "@/components/ui/Loader";
import { API_URL } from "@/utils/constants";
import { useUpdateSection } from "./useUpdateSection";
import { useUpdateEvent } from "./useUpdateEvent";
import { useAddSection } from "./useAddSection";
import { Spinner } from "@/components/ui/Spinner";
// Define API_URL or import it from a config file

// Validation helper
const validateForm = (formData) => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Event title is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Event description is required";
  }

  if (!formData.location.trim()) {
    errors.location = "Event location is required";
  }

  if (!formData.date) {
    errors.date = "Event date is required";
  }

  if (!formData.coverImage) {
    errors.coverImage = "Cover image is required";
  }

  return errors;
};

// Section component with edit and delete functionality
const SectionItem = ({ section, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{section.title}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(section)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer la section</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette section? Cette action
                  ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    return onDelete(section.id);
                  }}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <p className="text-muted-foreground">{section.paragraph}</p>
      {section.images && section.images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.images.map((image, idx) => (
            <div key={idx} className="group relative aspect-video">
              <img
                // src={`${API_URL}${image.imgUrl}`}
                src={
                  image.imgUrl.startsWith("data:image/")
                    ? image.imgUrl
                    : `${API_URL}${image.imgUrl}`
                }
                // src={`${image.imgUrl}`}
                alt={`Section image ${idx + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Section edit form with multiple image support
const SectionEditForm = ({
  section, //backend's pov of the section
  onSave,
  onCancel,
  isEditingSection,
  isDeletingSection,
  setIsDirtySection,
  isDirtySection,
}) => {
  const [title, setTitle] = useState(section.title || "");
  const [paragraph, setParagraph] = useState(section.paragraph || "");
  const [images, setImages] = useState(section.images || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    // console.log(
    //   title,
    //   paragraph,
    //   images,
    //   section,
    //   title !== section.title,
    //   paragraph !== section.paragraph,
    // );
    const hasDiffrentContent =
      title !== section.title ||
      paragraph !== section.paragraph ||
      images.every((s, i) => s.imgUrl !== section.images[i].imgUrl);
    setIsDirtySection(hasDiffrentContent);
  }, [title, paragraph, images, section, setIsDirtySection, isDirtySection]);

  const handleAddImage = (newImage) => {
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

  const handleSave = async () => {
    const errors = {};
    if (!title.trim()) errors.title = "Section title is required";
    if (!paragraph.trim()) errors.paragraph = "Section content is required";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    await onSave(
      {
        ...section,
        title,
        paragraph,
        images,
      },
      newImageFiles,
    );

    setIsDirtySection(false);
    // window.location.reload();
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.imgUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.imgUrl);
        }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4 rounded-lg border border-primary bg-card p-6">
      <h3 className="text-lg font-medium">Edit Section</h3>

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
          Section Content *
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
                src={
                  image.imgUrl.startsWith("data:image/")
                    ? image.imgUrl
                    : `${API_URL}${image.imgUrl}`
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
        <Button
          onClick={async () => {
            await handleSave();
          }}
          disabled={isEditingSection || isDeletingSection || !isDirtySection}
        >
          {isEditingSection || isDeletingSection ? (
            <>
              <Spinner className="flex text-white"></Spinner>
              Sauvegarde en cours...
            </>
          ) : (
            "Sauvegarder"
          )}
        </Button>
      </div>
    </div>
  );
};

export default function EditEvenementForm({
  initialEvent = null,
  isLoadingEvent = false,
  errorLoadingEvent = null,
}) {
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { deleteSection, isDeletingSection } = useDeleteSection();
  const { updateEvent, isUpdatingEvent } = useUpdateEvent();
  const { addSection: mutateAddSection, isAddingSection } = useAddSection();
  const { updateSection, isEditingSection } = useUpdateSection();
  // Store original values for dirty checking
  const [originalValues, setOriginalValues] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(undefined);
  const [eventType, setEventType] = useState("national");
  const [coverImage, setCoverImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newSection, setNewSection] = useState({
    title: "",
    paragraph: "",
    images: [],
  });

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtySection, setIsDirtySection] = useState(false);
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

  // Initialize form with event data if editing
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description);
      setLocation(initialEvent.endroit);
      setDate(new Date(initialEvent.date));
      setEventType(initialEvent.type);
      setCoverImage(initialEvent.coverUrl);
      setSections(initialEvent.sections || []);

      // Store original values for dirty checking
      setOriginalValues({
        title: initialEvent.title,
        description: initialEvent.description,
        location: initialEvent.endroit,
        date: initialEvent.date,
        type: initialEvent.type,
        coverImage: initialEvent.coverUrl,
        sections: initialEvent.sections || [],
      });
    }
  }, [initialEvent]);

  // Track form changes by comparing with original values
  useEffect(() => {
    if (!originalValues) return;

    const currentValues = {
      title,
      description,
      location,
      date: date?.toISOString(),
      type: eventType,
      coverImage,
      sections,
    };

    const hasChanges = !isEqual(currentValues, originalValues);
    setIsDirty(hasChanges);
  }, [
    title,
    description,
    location,
    date,
    eventType,
    coverImage,
    sections,
    originalValues,
  ]);

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
    isDirty || isDirtySection,
  );

  // Update the addSection function in the main component to handle multiple images
  const addSection = async () => {
    if (newSection.title.trim() === "") return;

    // setSections((prev) => [
    //   ...prev,
    //   {
    //     id: crypto.randomUUID(),
    //     title: newSection.title,
    //     paragraph: newSection.paragraph,
    //     images: newSection.images.map((img) =>
    //       typeof img === "string" ? { imgUrl: img } : img,
    //     ),
    //   },
    // ]);
    await mutateAddSection({
      eventId: initialEvent?.id,
      title: newSection.title,
      paragraph: newSection.paragraph,
      images: newSection.images.map((img) =>
        typeof img === "string" ? { imgUrl: img } : img,
      ),
      abortControllerRef,
    });

    setNewSection({
      title: "",
      paragraph: "",
      images: [],
    });

    setIsAddingSectionOpen(false);
    const newErrors = { ...errors };
    delete newErrors.sections;
    setErrors(newErrors);
  };

  const handleDeleteSection = (sectionId) => {
    try {
      deleteSection(sectionId);
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
    } catch (error) {
      console.error("Failed to delete section:", error);
      // Handle error (could add a toast notification here)
    }
  };

  const handleUpdateSection = (section) => {
    setEditingSectionId(section.id);
  };

  const handleSaveSection = async (updatedSection, newImageFiles = []) => {
    try {
      const originalSection = sections.find((s) => s.id === updatedSection.id);
      if (!originalSection) return;
      await updateSection({
        originalSection,
        updatedSection: {
          ...updatedSection,
          eventId: initialEvent.id,
        },
        newImageFiles,
        abortControllerRef,
      });
      setEditingSectionId(null);
      // setSections((prev) =>
      //   prev.map((section) =>
      //     section.id === updatedSection.id ? updatedSection : section,
      //   ),
      // );
      // setTimeout(() => setEditingSectionId(null), 100);
    } catch (error) {
      console.error("Failed to update section:", error);
      // Handle error (could add a toast notification here)
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowAlert(true);
      setIsLeaving(true);
    } else {
      navigate("/dashboard/evenements");
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const formData = {
      id: initialEvent?.id,
      title,
      description,
      location,
      date,
      type: eventType,
      coverImage,
      sections,
      abortControllerRef,
    };

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateEvent(formData);
      setIsDirty(false);
      setErrors({});
      setTimeout(() => {
        navigate("/dashboard/evenements");
      }, 0);
    } catch {
      setIsDirty(true);
      setErrors({
        submit: "Echec de l'envoi du formulaire. Veuillez essayer de nouveau.",
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

  if (isLoadingEvent) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (errorLoadingEvent) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center text-destructive">
        <h3 className="mb-2 text-lg font-semibold">Error Loading Event</h3>
        <p>
          {/* There was a problem loading the event data. Please try again later. */}
          Il y a eu une erreur lors du chargement des données de
          l&apos;événement. Veuillez essayer de nouveau plus tard.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/dashboard/evenements")}
        >
          Revenir aux Événements
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-8" ref={formRef}>
      {errors.submit && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive">
          {errors.submit}
        </div>
      )}

      <div className="mb-2 flex justify-between space-x-2">
        <h1 className="mb-2 text-3xl font-bold">Modifier un événement</h1>
        <div className="flex gap-5">
          <Button variant="outline" onClick={handleCancel}>
            Fermer et Quitter
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !(isDirtySection || isDirty) || isUpdatingEvent || isAddingSection
            }
          >
            {isUpdatingEvent ? (
              <>
                <Spinner className="flex text-white"></Spinner>
                Saving...
              </>
            ) : (
              "Sauvegarder les Modifications"
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <div className="space-y-2" data-error={!!errors.title}>
          <Label
            htmlFor="title"
            className={cn(
              "text-2xl font-semibold text-primary",
              errors.title && "text-destructive",
            )}
          >
            Titre de l&#39;Événement *
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
            placeholder="Donnez un titre à votre Événement"
            className={cn(errors.title && "border-destructive")}
          />
          <ErrorMessage error={errors.title} />
        </div>

        <div className="space-y-2" data-error={!!errors.description}>
          <Label
            htmlFor="description"
            className={cn(
              "text-2xl font-semibold text-primary",
              errors.description && "text-destructive",
            )}
          >
            Description de l&#39;Événement *
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
            placeholder="Donnez une description à votre Événement"
            rows={4}
            className={cn(errors.description && "border-destructive")}
          />
          <ErrorMessage error={errors.description} />
        </div>

        <div className="space-y-2" data-error={!!errors.location}>
          <Label
            htmlFor="location"
            className={cn(
              "text-2xl font-semibold text-primary",
              errors.location && "text-destructive",
            )}
          >
            Location *
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
            placeholder="Où se deroule l&#39;Événement?"
            className={cn(errors.location && "border-destructive")}
          />
          <ErrorMessage error={errors.location} />
        </div>

        <div className="flex justify-between gap-2" data-error={!!errors.date}>
          <div className="flex items-center gap-10">
            <Label
              className={cn(
                "text-2xl font-semibold text-primary",
                errors.date && "text-destructive",
              )}
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
                  {date ? format(date, "PPP") : "Select date"}
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
                Type de l&#39;Événement *
              </Label>
              <RadioGroup
                value={eventType}
                onValueChange={setEventType}
                className="flex gap-10 rounded-lg border bg-lgt-1 py-2 pl-7 pr-10"
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
        </div>

        <div className="space-y-2" data-error={!!errors.coverImage}>
          <Label
            className={cn(
              "text-2xl font-semibold text-primary",
              errors.coverImage && "text-destructive",
            )}
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
        id="sections"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-center text-2xl font-semibold text-primary">
            Sections de l&apos;Événement *
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
                  isEditingSection={isEditingSection}
                  isDeletingSection={isDeletingSection}
                  section={section} // the section's current info (backend data)
                  onSave={handleSaveSection} // saves the updated section
                  onCancel={() => {
                    setEditingSectionId(null);
                    cancelUpload();
                  }} // cancels editing
                  setIsDirty={setIsDirty}
                  setIsDirtySection={setIsDirtySection}
                  isDirtySection={isDirtySection}
                />
              ) : (
                <SectionItem
                  section={section} // the section's current info (backend data)
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
                  cancelUpload();
                  setIsAddingSectionOpen(false);
                  setNewSection({ title: "", paragraph: "", images: [] });
                }}
              >
                Annuler
              </Button>
              <Button onClick={addSection}>
                {" "}
                {!isAddingSection ? (
                  "Ajouter la Section"
                ) : (
                  <>
                    <Spinner className="flex text-white"></Spinner> Ajout en
                    cours...
                  </>
                )}
              </Button>
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
            <AlertDialogTitle>Changements non enregistrés</AlertDialogTitle>
            <AlertDialogDescription>
              {/* You have unsaved changes. Are you sure you want to leave this
              page? All your progress will be lost. */}
              Vous avez des changements non enregistrés. Êtes-vous sûr de
              vouloir quitter cette page? Tous vos progresses seront perdus.
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
              Quitter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
