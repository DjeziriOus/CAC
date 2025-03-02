"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAddService } from "@/features/dashboard/Service/useAddService";
import ServicesTable from "./Components/ServicesTable";
import { NavLink, useSearchParams } from "react-router-dom";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Services() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingServiceState, setIsAddingServiceState] = useState(false);
  const { isAddingService, addService } = useAddService();
  // const dispatch = useDispatch(); // const { status } = useSelector((state) => state.users);

  const addServiceForm = useForm({
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

  return (
    <div className="flex h-full">
      <div
        className={`flex-1 space-y-4 p-8 pt-6 transition-all duration-300 ${
          isEditing || isAddingServiceState ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <NavLink to="/dashboard/services/ajouter">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Service
            </Button>
          </NavLink>
        </div>

        <ServicesTable />
      </div>
    </div>
  );
}
