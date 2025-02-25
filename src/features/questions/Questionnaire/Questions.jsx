import { Suspense, useEffect, useState } from "react";
import {
  Await,
  Navigate,
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Question from "../../../components/ui/Question";
import { getMyQuestions } from "@/services/apiQuestions";
import SkeletonLoader from "@/components/ui/SkeletonQuestion";
import ErrorElement from "@/components/ui/ErrorElement";
import { useDispatch, useSelector } from "react-redux";
import { EmptyMyQuestions } from "@/components/ui/EmptyMyQuestions";
import { EmptyQuestions } from "@/components/ui/EmptyQuestions";
import { toast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import LinkButton from "@/components/ui/LinkButton";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { use } from "react";
import Paginator from "@/components/paginator";
import { fetchUser } from "@/features/user/userSlice";
import { useQuestions } from "@/features/dashboard/useQuestions";

function Questions() {
  // const { questions } = useLoaderData();
  const { questions, isPending, error, page } = useQuestions();

  const { user, status } = useSelector((state) => state.user);

  const location = useLocation();
  const questionType = location.pathname.includes("/patients/")
    ? "patient"
    : "etudiant";
  // Check if "my" is in the current URL path
  const containsMy = location.pathname.includes("my");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser()).then((e) => {
        if (containsMy && (!e.payload.id || e.payload.role !== questionType)) {
          navigate("/");
        }
      });
    }
  }, [questionType, dispatch, navigate, user, containsMy]);
  if (isPending) {
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
      <Paginator />
    </div>
  );
}

export default Questions;
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
