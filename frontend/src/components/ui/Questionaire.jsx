import Questions from "@/pages/Questions";
import { Separator } from "./separator";
import TabSwitcher from "./TabSwitcher";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import img1 from "@/images/pfp/img-1.png";
import img2 from "@/images/pfp/img-2.png";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";
const tabs = [
  "Mes Questions",
  "Questions les plus récentes",
  "Questions Fréquentes",
  "Ajouter une question",
];

function Questionaire() {
  return (
    <div className="mx-auto flex w-[1000px] flex-col items-center justify-center bg-lgt-1">
      <TabSwitcher tabs={tabs} />
      <Separator />
      <div className="flex h-[25rem] w-full flex-col gap-4 overflow-y-scroll p-3">
        <div className="shadow-question space-y-2 rounded-lg bg-white px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Avatar className="aspect-square h-8 w-auto">
              <AvatarImage src={img1} alt="@shadcn" className="object-cover" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">Islem Charaf Eddine</span>
          </div>
          <p className="text-xs">
            Est-il sécuritaire de pratiquer une activité sportive après une
            opération ?
          </p>
          <Separator className="bg-black-10" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-blk-60">16/11/2024 - 1:23 PM</span>
            <Button className="bg-blue-20 text-blue-2">
              Pas encore répondu
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="shadow-question space-y-2 rounded-lg bg-white px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Avatar className="aspect-square h-8 w-auto">
                <AvatarImage
                  src={img1}
                  alt="@shadcn"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">Islem Charaf Eddine</span>
            </div>
            <p className="text-xs">
              Est-il sécuritaire de pratiquer une activité sportive après une
              opération ?
            </p>
            <Separator className="bg-black-10" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blk-60">16/11/2024 - 1:23 PM</span>
              {/* <Button className="bg-blue-20 text-blue-2">
                Pas encore répondu
              </Button> */}
            </div>
          </div>
          <div className="shadow-question bg-blue-20 space-y-2 rounded-lg px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Avatar className="aspect-square h-8 w-auto">
                <AvatarImage
                  src={img2}
                  alt="@shadcn"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">Dr. Allag Aymen</span>
            </div>
            <p className="text-xs">
              Oui, les maux de tête légers sont un effet secondaire courant
              après certains vaccins. Ils sont généralement temporaires et
              disparaissent en un ou deux jours. Cependant, si le mal de tête
              persiste ou s’accompagne d’autres symptômes graves comme une forte
              fièvre, consultez un médecin immédiatement.
            </p>
            <Separator className="bg-black-10" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blk-60">16/11/2024 - 1:23 PM</span>
              <Button className="bg-blue-2 text-white">
                Cacher <ArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionaire;
