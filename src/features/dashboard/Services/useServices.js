import { getServices, getQuestionsAPI } from "@/services/apiQuestions";
import { QUESTIONS_PER_PAGE } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useServices() {
  // useEffect(() => {

  // }, []);
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const {
    isPending,
    data: services,
    error,
  } = useQuery({
    queryKey: ["services", page],
    queryFn: () => getServices(page),
  });

  // const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  // const nextPage = page + 1;
  // const prevPage = page - 1;
  // if (page < totalPages)
  //   queryClient.prefetchQuery({
  //     queryKey: ["questions", questionsType, nextPage],
  //     queryFn: () => getQuestionsAPI(questionsType, nextPage),
  //   });

  // if (page > 1)
  //   queryClient.prefetchQuery({
  //     queryKey: ["questions", questionsType, prevPage],
  //     queryFn: () => getQuestionsAPI(questionsType, prevPage),
  //   });
  return { services, isPending, error };
}
