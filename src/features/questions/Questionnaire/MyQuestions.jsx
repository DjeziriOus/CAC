import { Suspense, useEffect } from "react";
import { Await, useNavigate } from "react-router-dom";
import Question from "../../../components/ui/Question";

import SkeletonLoader from "@/components/ui/SkeletonQuestion";

import { EmptyMyQuestions } from "@/components/ui/EmptyMyQuestions";

import Paginator from "@/components/paginator-v2";

import { useMyQuestions } from "@/features/dashboard/Questions/useMyQuestions";
import { useTotalPagesMyQuestions } from "@/features/dashboard/Questions/useTotalPagesMyQuestions";
import { useUser } from "@/features/user/useUser";

function MyQuestions() {
  // const navigate = useNavigate();
  // const { user, isSuccess } = useUser();
  // const [searchParams, setSearchParams] = useSearchParams();
  // useEffect(() => {
  //   if (user?.role && user?.role !== searchParams.get("type")) {
  //     if (isSuccess && (!user?.role || user?.role === "admin")) navigate("/");
  //     searchParams.set("type", user?.role);
  //   }
  //   searchParams.delete("page");
  //   setSearchParams(searchParams);
  // }, [searchParams, setSearchParams, user?.role, navigate, isSuccess]);
  const { myQuestions: questions, isPending } = useMyQuestions();
  const { totalPages, isPending: isPendingTotalPages } =
    useTotalPagesMyQuestions();
  const { user, isPending: isPendingUser, isSuccess } = useUser();
  const navigate = useNavigate();
  const questionsType = location.pathname.includes("patient")
    ? "patient"
    : "etudiant";
  // const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;
    if (user?.role !== questionsType && isSuccess) {
      navigate("/");
    }
  }, [questionsType, user, navigate, isSuccess]);
  if (isPending || isPendingUser) {
    return (
      <div className="my-14 flex w-full flex-col items-center">
        <div className="mb-10 w-full">
          <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
            {isPending ? (
              <SkeletonLoader />
            ) : (
              (questions.length == 0 && <EmptyMyQuestions />) ||
              questions.map((q) => <Question question={q} key={q.id} />)
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="my-14 flex w-full flex-col items-center">
      <div className="mb-10 w-full">
        <Suspense
          fallback={
            <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
              <SkeletonLoader />
            </div>
          }
        >
          <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
            <Await resolve={questions} errorElement={<SkeletonLoader />}>
              {(loadedData) => {
                if (loadedData.length == 0) return <EmptyMyQuestions />;
                return (
                  <div className="flex flex-col gap-4">
                    {loadedData.map((q) => (
                      <Question question={q} key={q.id} />
                    ))}
                  </div>
                );
              }}
            </Await>
          </div>
        </Suspense>
      </div>
      <Paginator totalPages={totalPages} isPending={isPendingTotalPages} />
    </div>
  );
}

export default MyQuestions;
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
