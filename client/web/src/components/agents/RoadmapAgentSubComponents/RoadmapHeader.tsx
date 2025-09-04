import React from "react";

interface RoadmapHeaderProps {
  title: string;
  completedCount: number;
  totalTopics: number;
}

const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({ title, completedCount, totalTopics }) => {
  const progressPercent = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <div className="max-w-md mx-auto mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress: {completedCount}/{totalTopics}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapHeader;