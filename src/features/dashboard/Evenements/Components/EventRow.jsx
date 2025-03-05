import { Edit2Icon, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { useDeleteEvent } from "@/features/dashboard/Evenements/useDeleteEvent";
import DeleteDialog from "../../../../components/ui/DeleteUserDialog";
import DeleteUserDialog from "../../../../components/ui/DeleteUserDialog";
import moment from "moment";
import { API_URL } from "@/utils/constants";
import DeleteEventDialog from "@/components/ui/DeleteEventDialog";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/user/useUser";

function EventRow({ event }) {
  const {
    id,
    title,
    description,
    endroit,
    date,
    type,
    coverUrl,
    medecinId,
    createdAt,
    updatedAt,
    medecin: { id: idMedecin, nom, prenom, email },
  } = event;
  const { isDeletingEvent, deleteEvent } = useDeleteEvent();
  const handleDelete = (id) => {
    deleteEvent(id);
  };
  const navigate = useNavigate();
  const onEdit = function () {
    navigate(`/dashboard/evenements/edit/${id}`);
  };
  const { user, isPending, error } = useUser();
  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>
        <p className="line-clamp-3">{title}</p>
      </TableCell>
      {/* <TableCell>
        <p className="line-clamp-2">{description}</p>
      </TableCell> */}
      <TableCell>{endroit}</TableCell>
      <TableCell>{moment(date).format("DD/MM/YYYY - h:mm A")}</TableCell>
      <TableCell>
        {
          {
            national: "Evt. National",
            international: "Evt. International",
          }[type]
        }
      </TableCell>
      <TableCell>
        <img
          src={`${API_URL}${coverUrl}`}
          alt="image de l'evenement"
          className="h-10 w-28 object-cover"
        />
      </TableCell>
      <TableCell>{nom + " " + prenom}</TableCell>
      <TableCell>{email}</TableCell>

      <TableCell className="flex gap-2">
        {user.id != event.medecinId ? (
          <></>
        ) : (
          <>
            <Button variant="outline" size="icon" onClick={() => onEdit(event)}>
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <DeleteEventDialog handleDelete={handleDelete} event={event}>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                disabled={isDeletingEvent}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteEventDialog>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default EventRow;
