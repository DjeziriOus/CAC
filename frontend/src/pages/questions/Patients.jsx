import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TabSwitcher from "@/components/ui/TabSwitcher";
// import Questionaire from "@/components/ui/Questionaire";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { Outlet, ScrollRestoration, useLoaderData } from "react-router-dom";
const tabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];

function Patients() {
  const targetRef = useRef(null);
  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="mt-16 bg-lgt-1">
      <div className="flex h-[38rem] w-full items-center justify-center bg-[url('/src/images/Patients.png')] bg-cover bg-center">
        <div className="mx-auto flex w-[1200px] justify-between">
          <div></div>
          <div className="flex w-[40%] flex-col items-center justify-center gap-6 text-white">
            <h2 className="text-[2.5rem] font-bold tracking-wide">
              Espace des patients
            </h2>
            <p className="text-lg font-normal leading-[1.7] text-white">
              Vous avez des interrogations ou des préoccupations concernant
              votre santé ? Écrivez-nous simplement votre question, et l’un de
              nos médecins professionnels se fera un plaisir de vous répondre.
              Nous sommes là pour vous offrir des conseils fiables et
              personnalisés afin de vous accompagner au mieux. N’hésitez pas,
              votre bien-être est notre priorité.
            </p>
            <Button className="bg-blk" onClick={scrollToSection}>
              Obtenir une réponse maintenant
              <ArrowDown />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={targetRef}
        className="mx-auto flex w-[1000px] flex-col items-center justify-center bg-lgt-1 pt-16"
      >
        <TabSwitcher tabs={tabs} />
        <Separator />
        <Outlet />
      </div>
      export default Questionaire;
    </div>
  );
}

export default Patients;
