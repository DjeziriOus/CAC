"use client";

import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { API_URL, SERVICES_PER_PAGE } from "@/utils/constants";
import { useServices } from "@/features/dashboard/Services/useServices";
import Paginator from "@/components/paginator-v2";

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
  const { services, isPending, error, total } = useServices();
  if (isPending) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Chargement des services...</p>
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
  if (!services.length) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-muted-foreground">Aucun service disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <Paginator
        totalPages={Math.ceil(total / SERVICES_PER_PAGE)}
        isPending={isPending}
      />
    </div>
  );
};

export default function Services() {
  // const [searchParams, setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   // setActiveTab(searchParams.get("type") || "national");
  //   searchParams.get("type") || searchParams.set("type", "national");
  //   setSearchParams(searchParams);
  // }, [searchParams, setSearchParams]);

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
