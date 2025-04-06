import { getUsers } from "@/services/apiQuestions";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserRowSkeleton from "./UserRowSkeleton";
import { useQuery } from "@tanstack/react-query";
import UserRow from "./UserRow";

function UsersTable({ onEdit: handleEdit }) {
  const { isPending, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[2%]">Avatar</TableHead>
            <TableHead className="w-[15%]">Prénom</TableHead>
            <TableHead className="w-[10%]">Nom</TableHead>
            <TableHead className="w-[20%]">Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="w-[10%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array.from({ length: 5 }).map((_, idx) => (
                <UserRowSkeleton key={idx} />
              ))
            : users.map((user) => (
                <UserRow user={user} key={user.id} onEdit={handleEdit} />
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UsersTable;
