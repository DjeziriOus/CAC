"use client";

import EventForm from "@/components/event-form";
import AjouterEvenementForm from "./AjouterEvenementForm.v2";

export default function AjouterEvenement({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Ajouter un événement</h1>
      <AjouterEvenementForm />
    </div>
  );
}
