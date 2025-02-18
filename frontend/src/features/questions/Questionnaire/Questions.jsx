import { Suspense, useState } from "react";
// import {  } from "react-router";
import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Question from "../../../components/ui/Question";
import { getMyQuestions } from "@/services/apiQuestions";
import SkeletonLoader from "@/components/ui/SkeletonQuestion";
import ErrorElement from "@/components/ui/ErrorElement";
import { useSelector } from "react-redux";
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

function Questions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { questions, totalPages } = useLoaderData();
  // console.log(data);
  // const questions = data.questions;
  const [error, setError] = useState(false);
  const { user, status } = useSelector((state) => state.user);

  // const handleRetry = () => {
  //   nav("/questions/my");
  // };
  const navigate = useNavigate();

  const currentPage = searchParams.get("page") || 1;
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`?page=${newPage}`);
    }
  };

  const renderPagination = () => {
    let pages = [];

    if (totalPages <= 5) {
      // Show all pages if totalPages is 5 or less
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      // Show 1, 2, ..., totalPages-1, totalPages
      pages = [1, 2, "...", totalPages - 1, totalPages];
    }

    return pages.map((page, index) => (
      <PaginationItem key={index}>
        {page === "..." ? (
          <span className="px-3 py-1">...</span>
        ) : (
          <PaginationLink
            active={page === currentPage}
            // onClick={() => handlePageChange(page)}
            to={`?page=${page}`}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ));
  };
  // if (error) {
  //   return <ErrorElement errorMessage={error} onRetry={handleRetry} />;
  // }

  return (
    <div className="my-10 w-full space-y-10">
      <Suspense
        fallback={
          // <div>
          <SkeletonLoader />
        }
      >
        <div className="flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
          <Await resolve={questions} errorElement={<SkeletonLoader />}>
            {(loadedData) => {
              if (loadedData.questions.length == 0) return <EmptyQuestions />;
              console.log(loadedData);
              // const lQuestions = [loadedData.questions];
              return (
                <div className="flex flex-col gap-4">
                  {loadedData.questions.map((q) => (
                    <Question question={q} key={q.id} />
                  ))}
                </div>
              );
            }}
          </Await>
        </div>
      </Suspense>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="?page=1" />
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem> */}
          {renderPagination()}
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// export async function loader() {
//   return {
//     questions: await getMyQuestions(),
//   };
// }

export default Questions;
