import { Dialog, DialogContent } from "@/components/ui/dialog";
import { API_URL } from "@/utils/constants";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function ImageModal({ isOpen, onClose, imageUrl }) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[60vh] max-w-[60vw] border-none bg-transparent p-0 shadow-none">
          <DialogClose className="absolute right-[-2rem] top-[-2rem] rounded-full bg-gray-200 p-2 hover:bg-gray-300">
            <X className="h-4 w-4" />
          </DialogClose>
          <div className="relative flex items-center justify-center">
            <img
              src={imageUrl ? API_URL + imageUrl : "/placeholder.svg"}
              alt="Full size view"
              className="rounded-lg object-contain shadow-sm"
              onError={(e) => {
                e.target.src = "https://placehold.co/1200x800/png";
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
