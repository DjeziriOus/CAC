"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { API_URL } from "@/utils/constants";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export function ImageModal({ isOpen, onClose, imageUrl }) {
  const [imageOrientation, setImageOrientation] = useState("landscape");
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when image changes
  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      // Preload image to detect dimensions
      const img = new Image();
      img.onload = () => {
        setImageOrientation(img.width > img.height ? "landscape" : "portrait");
        setIsLoading(false);
      };
      img.onerror = () => {
        setImageOrientation("landscape");
        setIsLoading(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] border-none bg-transparent p-0">
        <button
          onClick={onClose}
          className="absolute right-[-2rem] top-[-2rem] z-50 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background/60"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="relative flex h-full min-h-[50vh] w-full items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          <img
            src={imageUrl ? API_URL + imageUrl : "/placeholder.svg"}
            alt="Full size view"
            className={`max-h-[90vh] max-w-full rounded-lg object-contain ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200"} ${imageOrientation === "portrait" ? "max-h-[90vh] w-auto" : "h-auto max-w-[90vw]"} `}
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
