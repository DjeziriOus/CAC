"use client";
import AjouterServiceForm from "./AjouterServiceForm";

export default function AjouterService({ params }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Ajouter un service</h1>
      <AjouterServiceForm />
    </div>
  );
}
