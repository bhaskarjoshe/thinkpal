import React from "react";
import { ChevronRight, ChevronDown, Book, CheckCircle, Circle } from "lucide-react";
import TopicSection from "./TopicSection";

interface RoadmapTopicProps {
  topic: any;
  topicIdx: number;
  levelName: string;
  expandedTopics: Set<string>;
  expandedSections: Set<string>;
  completedTopics: Set<string>;
  toggleTopic: (levelName: string, topicName: string) => void;
  toggleSection: (levelName: string, topicName: string, sectionName: string) => void;
  toggleCompletion: (levelName: string, topicName: string, e: React.MouseEvent) => void;
  chatId: string;
  addMessage: any;
  setActiveVideo: (video: any) => void;
}

const RoadmapTopic: React.FC<RoadmapTopicProps> = ({
  topic,
  topicIdx,
  levelName,
  expandedTopics,
  expandedSections,
  completedTopics,
  toggleTopic,
  toggleSection,
  toggleCompletion,
  chatId,
  addMessage,
  setActiveVideo,
}) => {
  const topicKey = `${levelName}-${topic.topic}`;
  const isTopicExpanded = expandedTopics.has(topicKey);
  const isCompleted = completedTopics.has(topicKey);

  return (
    <div className="relative">
      <div className="ml-8">
        <div
          className={`
            cursor-pointer flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 
            ${
              isCompleted
                ? "bg-green-50 border-2 border-green-200"
                : "bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300"
            }
          `}
        >
          <button
            onClick={(e) => toggleCompletion(levelName, topic.topic, e)}
            className="cursor-pointer mr-3 hover:scale-110 transition-transform duration-150"
            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
            )}
          </button>

          <button
            onClick={() => toggleTopic(levelName, topic.topic)}
            className="cursor-pointer flex items-center flex-1"
          >
            <Book
              className={`w-4 h-4 mr-2 ${
                isCompleted ? "text-green-600" : "text-blue-600"
              }`}
            />
            <span
              className={`flex-1 text-left font-medium ${
                isCompleted
                  ? "text-green-800 line-through"
                  : "text-gray-800"
              }`}
            >
              {topic.topic}
            </span>
            {isTopicExpanded ? (
              <ChevronDown
                className={`w-4 h-4 ${
                  isCompleted ? "text-green-600" : "text-blue-600"
                }`}
              />
            ) : (
              <ChevronRight
                className={`w-4 h-4 ${
                  isCompleted ? "text-green-600" : "text-blue-600"
                }`}
              />
            )}
          </button>
        </div>

        {isTopicExpanded && (
          <div className="mt-3 ml-6 space-y-2">
            <TopicSection
              topic={topic}
              topicKey={topicKey}
              levelName={levelName}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              chatId={chatId}
              addMessage={addMessage}
              setActiveVideo={setActiveVideo}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapTopic;
