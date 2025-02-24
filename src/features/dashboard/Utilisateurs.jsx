"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit2Icon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addDoctor, fetchUsers } from "@/features/dashboard/usersSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function Utilisateurs() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [sorting, setSorting] = useState([]);

  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const editForm = useForm({
    defaultValues: {
      nom: "",
      prenom: "",
      role: "",
    },
  });

  const addDoctorForm = useForm({
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
    },
    // Add validation rules
    resolver: zodResolver(
      z.object({
        nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        prenom: z
          .string()
          .min(2, "Le prénom doit contenir au moins 2 caractères"),
        email: z.string().email("Email invalide"),
        password: z
          .string()
          .min(3, "Le mot de passe doit contenir au moins 3 caractères"),
      }),
    ),
  });

  const onEdit = (user) => {
    setSelectedUser(user);
    editForm.reset({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
    });
    setIsEditing(true);
    setIsAddingDoctor(false);
  };

  const onEditSubmit = (data) => {
    console.log("Updated user:", { ...selectedUser, ...data });
    dispatch(fetchUsers());
    setIsEditing(false);
  };

  const onAddDoctorSubmit = async (data) => {
    try {
      await dispatch(addDoctor(data)).unwrap();
      dispatch(fetchUsers()); // Refresh the list after adding
      addDoctorForm.reset();
      setIsAddingDoctor(false);
    } catch (error) {
      console.error("Failed to add doctor:", error);
      addDoctorForm.setError("email", {
        type: "server",
        message: error.message || "Email déjà utilisé",
      });
    }
  };

  const table = useReactTable({
    data: users,
    columns: [
      {
        accessorKey: "avatar",
        header: "",
        cell: ({ row }) => (
          <Avatar className="h-10 w-10">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback className="bg-gray-200">
              {row.original.prenom[0] + row.original.nom[0]}
            </AvatarFallback>
          </Avatar>
        ),
      },
      {
        accessorKey: "nom",
        header: "Prénom",
      },
      {
        accessorKey: "prenom",
        header: "Nom",
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => {
          const roleLabels = {
            admin: "Administrateur",
            medecin: "Médecin",
            etudiant: "Etudiant",
            patient: "Patient",
          };
          return roleLabels[row.original.role] || row.original.role;
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300 ${
          isEditing || isAddingDoctor ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
          <Button
            onClick={() => {
              setIsAddingDoctor(true);
              setIsEditing(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un médecin
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === "loading"
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
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
                  ))
                : users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage alt="@shadcn" />
                          <AvatarFallback className="bg-gray-200">
                            {user.prenom[0] + user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{user.nom}</TableCell>
                      <TableCell>{user.prenom}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {
                          {
                            admin: "Administrateur",
                            medecin: "Médecin",
                            etudiant: "Etudiant",
                            patient: "Patient",
                          }[user.role]
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(user)}
                        >
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] border-l bg-background p-6 shadow-lg transition-transform duration-300 ${
          isEditing ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <h3 className="text-lg font-medium">
            Modifier {selectedUser?.nom} {selectedUser?.prenom}
          </h3>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="flex h-full flex-col"
            >
              <div className="flex-1 space-y-4 py-4">
                <FormField
                  control={editForm.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="medecin">Médecin</SelectItem>
                          <SelectItem value="etudiant">Etudiant</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Add Doctor Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] border-l bg-background p-6 shadow-lg transition-transform duration-300 ${
          isAddingDoctor ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <h3 className="text-lg font-medium">Ajouter un médecin</h3>
          <Form {...addDoctorForm}>
            <form
              onSubmit={addDoctorForm.handleSubmit(onAddDoctorSubmit)}
              className="flex h-full flex-col"
            >
              <div className="flex-1 space-y-4 py-4">
                <FormField
                  control={addDoctorForm.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Prénom
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Entrez le prénom" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addDoctorForm.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Nom
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Entrez le nom" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addDoctorForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Email
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="docteur@exemple.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addDoctorForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Mot de Passe
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Entrez le mot de passe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingDoctor(false)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
