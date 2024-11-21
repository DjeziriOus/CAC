import OrangeIcon from "@/components/ui/OrangeIcon";

import Ribbon from "@/images/icons/048-ribbon.svg";
import Hospital from "@/images/icons/004-hospital-bed.svg";
import Pills from "@/images/icons/005-medicine.svg";
import Shield from "@/images/icons/012-shield.svg";
import Siren from "@/images/icons/013-siren.svg";
import Soap from "@/images/icons/030-soap.svg";
const content = [
  {
    id: 1,
    title: "Accompagnement Psychologique",
    description:
      "Nous proposons un soutien psychologique pour accompagner nos patients dans leur parcours de soins, pour améliorer leur bien-être tout au long du traitement.",
    icon: Ribbon,
  },
  {
    id: 2,
    title: "Soins Personnalisés",
    description:
      "Nous offrons des traitements adaptés à vos besoins spécifiques, garantissant un parcours de soin unique pour chaque patient.",
    icon: Hospital,
  },
  {
    id: 3,
    title: "Support Médical Continu",
    description:
      "Notre équipe médicale est disponible 24h/24 pour vous fournir un suivi constant et une prise en charge optimale, à chaque étape de votre traitement.",
    icon: Pills,
  },
  {
    id: 4,
    title: "Accessibilité et Réactivité",
    description:
      "Nos consultations sont accessibles rapidement et nos équipes réactives, pour vous offrir une prise en charge immédiate, sans délai.",
    icon: Siren,
  },
  {
    id: 5,
    title: "Hygiène et Sécurité Maximales",
    description:
      "Notre établissement respecte les normes les plus strictes en matière d’hygiène et de sécurité pour vous offrir un environnement propre et sécurisé, 24h/24.",
    icon: Shield,
  },
  {
    id: 6,
    title: "Nettoyage 24h/24 et 7j/7",
    description:
      "Nous nous soucions d'avoir des chambres propres pour nos patients.",
    icon: Soap,
  },
];
function Confiance() {
  return (
    <div className="mx-auto flex w-[83%] flex-col justify-center xl:gap-10 xl:py-14 2xl:gap-20 4xl:py-24">
      <h1 className="text-center text-[2.7rem] font-bold text-blk">
        Pourquoi Nous Faire Confiance ?
      </h1>
      <div className="grid grid-cols-3 gap-x-28 gap-y-5">
        {content.map((e, i) => (
          <div key={i} className="space-y-4">
            <OrangeIcon src={e.icon} h={"2.35rem"} p={"1.7rem"} />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold text-blk">{e.title}</h1>
              <p className="text-[1.1rem] leading-[1.3] text-blk-70">
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Confiance;
