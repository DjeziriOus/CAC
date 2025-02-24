import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
} from "./ui/pagination";
import {
  Await,
  NavLink,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setTotalPages,
} from "@/features/questions/questionSlice";
import PaginatorSkeleton from "./ui/PaginatorSkeleton";

function Paginator({ variant = null }) {
  const { currentPage, totalPages } = useSelector((state) => state.question);
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalPagesPromise } = useLoaderData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [currentPage, setCurrentPage] = useState(null);
  useEffect(() => {
    const page = searchParams.get("page");
    const type = searchParams.get("type");
    if (!page) {
      setSearchParams({ page: 1, type: type });
    }
    dispatch(setCurrentPage(Number(page)));
    totalPagesPromise.then((totalPages) => {
      console.log(totalPages);
      dispatch(setTotalPages(totalPages));
    });
  }, [totalPagesPromise, dispatch, searchParams, setSearchParams]);

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
    <div>
      {!totalPages ? (
        <Suspense fallback={<PaginatorSkeleton />}>
          <Await resolve={totalPagesPromise}>
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
                  to={
                    currentPage < totalPages ? `?page=${currentPage + 1}` : "#"
                  }
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
          </Await>
        </Suspense>
      ) : (
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

export default Paginator;
