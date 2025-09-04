import React from "react";
import { ChevronRight, ChevronDown, Target, Play, Trophy } from "lucide-react";
import RoadmapTopic from "./RoadmapTopic";

interface RoadmapLevelProps {
  levelName: string;
  topics: any[];
  levelIdx: number;
  levelColors: string[];
  expandedLevels: Set<string>;
  expandedTopics: Set<string>;
  expandedSections: Set<string>;
  completedTopics: Set<string>;
  toggleLevel: (levelName: string) => void;
  toggleTopic: (levelName: string, topicName: string) => void;
  toggleSection: (levelName: string, topicName: string, sectionName: string) => void;
  toggleCompletion: (levelName: string, topicName: string, e: React.MouseEvent) => void;
  chatId: string;
  addMessage: any;
  setActiveVideo: (video: any) => void;
}

const RoadmapLevel: React.FC<RoadmapLevelProps> = ({
  levelName,
  topics,
  levelIdx,
  levelColors,
  expandedLevels,
  expandedTopics,
  expandedSections,
  completedTopics,
  toggleLevel,
  toggleTopic,
  toggleSection,
  toggleCompletion,
  chatId,
  addMessage,
  setActiveVideo,
}) => {
  const levelIcons = [
    <Play className="w-5 h-5" />,
    <Target className="w-5 h-5" />,
    <Trophy className="w-5 h-5" />,
  ];

  const isLevelExpanded = expandedLevels.has(levelName);
  const levelColor = levelColors[levelIdx % levelColors.length];
  const levelCompleted = topics.filter((topic) =>
    completedTopics.has(`${levelName}-${topic.topic}`)
  ).length;

  return (
    <div className="relative">
      <div className="flex items-start">
        <div className="ml-4 flex-1">
          <button
            onClick={() => toggleLevel(levelName)}
            className={`
              cursor-pointer group flex items-center w-full px-4 py-3 rounded-lg shadow-md hover:shadow-lg 
              transition-all duration-200 bg-gradient-to-r ${levelColor} text-white font-semibold
              hover:scale-[1.02] transform
            `}
          >
            <span className="mr-3">
              {levelIcons[levelIdx % levelIcons.length]}
            </span>
            <span className="flex-1 text-left">{levelName}</span>
            <span className="text-xs opacity-90 mr-3">
              {levelCompleted}/{topics?.length || 0} completed
            </span>
            {isLevelExpanded ? (
              <ChevronDown className="w-5 h-5 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-5 h-5 transition-transform duration-200" />
            )}
          </button>

          {isLevelExpanded && topics && topics.length > 0 && (
            <div className="mt-4 ml-8 space-y-3">
              {topics.map((topic, topicIdx) => (
                <RoadmapTopic
                  key={topicIdx}
                  topic={topic}
                  topicIdx={topicIdx}
                  levelName={levelName}
                  expandedTopics={expandedTopics}
                  expandedSections={expandedSections}
                  completedTopics={completedTopics}
                  toggleTopic={toggleTopic}
                  toggleSection={toggleSection}
                  toggleCompletion={toggleCompletion}
                  chatId={chatId}
                  addMessage={addMessage}
                  setActiveVideo={setActiveVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapLevel;
