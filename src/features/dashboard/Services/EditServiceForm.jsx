"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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

import {
  AlertCircle,
  Plus,
  Trash,
  Edit,
  FileText,
  ExternalLink,
} from "lucide-react";
import ImageUpload from "@/features/dashboard/Evenements/ImageUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn, isEqual } from "@/lib/utils";
// import Loader from "@/components/ui/Loader";
import { API_URL } from "@/utils/constants";
import { useUpdateSection } from "./useUpdateSection";
import { useUpdateService } from "./useUpdateService";
import { useAddSection } from "./useAddSection";
import { Spinner } from "@/components/ui/Spinner";
import SectionMediaManager from "./section-media-manager";
import { NavLink } from "react-router-dom";

// Define API_URL or import it from a config file

// Validation helper
const validateForm = (formData, editingSectionId, isAddingSectionOpen) => {
  const errors = {};

  if (!formData.nom.trim()) {
    errors.nom = "Titre du service est requis";
  }

  if (!formData.description.trim()) {
    errors.description = "Service description is required";
  }

  if (!formData.coverImage) {
    errors.coverImage = "Cover image is required";
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
    // errors.sections = "Au moins une section de description est requise";
  } else {
    const sectionsErrors = formData.sections.map((section) => {
      const sectionsErrors = {};
      if (!section?.title.trim())
        sectionsErrors.title = "Titre de la section est requis";
      if (!section?.paragraph.trim())
        sectionsErrors.paragraph = "Contenu de la section est requis";
      // if (!section.media?.length)
      //   sectionError.media = "Au moins un fichier est requis";
      return Object.keys(sectionsErrors).length ? sectionsErrors : null;
    });

    if (sectionsErrors.some((error) => error !== null)) {
      errors.sections = sectionsErrors;
    }
  }

  return errors;
};

// Section component with edit and delete functionality
const SectionItem = ({ section, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Convert legacy images to media format if needed
  const sectionMedia =
    section.media ||
    (section.images && section.images.length > 0 ? section.images : []);

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
                  Êtes-vous sûr de vouloir supprimer cette section? Cette action
                  ne peut pas être annulée.
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

      {/* Display section media (images and files) */}
      {sectionMedia && sectionMedia.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectionMedia.map((item, idx) => (
            <div key={idx} className="group relative">
              {item.type === "image" ? (
                <NavLink
                  className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-border bg-muted/20"
                  key={idx}
                  target="_blank"
                  to={item.url}
                >
                  <img
                    src={item.url ? item.url : "/placeholder.svg"}
                    alt={`Image ${idx + 1} for ${section.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/800x450/png";
                    }}
                  />
                </NavLink>
              ) : (
                <NavLink
                  className="flex aspect-video items-center justify-center rounded-md border border-border bg-muted/20 p-4"
                  key={idx}
                  target="_blank"
                  to={item.url}
                >
                  <div className="flex h-full w-full items-center justify-center transition-transform duration-300 hover:scale-105">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <span className="flex items-center gap-1 text-sm font-medium">
                        {item.name || `Document ${idx + 1}`}
                        <ExternalLink className="h-4 w-4 font-bold" />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Section edit form with multiple file support
const SectionEditForm = ({
  section, //backend's pov of the section
  onSave,
  onCancel,
  isEditingSection,
  isDeletingSection,
  setIsDirtySection,
  isDirtySection,
  errors: openMenuError,
  setErrors: setOpenMenuError,
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

  useEffect(() => {
    console.log(section.media, media);
    const hasDiffrentContent =
      title !== section.title ||
      paragraph !== section.paragraph ||
      media.length !== (section.media?.length || 0) ||
      media.some((item, idx) => {
        const sectionImage = section.media?.[idx];
        return !sectionImage || item?.url !== sectionImage.url;
      });
    setIsDirtySection(hasDiffrentContent);
  }, [title, paragraph, media, section, setIsDirtySection, isDirtySection]);

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
    setIsDirtySection(false);
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

  // const handleMediaChange = (updatedMedia) => {
  //   setMedia((prevMedia) => {
  //     const existingNames = new Set(prevMedia.map((item) => item.name));
  //     const newMediaItems = updatedMedia.filter(
  //       (item) => !existingNames.has(item.name),
  //     );
  //     return [...newMediaItems, ...prevMedia];
  //   });
  // };

  const handleAddMedia = (newFiles) => {
    setMedia((prevMedia) => [...prevMedia, ...newFiles]);
    setNewMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemoveMedia = (indexToRemove) => {
    setMedia((prev) => prev.filter((_, index) => index !== indexToRemove));
    // If we're removing a new image, also remove it from newMediaFiles
    if (indexToRemove >= section.media.length) {
      const newMediaIndex = indexToRemove - section.media.length;
      setNewMediaFiles((prev) =>
        prev.filter((_, index) => index !== newMediaIndex),
      );
    }
  };

  // const handleNewFilesChange = (files) => {
  //   setNewMediaFiles(files);
  // };

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

export default function EditServiceForm({
  initialService = null,
  isLoadingService = false,
  errorLoadingService = null,
}) {
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { deleteSection, isDeletingSection } = useDeleteSection();
  const { updateService, isUpdatingService } = useUpdateService();
  const { addSection: mutateAddSection, isAddingSection } = useAddSection();
  const { updateSection, isEditingSection } = useUpdateSection();
  // Store original values for dirty checking
  const [originalValues, setOriginalValues] = useState(null);

  // Form state
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  // const [pdfDocument, setPdfDocument] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [newSection, setNewSection] = useState({
    title: "",
    paragraph: "",
    media: [],
  });

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [isDirtySection, setIsDirtySection] = useState(false);
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

  // Initialize form with service data if editing
  useEffect(() => {
    if (initialService) {
      setNom(initialService.nom);
      setDescription(initialService.description);
      setCoverImage(initialService.coverUrl);
      // setPdfDocument(initialService.pdfUrl || null);
      setSections(initialService.sections || []);

      // Store original values for dirty checking
      setOriginalValues({
        nom: initialService.nom,
        description: initialService.description,
        coverImage: initialService.coverUrl,
        // pdfDocument: initialService.pdfUrl || null,
        sections: initialService.sections || [],
      });
    }
  }, [initialService]);

  // Track form changes by comparing with original values
  useEffect(() => {
    if (!originalValues) return;

    const currentValues = {
      nom,
      description,
      coverImage,
      sections,
    };

    const hasChanges = !isEqual(currentValues, originalValues);
    setIsDirty(hasChanges);
  }, [nom, description, coverImage, sections, originalValues]);

  // Handle beforeunload service
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.prserviceDefault();
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
      serviceId: initialService?.id,
      title: newSection.title,
      paragraph: newSection.paragraph,
      media: newSection.media,
      abortControllerRef,
    });

    setNewSection({
      title: "",
      paragraph: "",
      media: [],
    });

    setIsAddingSectionOpen(false);
    const newErrors = { ...errors };
    delete newErrors.sections;
    setErrors(newErrors);
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
    } catch (error) {
      console.error("Failed to delete section:", error);
      // Handle error (could add a toast notification here)
    }
  };

  const handleUpdateSection = (section) => {
    setEditingSectionId(section.id);
  };

  const handleSaveSection = async (updatedSection, newMediaFiles = []) => {
    try {
      const originalSection = sections.find((s) => s.id === updatedSection.id);
      if (!originalSection) return;
      await updateSection({
        originalSection,
        updatedSection: {
          ...updatedSection,
          serviceId: initialService.id,
        },
        newMediaFiles,
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
      navigate("/dashboard/services");
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const formData = {
      id: initialService?.id,
      nom,
      description,
      coverImage,
      // pdfDocument,
      sections,
      abortControllerRef,
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
      await updateService(formData);
      setIsDirty(false);
      setErrors({});
      setTimeout(() => {
        navigate("/dashboard/services");
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

  if (isLoadingService) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="flex text-white" size={"large"}></Spinner>
      </div>
    );
  }

  if (errorLoadingService) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center text-destructive">
        <h3 className="mb-2 text-lg font-semibold">Error Loading Service</h3>
        <p>
          {/* There was a problem loading the service data. Please try again later. */}
          Il y a eu une erreur lors du chargement des données du service.
          Veuillez essayer de nouveau plus tard.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/dashboard/services")}
        >
          Revenir aux services
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
        <h1 className="mb-2 text-3xl font-bold">Modifier un service</h1>
        <div className="flex gap-5">
          <Button variant="outline" onClick={handleCancel}>
            Fermer et Quitter
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !(isDirtySection || isDirty) ||
              isUpdatingService ||
              isAddingSection
            }
          >
            {isUpdatingService ? (
              <>
                <Spinner className="flex text-white"></Spinner>
                Sauvegrade en cours...
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
            Titre du service *
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
            placeholder="Donnez un titre à votre service"
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
            Description du service *
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
            placeholder="Donnez une description à votre service"
            rows={4}
            className={cn(errors.description && "border-destructive")}
          />
          <ErrorMessage error={errors.description} />
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

        {/*         <div className="space-y-2">
          <Label className="text-2xl font-semibold text-primary">
            Document PDF (Optionnel)
          </Label>
          <PdfUpload
            inputId="pdf-document-upload"
            currentPdf={pdfDocument}
            onPdfSelect={(pdf) => {
              setPdfDocument(pdf);
            }}
            onPdfRemove={() => setPdfDocument(null)}
            loading={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Ajoutez un document PDF pour fournir plus d&apos;informations sur ce
            service
          </p>
        </div> */}
      </div>

      <div
        className="space-y-6 rounded-lg bg-card p-6 shadow-sm"
        data-error={!!errors.sections}
        id="sections"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-center text-2xl font-semibold text-primary">
            Sections de la description du Service
          </h2>
          {errors.sections && <ErrorMessage error={errors.sections} />}
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
                    if (errors.sections) {
                      const newErrors = { ...errors };
                      delete newErrors.sections;
                      setErrors(newErrors);
                    }
                  }} // cancels editing
                  errors={errors}
                  setErrors={setErrors}
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
                  if (newSectionErrors.title) {
                    const newErrors = { ...newSectionErrors };
                    delete newErrors.title;
                    setNewSectionErrors(newErrors);
                  }
                  setNewSection((prev) => ({ ...prev, title: e.target.value }));
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
                  cancelUpload();
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
              <Button onClick={addSection} disabled={isAddingSection}>
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
                navigate("/dashboard/services");
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

/*// PDF Upload component
const PdfUpload = ({
  inputId,
  currentPdf,
  onPdfSelect,
  onPdfRemove,
  loading = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      onPdfSelect(file);
    } else if (file) {
      alert("Please select a PDF file");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        id={inputId}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {currentPdf ? (
        <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
          <div className="flex items-center space-x-2">
            <div className="rounded-md bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {typeof currentPdf === "string"
                  ? currentPdf.split("/").pop()
                  : currentPdf.name || "Document.pdf"}
              </p>
              <p className="text-sm text-muted-foreground">PDF Document</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={loading}
            >
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPdfRemove}
              disabled={loading}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background p-6 transition-colors hover:bg-accent/50"
        >
          <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 font-medium">Click to upload PDF</p>
          <p className="text-sm text-muted-foreground">
            PDF files only (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
};

// Create a new FileUpload component that supports multiple file types
const FileUpload = ({
  inputId,
  onFileSelect,
  height = "h-64",
  className = "",
  loading = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-background p-6 transition-colors hover:bg-accent/50",
        height,
        className,
        loading && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        type="file"
        id={inputId}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        className="hidden"
        disabled={loading}
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <Plus className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Ajouter un fichier</p>
        <p className="text-xs text-muted-foreground">
          Images, PDF, PPT, DOC, XLS (max 10MB)
        </p>
      </div>
    </div>
  );
};
 */
