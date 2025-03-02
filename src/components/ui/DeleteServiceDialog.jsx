import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
function DeleteServiceDialog({ handleDelete, element, children, type }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1 pb-4 font-medium">
            <span>Êtes-vous sûr de vouloir supprimer {type}</span>
            <p className="line-clamp-3 font-bold">{element?.nom}</p>
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Cela supprimera définitivement
            {type} et toutes les données associées.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <DialogClose>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDelete(element.id)}
            >
              Supprimer
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteServiceDialog;
