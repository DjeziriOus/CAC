"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import EventSection from "./event-section";
import ImageUpload from "./image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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

  if (!formData.sections.length) {
    errors.sections = "At least one section is required";
  } else {
    const sectionErrors = formData.sections.map((section) => {
      const sectionError = {};
      if (!section.title.trim())
        sectionError.title = "Section title is required";
      if (!section.content.trim())
        sectionError.content = "Section content is required";
      if (!section.image) sectionError.image = "Section image is required";
      return Object.keys(sectionError).length ? sectionError : null;
    });

    if (sectionErrors.some((error) => error !== null)) {
      errors.sections = sectionErrors;
    }
  }

  return errors;
};

export default function AddEventForm() {
  const formRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(undefined);
  const [eventType, setEventType] = useState("national");
  const [coverImage, setCoverImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    content: "",
    image: null,
  });
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
      title !== "" ||
      description !== "" ||
      location !== "" ||
      date !== undefined ||
      coverImage !== null ||
      sections.length > 0 ||
      newSection.title !== "" ||
      newSection.content !== "" ||
      newSection.image !== null;

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
      content: "",
      image: null,
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
      // Navigate away - replace with your navigation method
      window.location.href = "/";
    }
  };

  const handlePublish = async () => {
    // Validate form
    const formData = {
      title,
      description,
      location,
      date,
      eventType,
      coverImage,
      sections,
    };

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsDirty(false);
      setErrors({});

      // Submit the form
      console.log("Submitting form data:", formData);

      // Navigate after successful submission
      window.location.href = "/";
    } catch (error) {
      setIsDirty(true);
      setErrors({ submit: "Failed to submit the form. Please try again." });
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
        <Button onClick={handlePublish}>Publish Event</Button>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <div className="space-y-2" data-error={!!errors.title}>
          <Label
            htmlFor="title"
            className={cn(errors.title && "text-destructive")}
          >
            Event Title *
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
            placeholder="Enter event title"
            className={cn(errors.title && "border-destructive")}
          />
          <ErrorMessage error={errors.title} />
        </div>

        <div className="space-y-2" data-error={!!errors.description}>
          <Label
            htmlFor="description"
            className={cn(errors.description && "text-destructive")}
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

        <div className="space-y-2" data-error={!!errors.location}>
          <Label
            htmlFor="location"
            className={cn(errors.location && "text-destructive")}
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
            placeholder="Enter event location"
            className={cn(errors.location && "border-destructive")}
          />
          <ErrorMessage error={errors.location} />
        </div>

        <div className="space-y-2" data-error={!!errors.date}>
          <Label className={cn(errors.date && "text-destructive")}>
            Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
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
          <Label>Event Type</Label>
          <RadioGroup
            defaultValue="national"
            value={eventType}
            onValueChange={setEventType}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="national" id="national" />
              <Label htmlFor="national">National</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="international" id="international" />
              <Label htmlFor="international">International</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2" data-error={!!errors.coverImage}>
          <Label className={cn(errors.coverImage && "text-destructive")}>
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

        {sections.map((section, index) => (
          <div key={section.id} data-error={errors.sections?.[index]}>
            <EventSection
              section={section}
              onRemove={() => removeSection(section.id)}
              errors={errors.sections?.[index]}
            />
          </div>
        ))}

        {isAddingSectionOpen ? (
          <div className="space-y-4 rounded-lg border border-primary bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium">Create New Section</h3>

            <div className="space-y-2">
              <Label htmlFor="section-title">Section Title *</Label>
              <Input
                id="section-title"
                value={newSection.title}
                onChange={(e) =>
                  setNewSection((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter section title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section-content">Section Content *</Label>
              <Textarea
                id="section-content"
                value={newSection.content}
                onChange={(e) =>
                  setNewSection((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Enter section content"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Section Image *</Label>
              <ImageUpload
                inputId="section-image-upload"
                currentImage={newSection.image}
                onImageSelect={(image) =>
                  setNewSection((prev) => ({ ...prev, image }))
                }
                onImageRemove={() =>
                  setNewSection((prev) => ({ ...prev, image: null }))
                }
                height="h-48"
                loading={isUploading}
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingSectionOpen(false);
                  setNewSection({ title: "", content: "", image: null });
                }}
              >
                Cancel
              </Button>
              <Button onClick={addSection}>Confirm Add Section</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full border-dashed py-8"
            onClick={() => setIsAddingSectionOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Section
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
                window.location.href = "/";
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
