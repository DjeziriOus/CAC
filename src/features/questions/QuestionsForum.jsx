import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TabsSkeleton from "@/components/ui/TabsSkeleton";
import TabSwitcher from "@/components/ui/TabSwitcher";
import { getMyQuestions, getRecentQuestions } from "@/services/apiQuestions";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Outlet, useSearchParams } from "react-router-dom";

import { useUser } from "../user/useUser";

function QuestionsForum() {
  // const [tabs, setTabs] = useState(defaultTabs);
  const targetRef = useRef(null);
  const scrollToSection = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { isPending, user, error, allowedTabs } = useUser();

  return <Outlet />;
}

export default QuestionsForum;
