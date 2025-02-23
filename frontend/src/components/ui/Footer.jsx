import { Separator } from "@radix-ui/react-separator";
import logo from "@/images/CAClogo.svg";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
const content = [
  {
    id: 1,
    section: "Activités hospitalière",
    subSections: [
      { name: "Service d'hématologie", link: "" },
      { name: "Service thérapie cellulaire", link: "" },
      { name: "", link: "" },
    ],
  },
  {
    id: 2,
    section: "Activité universitaires",
    subSections: [
      { name: "Conférences des cours", link: "" },
      { name: "Formation médicale continue", link: "" },
      { name: "", link: "" },
    ],
  },
  {
    id: 2,
    section: "Q&A",
    subSections: [
      { name: "Espace des patients", link: "" },
      { name: "Espace des étudiants", link: "" },
      { name: "Espace international", link: "" },
    ],
  },
];
function Footer() {
  return (
    <div className="space-y-5 bg-main-10 py-7">
      <div className="mx-auto flex w-[80%] justify-center gap-20">
        <div className="space-y-8">
          <img src={logo} className="h-10" />
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-blk-60">Batna centre ville , Algérie</span>
            <span>Téléphone : (+213) 33 98 07 47 </span>
          </div>
          <div className="flex gap-8">
            <FaFacebookF size={20} />
            <RiInstagramFill size={20} />
            <FaXTwitter size={20} />
            <FaLinkedinIn size={20} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-20 py-10">
          {content.map((e, i) => {
            return (
              <div key={i} className="space-y-4">
                <h1 className="text-xs font-semibold text-blk">{e.section}</h1>
                <div className="flex flex-col gap-2">
                  {e.subSections.map((sub, i) => {
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <a href={sub.link} className="text-xs text-blk-70">
                          {sub.name}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mx-auto flex justify-center">
        <Separator
          orientation="horizontal"
          className="h-[1px] w-[1050px] bg-[#0621261A]"
        />
      </div>
      <div className="mx-auto flex w-[1050px] justify-between text-xs text-blk-40">
        <span>© 2024 Centre anti cancer Batna - Tous droits réservés</span>
        <div className="flex gap-4">
          <span>Politique de confidentialité</span>
          <span>Conditions d&apos;utilisation</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
