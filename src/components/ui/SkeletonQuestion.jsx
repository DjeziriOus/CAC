import { Separator } from "./separator";

const SkeletonLoader = () => {
  return (
    <div className="w-full space-y-10">
      {/* Skeleton for each question */}
      {[1, 2].map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md"
        >
          {/* Top part: Question user and content */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
            <div className="flex flex-col space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
              <div className="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          {/* Question content */}
          <div className="h-5 w-full animate-pulse rounded bg-gray-300"></div>
          {/* Button area */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="h-3 w-36 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-36 animate-pulse rounded-lg bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
