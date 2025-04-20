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
import { Button } from "@/components/ui/button";
import { API_URL } from "@/utils/constants";
import { Edit, ExternalLink, FileText, Trash } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

// Section component with edit and delete functionality
const SectionItem = ({ section, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  console.log(section.media);
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
      {section.media && section.media.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {section.media.map((item, idx) => {
            return (
              <div key={idx} className="group relative">
                {item.type === "image" ? (
                  <div className="aspect-video">
                    <img
                      src={
                        item.data.startsWith("data:image/")
                          ? item.data
                          : item.data.startsWith("http")
                            ? item.data
                            : `${API_URL}${item.data}`
                      }
                      alt={`Section image ${idx + 1}`}
                      className="h-full w-full rounded-md bg-slate-300 object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-md border border-border bg-muted/20 p-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {item.name || `Document ${idx + 1}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SectionItem;
