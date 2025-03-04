"use client";

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { API_URL } from "@/utils/constants";
import { use } from "react";
import { useServices } from "@/features/dashboard/Services/useServices";

const ServiceCard = ({ service }) => {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={API_URL + service.coverUrl || "/placeholder.svg"}
          alt={service.nom}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/png";
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{service.nom}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-4 border-t pt-4">
        <Link
          to={`/services/${service.id}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Voir les détails
        </Link>
      </CardFooter>
    </Card>
  );
};

// Services List Component
const ServicesList = () => {
  const { services, isPending, error } = useServices();
  if (isPending) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Chargement des services...</p>
      </div>
    );
  }
  if (services.length === 0) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Aucun service disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default function Services() {
  const [activeTab, setActiveTab] = useState("national");
  // const [searchParams, setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   // setActiveTab(searchParams.get("type") || "national");
  //   searchParams.get("type") || searchParams.set("type", "national");
  //   setSearchParams(searchParams);
  // }, [searchParams, setSearchParams]);
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    type: "national",
  });

  // useEffect(() => {
  //   const newParams = new URLSearchParams(searchParams);
  //   let updated = false;

  //   if (!newParams.get("page")) {
  //     newParams.set("page", "1");
  //     updated = true;
  //   }
  //   if (!newParams.get("type")) {
  //     newParams.set("type", "national");
  //     updated = true;
  //   }

  //   if (updated) {
  //     setSearchParams(newParams, { replace: true });
  //   }
  // }, []);

  return (
    <div className="container mx-auto min-h-[120dvh] px-4 py-24">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Services Hospitaliers
      </h1>

      <div className="w-full">
        <div className="mx-auto mt-0 max-w-[65dvw]">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Services Hospitaliers
            </h2>
            <p className="text-muted-foreground">
              Découvrez les activités hospitaliers, et les services.
            </p>
          </div>
          <ServicesList />
        </div>
      </div>
    </div>
  );
}
