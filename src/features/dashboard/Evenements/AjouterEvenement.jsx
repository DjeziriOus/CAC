"use client";
import ImageUpload from "@/features/dashboard/Evenements/ImageUpload";
import { useState, useEffect } from "react";
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
import { CalendarIcon, X, Plus, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import EventSection from "@/features/dashboard/Evenements/EventSection";
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
import { useNavigate } from "react-router-dom";

export default function AjouterEvenement() {
  const { addEvent, isAddingEvent } = useAddEvent();
  const navigate = useNavigate();
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
  }, [isDirty, isAddingEvent]);

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
      navigate("/dashboard/evenements");
    }
  };

  const handlePublish = () => {
    try {
      setIsDirty(false);

      // Here you would typically submit the form data to your backend
      console.log({
        title,
        description,
        location,
        date,
        type: eventType,
        coverImage,
        sections,
      });

      addEvent({
        title,
        description,
        location,
        date,
        type: eventType,
        coverImage,
        sections,
      });

      // // Reset form and navigate away

      // replace with your navigation method
      navigate("/dashboard/evenements");
    } catch (error) {
      // If there's an error, set form back to dirty
      setIsDirty(true);
      console.error("Error submitting event:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handlePublish}>Publish Event</Button>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-2xl font-semibold text-primary"
          >
            Event Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-2xl font-semibold text-primary"
          >
            Event Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="location"
            className="text-2xl font-semibold text-primary"
          >
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter event location"
          />
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-10">
            <Label className="text-2xl font-semibold text-primary">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-10">
              <Label className="text-2xl font-semibold text-primary">
                Event Type
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

        <div className="space-y-2">
          <Label className="text-2xl font-semibold text-primary">
            Cover Image
          </Label>
          <ImageUpload
            inputId="cover-image-upload"
            currentImage={coverImage}
            onImageSelect={setCoverImage}
            onImageRemove={() => setCoverImage(null)}
            loading={isUploading}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-center text-2xl font-semibold text-primary">
          Event Sections
        </h2>

        {sections.map((section) => (
          <EventSection
            key={section.id}
            section={section}
            onRemove={() => removeSection(section.id)}
          />
        ))}

        {isAddingSectionOpen ? (
          <div className="space-y-4 rounded-lg border border-primary bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium">Create New Section</h3>

            <div className="space-y-2">
              <Label htmlFor="section-title">Section Title</Label>
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
              <Label htmlFor="section-content">Section Content</Label>
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
              <Label className="text-2xl font-semibold text-primary">
                Section Image
              </Label>
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
                // window.location.href = "/dashboard/evenements";
                navigate("/dashboard/evenements");
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
