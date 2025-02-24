function SkeletonUser() {
  return (
    <div className="flex h-[48px] w-[150.4px] items-center">
      <div className="mx-3 h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
      <div className="flex flex-col items-start space-y-2">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}

export default SkeletonUser;
