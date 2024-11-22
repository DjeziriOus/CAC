import { Separator } from "./separator";
import TabSwitcher from "./TabSwitcher";
import { Outlet, useLoaderData } from "react-router-dom";
import Question from "./Question";

const tabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];

function Questionaire() {
  return (
    <div className="mx-auto flex w-[1000px] flex-col items-center justify-center bg-lgt-1">
      <TabSwitcher tabs={tabs} />
      <Separator />
      <Outlet />
    </div>
  );
}

export default Questionaire;
