import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

export default function Services() {
  const targetRef = useRef(null);

  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="bg- mx-auto mt-24 min-h-screen max-w-[60vw]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Nos Services pour une Prise en Charge Optimale
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-blk-60">
          Le Centre Anti-Cancer de Batna met à votre disposition une large gamme
          de services spécialisés pour assurer une prise en charge complète et
          personnalisée. De la consultation initiale aux traitements innovants,
          en passant par le suivi et l&apos;accompagnement des patients, notre
          équipe médicale veille à offrir des soins de qualité, adaptés aux
          besoins de chacun.
        </p>
        <Button className="bg-primary text-white" onClick={scrollToSection}>
          Découvrir nos services <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* First Floor Section */}
      <section className="container mx-auto px-4 py-16" ref={targetRef}>
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Premier étage
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="La Réception"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                La Réception
              </h3>
              <p className="text-blk-60">
                Réception des patients triés en service ou en isolement, ainsi
                que le suivi des patients candidats à une greffe allogénique des
                CSH.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Laboratoire"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                Laboratoire
              </h3>
              <p className="text-blk-60">
                Réalisation des examens cytologiques à partir de différents
                prélèvements (ponction lombaire, myélogramme, frottis sanguin,
                ponction ganglionnaire).
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="HDJ (Hôpital de jour)"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                HDJ (Hôpital de jour)
              </h3>
              <p className="text-blk-60">
                Prise en charge des patients pour les cures courtes de
                chimiothérapie (une cure par exemple, une cure traitant JH, J8,
                J15).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second Floor Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Deuxième étage
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Unité conventionnelle"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                Unité conventionnelle
              </h3>
              <p className="text-blk-60">
                Accueil des patients nécessitant des cures longues de
                chimiothérapie ou diagnostiqués ou un traitement symptomatique
                pour cas réfractaires.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Unité d'allogreffe"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                Unité d&apos;allogreffe
              </h3>
              <p className="text-blk-60">
                Actuellement fermée, qui sera ouverte lorsque les conditions
                seront favorables.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-lg">
            <img
              src="/placeholder.svg?height=200&width=300"
              alt="Unité de soins intensifs"
              width={300}
              height={200}
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-primary">
                Unité de soins intensifs (Isolement)
              </h3>
              <p className="text-blk-60">
                Patients atteints de leucémies aiguës dans la phase
                d&apos;induction du traitement. Patients susceptibles
                d&apos;aplasie profonde.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
