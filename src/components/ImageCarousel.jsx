"use client";

import { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/utils/constants";

export function ImageCarousel({ images, onImageClick }) {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [imageOrientations, setImageOrientations] = useState({});

  useEffect(() => {
    // Preload images and detect orientations
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        setImageOrientations((prev) => ({
          ...prev,
          [index]: img.width > img.height ? "landscape" : "portrait",
        }));
      };
      console.log(image.url);
      image.src = image.url;
    });
  }, [images]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newScrollPosition =
      container.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    container.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10,
    );
  };

  if (!images?.length) return null;

  return (
    <Card className="relative bg-muted/50 p-1">
      {showLeftButton && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}
      {showRightButton && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex gap-4 overflow-x-auto px-4 py-6"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative flex-none cursor-pointer overflow-hidden rounded-md ${imageOrientations[index] === "portrait" ? "aspect-[3/4] w-[200px]" : "aspect-[4/3] w-[280px]"} `}
            onClick={() => onImageClick(image.url)}
          >
            <img
              src={image.url || "/placeholder.svg"}
              alt={`Gallery image ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x300/png";
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
