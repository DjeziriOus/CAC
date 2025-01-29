function SkeletonUser() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
      <div className="flex flex-col items-start space-y-2">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
        <div className="h-3 w-28 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}

export default SkeletonUser;
