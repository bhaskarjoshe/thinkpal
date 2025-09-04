import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Book,
  Target,
  Link,
  Lightbulb,
  Trophy,
  Play,
  CheckCircle,
  Circle,
} from "lucide-react";

import type { RoadmapAgentProps, RoadmapContent } from "../../types/types";
import { useChatStore } from "../../store/chatStore";
import { handleClick } from "../../utils/chatApiCall";

const RoadmapAgent = ({
  component
}: RoadmapAgentProps) => {
  const roadmap = component.content_json as RoadmapContent;

  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const { chatId, addMessage } = useChatStore();

  console.log(component);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set()
  );

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

  const toggleSection = (
    levelName: string,
    topicName: string,
    sectionName: string
  ) => {
    const key = `${levelName}-${topicName}-${sectionName}`;
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCompletion = (
    levelName: string,
    topicName: string,
    e: React.MouseEvent
  ) => {
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

  const levelIcons = [
    <Play className="w-5 h-5" />,
    <Target className="w-5 h-5" />,
    <Trophy className="w-5 h-5" />,
  ];

  const activeRoadmap = roadmap?.levels ? roadmap : null;
  const totalTopics = Object.values(activeRoadmap?.levels || {}).flat().length;
  const completedCount = completedTopics.size;
  const progressPercent =
    totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

  return (
    <div className="p-6 min-w-5xl mx-auto bg-white">
      {/* Simple Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {component.title || "Learning Roadmap"}
        </h1>

        {/* Simple Progress Bar */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              Progress: {completedCount}/{totalTopics}
            </span>
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

      {/* Tree Structure */}
      <div className="space-y-6">
        {activeRoadmap?.levels &&
          Object.entries(activeRoadmap.levels).map(
            ([levelName, topics], levelIdx) => {
              const isLevelExpanded = expandedLevels.has(levelName);
              const levelColor = levelColors[levelIdx % levelColors.length];
              const levelCompleted = topics.filter((topic) =>
                completedTopics.has(`${levelName}-${topic.topic}`)
              ).length;

              return (
                <div key={levelName} className="relative">
                  {/* Level Node */}
                  <div className="flex items-start">
                    {/* Level Content */}
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

                      {/* Topics */}
                      {isLevelExpanded && topics && topics.length > 0 && (
                        <div className="mt-4 ml-8 space-y-3">
                          {topics.map((topic, topicIdx) => {
                            const topicKey = `${levelName}-${topic.topic}`;
                            const isTopicExpanded =
                              expandedTopics.has(topicKey);
                            const isCompleted = completedTopics.has(topicKey);

                            return (
                              <div key={topicIdx} className="relative">
                                {/* Topic Node */}
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
                                    {/* Completion Checkbox */}
                                    <button
                                      onClick={(e) =>
                                        toggleCompletion(
                                          levelName,
                                          topic.topic,
                                          e
                                        )
                                      }
                                      className="cursor-pointer mr-3 hover:scale-110 transition-transform duration-150"
                                      title={
                                        isCompleted
                                          ? "Mark as incomplete"
                                          : "Mark as complete"
                                      }
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-gray-400 hover:text-green-500" />
                                      )}
                                    </button>

                                    {/* Topic Content */}
                                    <button
                                      onClick={() =>
                                        toggleTopic(levelName, topic.topic)
                                      }
                                      className="cursor-pointer flex items-center flex-1"
                                    >
                                      <Book
                                        className={`w-4 h-4 mr-2 ${
                                          isCompleted
                                            ? "text-green-600"
                                            : "text-blue-600"
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
                                            isCompleted
                                              ? "text-green-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      ) : (
                                        <ChevronRight
                                          className={`w-4 h-4 ${
                                            isCompleted
                                              ? "text-green-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      )}
                                    </button>
                                  </div>

                                  {/* Sections */}
                                  {isTopicExpanded && (
                                    <div className="mt-3 ml-6 space-y-2">
                                      {/* Key Topics */}
                                      {topic.subtopics &&
                                        topic.subtopics.length > 0 && (
                                          <div className="relative">
                                            <div className="ml-6">
                                              <button
                                                onClick={() =>
                                                  toggleSection(
                                                    levelName,
                                                    topic.topic,
                                                    "subtopics"
                                                  )
                                                }
                                                className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 
                                                   border border-green-200 transition-all duration-200 text-sm group"
                                              >
                                                <Book className="w-3 h-3 mr-2 text-green-600" />
                                                <span className="flex-1 text-left font-medium text-gray-700">
                                                  Key Topics (
                                                  {topic.subtopics.length})
                                                </span>
                                                {expandedSections.has(
                                                  `${topicKey}-subtopics`
                                                ) ? (
                                                  <ChevronDown className="w-3 h-3 text-green-600" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3 text-green-600" />
                                                )}
                                              </button>

                                              {expandedSections.has(
                                                `${topicKey}-subtopics`
                                              ) && (
                                                <div className="mt-2 ml-6 bg-white border border-green-200 rounded-md p-3 shadow-sm">
                                                  <ul className="space-y-1">
                                                    {topic.subtopics.map(
                                                      (subtopic, idx) => (
                                                        <li
                                                          key={idx}
                                                          className="flex items-start text-sm"
                                                        >
                                                          <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                          <span
                                                            className="text-gray-700 hover:bg-gray-100 hover:scale-105 px-1 rounded-lg cursor-pointer"
                                                            onClick={() =>
                                                              handleClick(
                                                                chatId,
                                                                addMessage,
                                                                "Tell about " +
                                                                  subtopic
                                                              )
                                                            }
                                                          >
                                                            {subtopic}
                                                          </span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      {/* Examples */}
                                      {topic.examples &&
                                        topic.examples.length > 0 && (
                                          <div className="relative">
                                            <div className="ml-6">
                                              <button
                                                onClick={() =>
                                                  toggleSection(
                                                    levelName,
                                                    topic.topic,
                                                    "examples"
                                                  )
                                                }
                                                className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-yellow-50 hover:bg-yellow-100 
                                                   border border-yellow-200 transition-all duration-200 text-sm group"
                                              >
                                                <Lightbulb className="w-3 h-3 mr-2 text-yellow-600" />
                                                <span className="flex-1 text-left font-medium text-gray-700">
                                                  Examples (
                                                  {topic.examples.length})
                                                </span>
                                                {expandedSections.has(
                                                  `${topicKey}-examples`
                                                ) ? (
                                                  <ChevronDown className="w-3 h-3 text-yellow-600" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                                                )}
                                              </button>

                                              {expandedSections.has(
                                                `${topicKey}-examples`
                                              ) && (
                                                <div className="mt-2 ml-6 bg-white border border-yellow-200 rounded-md p-3 shadow-sm">
                                                  <ul className="space-y-1">
                                                    {topic.examples.map(
                                                      (example, idx) => (
                                                        <li
                                                          key={idx}
                                                          className="flex items-start text-sm"
                                                        >
                                                          <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                          <span
                                                            onClick={() =>
                                                              handleClick(
                                                                chatId,
                                                                addMessage,
                                                                example
                                                              )
                                                            }
                                                            className="text-gray-700 italic hover:bg-gray-100 hover:scale-105 px-1 rounded-lg cursor-pointer"
                                                          >
                                                            {example}
                                                          </span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      {/* Resources */}
                                      {topic.resources &&
                                        topic.resources.length > 0 && (
                                          <div className="relative">
                                            <div className="ml-6">
                                              <button
                                                onClick={() =>
                                                  toggleSection(
                                                    levelName,
                                                    topic.topic,
                                                    "resources"
                                                  )
                                                }
                                                className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 
                                                   border border-purple-200 transition-all duration-200 text-sm group"
                                              >
                                                <Link className="w-3 h-3 mr-2 text-purple-600" />
                                                <span className="flex-1 text-left font-medium text-gray-700">
                                                  Resources (
                                                  {topic.resources.length})
                                                </span>
                                                {expandedSections.has(
                                                  `${topicKey}-resources`
                                                ) ? (
                                                  <ChevronDown className="w-3 h-3 text-purple-600" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3 text-purple-600" />
                                                )}
                                              </button>

                                              {expandedSections.has(
                                                `${topicKey}-resources`
                                              ) && (
                                                <div className="mt-2 ml-6 bg-white border border-purple-200 rounded-md p-3 shadow-sm">
                                                  <ul className="space-y-2">
                                                    {topic.resources.map(
                                                      (resource, idx) => {
                                                        const [label, url] =
                                                          resource.split(
                                                            /:\s(.+)/
                                                          );
                                                        return (
                                                          <li
                                                            key={idx}
                                                            className="flex items-start text-sm"
                                                          >
                                                            <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                            <a
                                                              href={
                                                                url || label
                                                              }
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="text-purple-600 hover:text-purple-800 underline hover:no-underline transition-colors"
                                                              onClick={(e) =>
                                                                e.stopPropagation()
                                                              }
                                                            >
                                                              {label || url}
                                                            </a>
                                                          </li>
                                                        );
                                                      }
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      {/* Expected Outcome */}
                                      {topic.expected_outcome && (
                                        <div className="relative">
                                          <div className="ml-6">
                                            <button
                                              onClick={() =>
                                                toggleSection(
                                                  levelName,
                                                  topic.topic,
                                                  "outcome"
                                                )
                                              }
                                              className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-orange-50 hover:bg-orange-100 
                                                   border border-orange-200 transition-all duration-200 text-sm group"
                                            >
                                              <Target className="w-3 h-3 mr-2 text-orange-600" />
                                              <span className="flex-1 text-left font-medium text-gray-700">
                                                Learning Outcome
                                              </span>
                                              {expandedSections.has(
                                                `${topicKey}-outcome`
                                              ) ? (
                                                <ChevronDown className="w-3 h-3 text-orange-600" />
                                              ) : (
                                                <ChevronRight className="w-3 h-3 text-orange-600" />
                                              )}
                                            </button>

                                            {expandedSections.has(
                                              `${topicKey}-outcome`
                                            ) && (
                                              <div className="mt-2 ml-6 bg-white border border-orange-200 rounded-md p-3 shadow-sm">
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                  {topic.expected_outcome}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>

      {/* Simple Action Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => handleClick(chatId,addMessage, "Explore more topics on "+component.title)}
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
