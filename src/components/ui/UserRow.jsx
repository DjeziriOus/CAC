import { Edit2Icon, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { TableCell, TableRow } from "@/components/ui/table";

import { useDeleteAccount } from "@/features/dashboard/Utilisateurs/useDeleteAccount";

import DeleteUserDialog from "./DeleteUserDialog";

function UserRow({ user, onEdit }) {
  const { id, nom, prenom, email, role } = user;
  const { isDeletingAccount, deleteAccount } = useDeleteAccount();
  const handleDelete = (id) => {
    deleteAccount(id);
  };
  return (
    <TableRow key={id}>
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage alt="@shadcn" />
          <AvatarFallback className="bg-gray-200">
            {prenom?.[0] + nom?.[0]}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>{nom}</TableCell>
      <TableCell>{prenom}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        {
          {
            admin: "Administrateur",
            medecin: "Médecin",
            etudiant: "Etudiant",
            patient: "Patient",
          }[role]
        }
      </TableCell>
      <TableCell className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(user)}>
          <Edit2Icon className="h-4 w-4" />
        </Button>
        <DeleteUserDialog handleDelete={handleDelete} user={user}>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            disabled={isDeletingAccount}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DeleteUserDialog>
      </TableCell>
    </TableRow>
  );
}

export default UserRow;
