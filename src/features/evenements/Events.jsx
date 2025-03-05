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
import { format, set } from "date-fns";
import { fr } from "date-fns/locale";
import { API_URL } from "@/utils/constants";
import { use } from "react";
import { useEvents } from "@/features/dashboard/Evenements/useEvents";

const EventCard = ({ event }) => {
  const formattedDate = format(new Date(event.date), "dd MMMM yyyy", {
    locale: fr,
  });

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={API_URL + event.coverUrl || "/placeholder.svg"}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/png";
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-primary" />
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {event.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm">
          <MapPinIcon className="h-4 w-4 text-primary" />
          <span>{event.endroit}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 border-t pt-4">
        <div className="flex w-full items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {event.medecin.prenom[0]}
              {event.medecin.nom[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {event.medecin.prenom} {event.medecin.nom}
            </p>
            <p className="text-xs text-muted-foreground">
              {event.medecin.email}
            </p>
          </div>
        </div>
        <Link
          to={`/evenements/${event.id}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Voir les détails
        </Link>
      </CardFooter>
    </Card>
  );
};

// Events List Component
const EventsList = () => {
  const { events, isPending, error } = useEvents();
  if (isPending) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Chargement des événements...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">
          Une erreur est survenue, Serveur indisponible
        </p>
      </div>
    );
  }
  if (!events.length) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Aucun événement disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default function Events() {
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
      <h1 className="mb-8 text-center text-3xl font-bold">Événements</h1>

      <Tabs
        defaultValue={searchParams.get("type") || "national"}
        className="w-full"
        onValueChange={(e) => {
          setActiveTab(e);
          searchParams.set("type", e);
          setSearchParams(searchParams);
          console.log(e);
        }}
      >
        <div className="mb-8 flex justify-center">
          <TabsList className="grid h-full w-full max-w-md grid-cols-2">
            <TabsTrigger value="national" className="py-3 text-base">
              Nationaux
            </TabsTrigger>
            <TabsTrigger value="international" className="py-3 text-base">
              Internationaux
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="national" className="mx-auto mt-0 max-w-[65dvw]">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Événements Nationaux
            </h2>
            <p className="text-muted-foreground">
              Découvrez les événements médicaux qui se déroulent à travers le
              pays.
            </p>
          </div>
          <EventsList />
        </TabsContent>

        <TabsContent
          value="international"
          className="mx-auto mt-0 max-w-[65dvw]"
        >
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Événements Internationaux
            </h2>
            <p className="text-muted-foreground">
              Explorez les conférences et sommets médicaux du monde entier.
            </p>
          </div>
          <EventsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
