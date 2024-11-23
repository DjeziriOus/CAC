import { Suspense } from "react";
import { defer, Await, useLoaderData } from "react-router-dom";
import Question from "../../../components/ui/Question";
import { getMyQuestions } from "@/services/apiQuestions";
import SkeletonLoader from "@/components/ui/SkeletonQuestion";

function MyQuestions() {
  const { questions } = useLoaderData();

  return (
    <div className="my-10 flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
      <Suspense
        fallback={
          <div>
            <SkeletonLoader></SkeletonLoader>
          </div>
        }
      >
        <Await resolve={questions}>
          {(loadedQuestions) =>
            loadedQuestions.map((q) => <Question question={q} key={q.id} />)
          }
        </Await>
      </Suspense>
    </div>
  );
}

export async function loader() {
  const questionsPromise = getMyQuestions();
  return defer({ questions: questionsPromise });
}

export default MyQuestions;
