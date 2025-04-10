"use client";

import { Dialog, DialogContent } from "@/components/ui/ImageDialog";
import { API_URL } from "@/utils/constants";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export function ImageModal({ isOpen, onClose, imageUrl }) {
  const [imageOrientation, setImageOrientation] = useState("landscape");
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => {
        setImageOrientation(img.width > img.height ? "landscape" : "portrait");
        setIsLoading(false);
        setShowContent(true);
      };
      img.onerror = () => {
        setImageOrientation("landscape");
        setIsLoading(false);
        setShowContent(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Handle dialog close
  const handleOpenChange = (open) => {
    if (!open) {
      // First hide the content
      setShowContent(false);
      // Then trigger the close after a short delay
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="border-none bg-transparent p-0 shadow-none"
        onPointerDownOutside={(e) => {
          if (e.target.tagName === "IMG") {
            e.preventDefault();
          }
        }}
      >
        <div
          className={`relative inline-block transition-opacity duration-200 ${showContent ? "opacity-100" : "opacity-0"} `}
        >
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute right-2 top-2 z-50 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background/60"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}

          <img
            src={imageUrl ? imageUrl : "/placeholder.svg"}
            alt="Full size view"
            className={`rounded-lg ${imageOrientation === "portrait" ? "max-h-[90vh] w-auto" : "h-auto max-h-[90vh] max-w-[90vw]"} `}
            style={{
              objectFit: "contain",
              margin: "0 auto",
            }}
            onError={(e) => {
              e.target.src = "https://placehold.co/1200x800/png";
              setIsLoading(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
