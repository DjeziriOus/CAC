"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDoctorAPI, getUsers } from "@/services/apiQuestions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import UsersTable from "@/components/ui/UsersTable";
import { useAddDoctor } from "@/features/dashboard/Utilisateurs/useAddDoctor";
import EventsTable from "./Components/EventsTable";
import { NavLink } from "react-router-dom";
import LinkButton from "@/components/ui/LinkButton";

export default function Utilisateurs() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDoctorState, setIsAddingDoctorState] = useState(false);
  const { isAddingDoctor, addDoctor } = useAddDoctor();
  // const dispatch = useDispatch(); // const { status } = useSelector((state) => state.users);

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

  const onEditSubmit = (data) => {
    console.log("Updated user:", { ...selectedUser, ...data });
    // TODO: using react-query dispatch(fetchUsers());
    setIsEditing(false);
  };

  const onAddDoctorSubmit = async (data) => {
    try {
      addDoctor(data);

      addDoctorForm.reset();
      setIsAddingDoctorState(false);
    } catch (error) {
      console.error("Failed to add doctor:", error);
      addDoctorForm.setError("email", {
        type: "server",
        message: error.message || "Email déjà utilisé",
      });
    }
  };

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300 ${
          isEditing || isAddingDoctorState ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Événements</h2>
          <NavLink to="/dashboard/evenements/ajouter">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </NavLink>
        </div>

        <EventsTable />
      </div>

      {/* Add Doctor Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] border-l bg-background p-6 shadow-lg transition-transform duration-300 ${
          isAddingDoctorState ? "translate-x-0" : "translate-x-full"
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
                  onClick={() => setIsAddingDoctorState(false)}
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
