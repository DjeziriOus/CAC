"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

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
import { NavLink, useSearchParams } from "react-router-dom";
import LinkButton from "@/components/ui/LinkButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Evenements() {
  const [searchParams, setSearchParams] = useSearchParams();
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

          {/* <NavLink to="/dashboard/evenements/ajouter">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </NavLink> */}
          <Tabs
            defaultValue={searchParams.get("type") || "international"}
            onValueChange={(e) => {
              searchParams.set("type", e);
              searchParams.set("page", 1);
              setSearchParams(searchParams);
            }}
            className="w-[400px]"
          >
            <TabsList className="grid h-12 w-full grid-cols-2">
              <TabsTrigger value="international" className="h-10">
                Événements Internationaux
              </TabsTrigger>
              <TabsTrigger value="national" className="h-10">
                Événements Nationaux
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <NavLink to="/dashboard/evenements/ajouter">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </NavLink>
        </div>

        <EventsTable />
      </div>
    </div>
  );
}
