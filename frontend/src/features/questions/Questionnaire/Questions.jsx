import { Suspense, useEffect, useState } from "react";
import {
  Await,
  Navigate,
  NavLink,
  useLoaderData,
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
import {
  setCurrentPage,
  setTotalPages,
} from "@/features/questions/questionSlice";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Questions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { questions, totalPagesPromise } = useLoaderData();
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state) => state.questions);
  // Set totalPages once
  useEffect(() => {
    if (totalPages == null) {
      totalPagesPromise.then((value) => dispatch(setTotalPages(value)));
    }
    console.log(totalPages !== null);
    if (currentPage < 1 || (currentPage > totalPages && totalPages !== null)) {
      setSearchParams({ page: totalPages }, true);
      console.log("Page Invalide, Redirection en cours ...");
      toast({
        title: "Page Invalide, Redirection en cours ...",
        description: `Vous serez redirigé vers la dernière page`,
        variant: "destructive",
      });
      //   dispatch(setCurrentPage(totalPages));
    }
  }, [totalPagesPromise, totalPages, dispatch, currentPage, setSearchParams]);
  useEffect(() => {
    let page = Number(searchParams.get("page"));
    if (!page) {
      setSearchParams({ page: 1 }, true); // Reset to default
      page = Number(searchParams.get("page"));
    }
    if (page !== currentPage && totalPages !== null) {
      dispatch(setCurrentPage(page));
    }
  }, [searchParams, setSearchParams, currentPage, dispatch, totalPages]);

  const renderPagination = () => {
    if (!totalPages || totalPages < 2) return null; // No need for pagination if only one page
    let pages = [];
    // Always include first page
    pages.push(1);
    // Add `...` if currentPage is greater than 3
    if (currentPage > 3) {
      pages.push("...");
    }
    // Generate sliding window around currentPage
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    // Add `...` if currentPage is not near the end
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    // Always include last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex w-80 items-center justify-center gap-2">
        {pages.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <NavLink to={`?page=${page}`}>
                <Button variant={page == currentPage ? "default" : "outline"}>
                  {page}
                </Button>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    );
  };

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
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <NavLink
              to={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={currentPage === 1}
              replace
            >
              <Button variant="ghost">
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </Button>
            </NavLink>
            {renderPagination()}
            {/* next Button */}
            <NavLink
              to={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
              aria-disabled={currentPage === totalPages}
              replace
            >
              <Button variant="ghost">
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </NavLink>
          </PaginationContent>
        </Pagination>
      )}
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
