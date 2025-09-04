export const CardSkeleton = () => (
  <div className="flex items-start gap-3 max-w-[75%] mb-2 animate-pulse self-start">
    <img
      src="/teacher.png"
      alt="AI"
      className="w-8 h-8 rounded-full flex-shrink-0"
    />

    <div className="flex-1 rounded-lg p-4 shadow-md bg-gray-100 space-y-2">
      <div className="h-5 bg-gray-300 rounded w-1/2"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);
