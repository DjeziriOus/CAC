import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Question from "../../../components/ui/Question";

import SkeletonLoader from "@/components/ui/SkeletonQuestion";

import { EmptyMyQuestions } from "@/components/ui/EmptyMyQuestions";

import { useQuestions } from "@/features/dashboard/Questions/useQuestions";

import { useTotalPagesRecentQuestions } from "@/features/dashboard/Questions/useTotalPagesRecentQuestions";
import { ErrorQuestions } from "@/components/ui/ErrorQuestions";
import { useUser } from "@/features/user/useUser";
import { EmptyQuestionsNoAdd } from "@/components/ui/EmptyQuestionsNoAdd";
import { useIsFetching } from "@tanstack/react-query";
import Paginator from "@/components/paginator-v2";

function RecentQuestions() {
  const { user } = useUser();
  const questionsType = location.pathname.includes("patient")
    ? "patient"
    : "etudiant";
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    type: questionsType,
  });
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let updated = false;

    if (!newParams.get("page")) {
      newParams.set("page", "1");
      updated = true;
    }
    if (!newParams.get("type")) {
      newParams.set("type", questionsType);
      updated = true;
    }

    if (updated) {
      setSearchParams(newParams, { replace: true });
    }
  }, []);

  // {id: 1, nom: 'DJEZIRI', prenom: 'Oussama', email: 'Aymen@esi-sba.dz', role: 'etudiant'}
  // useEffect(() => {
  //   searchParams.get("page") || searchParams.set("page", 1);
  //   setSearchParams(searchParams);
  // }, [searchParams, setSearchParams]);
  // const { questions } = useLoaderData();
  const { questions, isPending, error } = useQuestions();
  const { totalPages, isPending: isPendingTotalPages } =
    useTotalPagesRecentQuestions();
  // const isFetchingQuestions = useIsFetching({ queryKey: ["questions"] });

  // useTotalPagesRecentQuestions();
  return (
    <div className="my-14 flex w-full flex-col items-center">
      <div className="mb-10 w-full">
        <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
          {isPending ? (
            <SkeletonLoader />
          ) : error ? (
            <ErrorQuestions />
          ) : questions.length == 0 ? (
            questionsType == user?.role ? (
              <EmptyMyQuestions />
            ) : (
              <EmptyQuestionsNoAdd />
            )
          ) : (
            questions.map((q) => <Question question={q} key={q.id} />)
          )}
        </div>
      </div>
      <Paginator totalPages={totalPages} isPending={isPendingTotalPages} />
    </div>
  );
}

export default RecentQuestions;

/*

      <Suspense
        fallback={
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        }
      >
        <Await
          resolve={totalPages}
          errorElement={
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          }
        >
          {(loadedTotalPages) => {
            let pages = [];
            if (loadedTotalPages <= 5) {
              // Show all pages if loadedTotalPages is 5 or less
              pages = Array.from(
                { length: loadedTotalPages },
                (_, index) => index + 1,
              );
            } else {
              // Show 1, 2, ..., loadedTotalPages-1, loadedTotalPages
              pages = [1, 2, "...", loadedTotalPages - 1, loadedTotalPages];
            }
            console.log(pages);
            return (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  {pages.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <LinkButton
                          isActive={page === currentPage}
                          // onClick={() => handlePageChange(page)}
                          to={`?page=${page}`}
                        >
                          {page}
                        </LinkButton>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            );
          }}
        </Await>
      </Suspense>

*/
// if (isPending || isFetchingQuestions) {
//   return (
//     <div className="my-14 flex w-full flex-col items-center">
//       <div className="mb-10 w-full">
//         <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
//           {isPending || isFetchingQuestions ? (
//             <SkeletonLoader />
//           ) : (
//             (questions.length == 0 && <EmptyMyQuestions />) ||
//             questions.map((q) => <Question question={q} key={q.id} />)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// return (
//   <div className="my-14 flex w-full flex-col items-center">
//     <div className="mb-10 w-full">
//       <Suspense
//         fallback={
//           <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
//             <SkeletonLoader />
//           </div>
//         }
//       >
//         <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
//           {/* <Await resolve={questions} errorElement={<SkeletonLoader />}>
//             {(loadedData) => {
//               if (!loadedData?.length) return <EmptyMyQuestions />;
//               return (
//                 <div className="flex flex-col gap-4">
//                   {loadedData.map((q) => (
//                     <Question question={q} key={q.id} />
//                   ))}
//                 </div>
//               );
//             }}
//           </Await> */}
//           {isPending || isFetchingQuestions > 0 ? (
//             <SkeletonLoader />
//           ) : error ? (
//             <ErrorQuestions />
//           ) : !questions.length ? (
//             questionsType == user?.role ? (
//               <EmptyMyQuestions />
//             ) : (
//               <EmptyQuestionsNoAdd />
//             )
//           ) : (
//             questions.map((q) => <Question question={q} key={q.id} />)
//           )}
//         </div>
//       </Suspense>
//     </div>
//     <Paginator totalPages={totalPages} isPending={isPendingTotalPages} />
//   </div>
// );
