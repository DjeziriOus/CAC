const PaginatorSkeleton = () => {
  return (
    <div className="mx-auto flex w-[530px] items-center justify-between gap-2">
      {/* Previous button */}
      <div className="h-10 w-[114px] animate-pulse rounded-lg bg-gray-300"></div>

      {/* Page Numbers */}
      <div className="flex gap-2">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-300"></div>
      </div>

      {/* Next button */}
      <div className="h-10 w-[114px] animate-pulse rounded-lg bg-gray-300"></div>
    </div>
  );
};

export default PaginatorSkeleton;
