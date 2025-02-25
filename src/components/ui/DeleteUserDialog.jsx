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
function DeleteUserDialog({ handleDelete, user, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-1 pb-4 font-medium">
            <span>Êtes-vous sûr de vouloir supprimer l&apos;utilisateur</span>
            <span className="font-bold">
              {user.nom} {user.prenom} <span className="font-medium">?</span>
            </span>
          </DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Cela supprimera définitivement le
            compte utilisateur et toutes les données associées.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <DialogClose>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <DialogClose>
            <Button variant="destructive" onClick={() => handleDelete(user.id)}>
              Supprimer
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserDialog;
