export const CardSkeleton = () => (
  <div className="max-w-[75%] rounded-lg p-4 shadow-md bg-gray-100 mb-2 animate-pulse">
    <div className="h-5 bg-gray-300 rounded mb-2 w-1/2"></div>
    <div className="h-3 bg-gray-300 rounded mb-1 w-full"></div>
    <div className="h-3 bg-gray-300 rounded mb-1 w-3/4"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
  </div>
);
