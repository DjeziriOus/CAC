import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRowSkeleton from "../../../../components/ui/UserRowSkeleton";

import UserRow from "../../../../components/ui/UserRow";
import { useEvents } from "../useEvents";
import EventRow from "./EventRow";

function EventsTable({ onEdit: handleEdit }) {
  const { events, isPending, error } = useEvents();
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
            <TableHead className="w-[20%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array.from({ length: 5 }).map((_, idx) => (
                <UserRowSkeleton key={idx} />
              ))
            : events.map((event) => (
                <EventRow event={event} key={event.id} onEdit={handleEdit} />
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventsTable;
