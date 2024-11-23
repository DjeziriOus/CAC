import { Suspense, useState } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import Question from "../../../components/ui/Question";
import { getMyQuestions } from "@/services/apiQuestions";
import SkeletonLoader from "@/components/ui/SkeletonQuestion";
import ErrorElement from "@/components/ui/ErrorElement";

function MyQuestions() {
  let { questions } = useLoaderData();
  const [error, setError] = useState(false);

  const nav = useNavigate();
  const handleRetry = () => {
    nav("/questions/my");
  };

  // if (error) {
  //   return <ErrorElement errorMessage={error} onRetry={handleRetry} />;
  // }

  return (
    <div className="my-10 flex h-[25rem] w-full flex-col gap-8 overflow-y-scroll p-3">
      <Suspense
        fallback={
          // <div>
          <SkeletonLoader />
        }
      >
        <Await
          resolve={questions}
          errorElement={<ErrorElement onRetry={handleRetry} />}
        >
          {(loadedQuestions) =>
            loadedQuestions.map((q) => <Question question={q} key={q.id} />)
          }
        </Await>
      </Suspense>
    </div>
  );
}

export async function loader() {
  return {
    questions: getMyQuestions(),
  };
}

export default MyQuestions;
