import React, { useState } from "react";
import { Play } from "lucide-react";
import type { RoadmapAgentProps, RoadmapContent } from "../../types/types";
import { useChatStore } from "../../store/chatStore";
import { handleClick } from "../../utils/chatApiCall";
import VideoModal from "../VideoModal";
import RoadmapHeader from "./RoadmapAgentSubComponents/RoadmapHeader";
import RoadmapLevel from "./RoadmapAgentSubComponents/RoadmapLevel";

const RoadmapAgent = ({ component }: RoadmapAgentProps) => {
  const roadmap = component.content_json as RoadmapContent;

  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [activeVideo, setActiveVideo] = React.useState(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const { chatId, addMessage } = useChatStore();

  const toggleLevel = (levelName: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(levelName)) {
      newExpanded.delete(levelName);
      const newTopics = new Set(expandedTopics);
      const newSections = new Set(expandedSections);
      Object.values(roadmap.levels[levelName] || []).forEach((topic) => {
        newTopics.delete(`${levelName}-${topic.topic}`);
        ["subtopics", "examples", "resources", "outcome"].forEach((section) => {
          newSections.delete(`${levelName}-${topic.topic}-${section}`);
        });
      });
      setExpandedTopics(newTopics);
      setExpandedSections(newSections);
    } else {
      newExpanded.add(levelName);
    }
    setExpandedLevels(newExpanded);
  };

  const toggleTopic = (levelName: string, topicName: string) => {
    const key = `${levelName}-${topicName}`;
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
      const newSections = new Set(expandedSections);
      ["subtopics", "examples", "resources", "outcome"].forEach((section) => {
        newSections.delete(`${key}-${section}`);
      });
      setExpandedSections(newSections);
    } else {
      newExpanded.add(key);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleSection = (levelName: string, topicName: string, sectionName: string) => {
    const key = `${levelName}-${topicName}-${sectionName}`;
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCompletion = (levelName: string, topicName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${levelName}-${topicName}`;
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedTopics(newCompleted);
  };

  const levelColors = [
    "from-sky-300/80 via-sky-400/80 to-sky-500/80 border-sky-400",
    "from-sky-400/80 via-sky-500/80 to-sky-600/80 border-sky-500",
    "from-sky-500/80 via-sky-600/80 to-sky-700/80 border-sky-600",
  ];

  const activeRoadmap = roadmap?.levels ? roadmap : null;
  const totalTopics = Object.values(activeRoadmap?.levels || {}).flat().length;
  const completedCount = completedTopics.size;

  return (
    <div className="p-6 min-w-5xl mx-auto bg-white">
      <RoadmapHeader 
        title={component.title || "Learning Roadmap"}
        completedCount={completedCount}
        totalTopics={totalTopics}
      />

      <div className="space-y-6">
        {activeRoadmap?.levels &&
          Object.entries(activeRoadmap.levels).map(([levelName, topics], levelIdx) => (
            <RoadmapLevel
              key={levelName}
              levelName={levelName}
              topics={topics}
              levelIdx={levelIdx}
              levelColors={levelColors}
              expandedLevels={expandedLevels}
              expandedTopics={expandedTopics}
              expandedSections={expandedSections}
              completedTopics={completedTopics}
              toggleLevel={toggleLevel}
              toggleTopic={toggleTopic}
              toggleSection={toggleSection}
              toggleCompletion={toggleCompletion}
              chatId={chatId}
              addMessage={addMessage}
              setActiveVideo={setActiveVideo}
            />
          ))}
      </div>

      {activeVideo && (
        <VideoModal
          activeVideo={activeVideo}
          setActiveVideo={setActiveVideo}
        />
      )}

      <div className="mt-12 text-center">
        <button
          onClick={() =>
            handleClick(chatId, addMessage, "Explore more topics on " + component.title)
          }
          className="cursor-pointer bg-gradient-to-r from-black/80 via-black/80 to-black/80 hover:from-black hover:via-black hover:to-black 
                   text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl 
                   transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
        >
          <Play className="w-5 h-5 mr-2" />
          Explore more topics
        </button>
        <p className="text-sm text-gray-500 mt-1">
          Click to learn more related topics
        </p>
      </div>
    </div>
  );
};

export default RoadmapAgent;
