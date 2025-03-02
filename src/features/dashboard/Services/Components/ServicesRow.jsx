import { Edit2Icon, Trash2 } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { useDeleteService } from "@/features/dashboard/Services/useDeleteService";

import moment from "moment";
import { API_URL } from "@/utils/constants";
import DeleteServiceDialog from "@/components/ui/DeleteServiceDialog";
import { useNavigate } from "react-router-dom";

function ServiceRow({ service }) {
  const {
    id,
    nom,
    description,
    coverUrl,
    medecinId,
    createdAt,
    updatedAt,
    medecin: { nomMedecin, prenom, email } = {
      nomMedecin: "",
      prenom: "",
      email: "",
    },
  } = service;
  const { isDeletingService, deleteService } = useDeleteService();
  const handleDelete = (id) => {
    deleteService(id);
  };
  const navigate = useNavigate();
  const onEdit = function () {
    navigate(`/dashboard/services/edit/${id}`);
  };
  return (
    <TableRow key={id}>
      <TableCell>{id}</TableCell>
      <TableCell>
        <p className="line-clamp-3">{nom}</p>
      </TableCell>
      <TableCell>
        <p className="line-clamp-2">{description}</p>
      </TableCell>
      <TableCell>
        <img
          src={`${API_URL}${coverUrl}`}
          alt="image de l'evenement"
          className="h-10 w-28 object-cover"
        />
      </TableCell>

      <TableCell className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(service)}>
          <Edit2Icon className="h-4 w-4" />
        </Button>
        <DeleteServiceDialog
          handleDelete={handleDelete}
          element={service}
          type={"le service"}
        >
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            disabled={isDeletingService}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DeleteServiceDialog>
      </TableCell>
    </TableRow>
  );
}

export default ServiceRow;
