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
import { useUser } from "../user/useUser";

function QuestionsForum() {
  // const [tabs, setTabs] = useState(defaultTabs);
  const targetRef = useRef(null);
  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { isPending, user, error, allowedTabs } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    searchParams.get("page") || searchParams.set("page", 1);
    searchParams.get("type") || searchParams.set("type", "patient");
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);
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
        {isPending ? <TabsSkeleton /> : <TabSwitcher tabs={allowedTabs} />}
        {/* {isLoading && <Loader />} */}
        <Separator />
        <Outlet />
      </div>
    </div>
  );
}

export default QuestionsForum;
