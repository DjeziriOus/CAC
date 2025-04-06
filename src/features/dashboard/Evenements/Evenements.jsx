"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import EventsTable from "./Components/EventsTable";
import { NavLink, useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Paginator from "@/components/paginator-v2";
import { useTotalPagesEvents } from "./useTotalPagesEvents";

export default function Evenements() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalPages, isPending } = useTotalPagesEvents();
  return (
    <div className="flex h-full">
      <div
        className={`flex h-full flex-1 flex-col gap-5 space-y-4 p-8 pt-6 transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Événements</h2>
          <Tabs
            defaultValue={searchParams.get("type") || "national"}
            onValueChange={(e) => {
              searchParams.set("type", e);
              searchParams.set("page", 1);
              setSearchParams(searchParams);
            }}
            className="w-[400px]"
          >
            <TabsList className="grid h-12 w-[120%] grid-cols-2">
              <TabsTrigger value="national" className="h-10">
                Événements Nationaux
              </TabsTrigger>
              <TabsTrigger value="international" className="h-10">
                Événements Internationaux
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
        <div className="flex-1 overflow-auto">
          <EventsTable />
        </div>
        <div className="mt-auto">
          {<Paginator totalPages={totalPages} isPending={isPending} />}
        </div>
      </div>
    </div>
  );
}
