import { TableCell, TableRow } from "./table";

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 animate-pulse rounded bg-gray-300" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-300" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-28 animate-pulse rounded bg-gray-300" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-6 animate-pulse rounded bg-gray-300" />
      </TableCell>
    </TableRow>
  );
}

export default UserRowSkeleton;
