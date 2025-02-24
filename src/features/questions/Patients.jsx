import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TabsSkeleton from "@/components/ui/tabsSkeleton";
import TabSwitcher from "@/components/ui/TabSwitcher";
import { getMyQuestions, getRecentQuestions } from "@/services/apiQuestions";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useSearchParams } from "react-router-dom";
import { fetchUser } from "../user/userSlice";
const fullTabs = [
  { name: "Mes Questions", link: "my" },
  { name: "Questions les plus récentes", link: "recents" },
  { name: "Ajouter une question", link: "ajouter" },
];

const defaultTabs = [{ name: "Questions les plus récentes", link: "recents" }];

function Patients() {
  const [tabs, setTabs] = useState(defaultTabs);
  const targetRef = useRef(null);
  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { status } = useSelector((state) => state.user);
  const questionType = location.pathname.includes("/patients/")
    ? "patient"
    : "etudiant";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser()).then((e) => {
      if (!e.payload.id || e.payload.role !== questionType) {
        setTabs(defaultTabs);
      } else {
        setTabs(fullTabs);
      }
    });
  }, [questionType, dispatch]);

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
        {status === "loadingUser" ? (
          <TabsSkeleton />
        ) : (
          <TabSwitcher tabs={tabs} />
        )}
        {/* {isLoading && <Loader />} */}
        <Separator />
        <Outlet />
      </div>
    </div>
  );
}

export async function myQuestionsLoader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const type = url.pathname.includes("patients") ? "patient" : "etudiant";
  const dataPromise = getMyQuestions(page, type);
  return {
    questions: dataPromise.then((data) => data.questions),
    totalPagesPromise: dataPromise.then((data) => data.totalPages),
  };
}
export async function recentQuestionsLoader({ request }) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const paramType = url.searchParams.get("type");
  let type = url.pathname.includes("patient") ? "patient" : "etudiant";

  const dataPromise = getRecentQuestions(page, paramType ? paramType : type); // This returns a promise
  return {
    questions: dataPromise.then((data) => data.questions),
    totalPagesPromise: dataPromise.then((data) => data.totalPages),
  };
}
export default Patients;
