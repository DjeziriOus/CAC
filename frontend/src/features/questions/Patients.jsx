import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import TabSwitcher from "@/components/ui/TabSwitcher";
import { getMyQuestions, getRecentQuestions } from "@/services/apiQuestions";
// import Questionaire from "@/components/ui/Questionaire";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import {
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
const tabs = [
  { name: "Mes Questions", link: "my?page=1" },
  { name: "Questions les plus récentes", link: "recents?page=1" },
  { name: "Ajouter une question", link: "ajouter" },
];

function Patients() {
  const targetRef = useRef(null);
  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
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
        {/* {isLoading && <Loader />} */}
        <Separator />
        <Outlet />
      </div>
    </div>
  );
}

export async function myQuestionsLoader() {
  return {
    questions: getMyQuestions(),
  };
}
export async function recentQuestionsLoader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const dataPromise = getRecentQuestions(page); // This returns a promise

  return {
    questions: dataPromise.then((data) => data.questions),
    totalPages: dataPromise.then((data) => data.totalPages),
  };
}
export default Patients;
