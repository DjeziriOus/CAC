import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRowSkeleton from "../../../../components/ui/UserRowSkeleton";

import { useServices } from "../useServices";
import ServiceRow from "./ServicesRow";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function ServicesTable({ onEdit: handleEdit }) {
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });

  useEffect(() => {
    if (!searchParams.get("page")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  const { services, isPending, error } = useServices();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[1%]">ID</TableHead>
            <TableHead className="w-[30%]">Nom</TableHead>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="w-[13%]">Couverture</TableHead>
            <TableHead className="w-[20%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <UserRowSkeleton key={idx} />
            ))
          ) : services.length === 0 ? (
            <TableRow>
              <td
                colSpan="5"
                className="p-4 text-center font-medium text-gray-500"
              >
                Aucun service disponible
              </td>
            </TableRow>
          ) : (
            services.map((service) => (
              <ServiceRow
                service={service}
                key={service.id}
                onEdit={handleEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ServicesTable;
