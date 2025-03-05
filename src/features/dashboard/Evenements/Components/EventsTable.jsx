import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRowSkeleton from "../../../../components/ui/UserRowSkeleton";

import { useEvents } from "../useEvents";
import EventRow from "./EventRow";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/features/user/useUser";

function EventsTable({ onEdit: handleEdit }) {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    type: "international",
  });

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let updated = false;

    if (!newParams.get("page")) {
      newParams.set("page", "1");
      updated = true;
    }
    if (!newParams.get("type")) {
      newParams.set("type", "international");
      updated = true;
    }

    if (updated) {
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  const { events, isPending, error } = useEvents();
  const {
    user,
    isPending: isPendingUser,
    error: userError,
    isSuccess,
  } = useUser();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1%]">ID</TableHead>
            <TableHead className="w-[30%]">Title</TableHead>
            {/* <TableHead className="w-[20%]">Description</TableHead> */}
            <TableHead className="w-[5%]">Endroit</TableHead>
            <TableHead className="w-[20%]">Date</TableHead>
            <TableHead className="w-[13%]">Type</TableHead>
            <TableHead className="w-[13%]">Couverture</TableHead>
            <TableHead className="w-[10%]">Medecin</TableHead>
            <TableHead className="w-[20%]">Medecin Email</TableHead>
            {isSuccess && events?.some((event) => event?.id === user?.id) ? (
              <TableHead className="w-[20%]">Actions</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <UserRowSkeleton key={idx} />
            ))
          ) : error ? (
            <TableRow>
              <td
                colSpan="5"
                className="p-4 text-center font-medium text-gray-500"
              >
                Serveur indisponible
              </td>
            </TableRow>
          ) : !events.length ? (
            <TableRow>
              <td
                colSpan="5"
                className="p-4 text-center font-medium text-gray-500"
              >
                Aucun événement disponible
              </td>
            </TableRow>
          ) : (
            events.map((event) => (
              <EventRow event={event} key={event.id} onEdit={handleEdit} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventsTable;
