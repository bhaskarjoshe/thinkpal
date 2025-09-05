import React from "react";
import { ChevronRight, ChevronDown, Book, Lightbulb, Link, Target } from "lucide-react";
import { FaPlayCircle } from "react-icons/fa";
import { handleClick } from "../../../utils/chatApiCall";

interface TopicSectionProps {
  topic: any;
  topicKey: string;
  levelName: string;
  expandedSections: Set<string>;
  toggleSection: (levelName: string, topicName: string, sectionName: string) => void;
  chatId: string;
  addMessage: any;
  setActiveVideo: (video: any) => void;
}

const TopicSection: React.FC<TopicSectionProps> = ({
  topic,
  topicKey,
  levelName,
  expandedSections,
  toggleSection,
  chatId,
  addMessage,
  setActiveVideo,
}) => {
  return (
    <>
      {/* Key Topics */}
      {topic.subtopics && topic.subtopics.length > 0 && (
        <div className="relative">
          <div className="ml-6">
            <button
              onClick={() => toggleSection(levelName, topic.topic, "subtopics")}
              className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 
                         border border-green-200 transition-all duration-200 text-sm group"
            >
              <Book className="w-3 h-3 mr-2 text-green-600" />
              <span className="flex-1 text-left font-medium text-gray-700">
                Key Topics ({topic.subtopics.length})
              </span>
              {expandedSections.has(`${topicKey}-subtopics`) ? (
                <ChevronDown className="w-3 h-3 text-green-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-green-600" />
              )}
            </button>

            {expandedSections.has(`${topicKey}-subtopics`) && (
              <div className="mt-2 ml-6 bg-white border border-green-200 rounded-md p-3 shadow-sm">
                <ul className="space-y-1">
                  {topic.subtopics.map((subtopic, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span
                        className="text-gray-700 hover:bg-gray-100 hover:scale-105 px-1 rounded-lg cursor-pointer"
                        onClick={() => handleClick(chatId, addMessage, "Tell about " + subtopic)}
                      >
                        {subtopic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Examples */}
      {topic.examples && topic.examples.length > 0 && (
        <div className="relative">
          <div className="ml-6">
            <button
              onClick={() => toggleSection(levelName, topic.topic, "examples")}
              className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-yellow-50 hover:bg-yellow-100 
                         border border-yellow-200 transition-all duration-200 text-sm group"
            >
              <Lightbulb className="w-3 h-3 mr-2 text-yellow-600" />
              <span className="flex-1 text-left font-medium text-gray-700">
                Examples ({topic.examples.length})
              </span>
              {expandedSections.has(`${topicKey}-examples`) ? (
                <ChevronDown className="w-3 h-3 text-yellow-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-yellow-600" />
              )}
            </button>

            {expandedSections.has(`${topicKey}-examples`) && (
              <div className="mt-2 ml-6 bg-white border border-yellow-200 rounded-md p-3 shadow-sm">
                <ul className="space-y-1">
                  {topic.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span
                        onClick={() => handleClick(chatId, addMessage, example)}
                        className="text-gray-700 italic hover:bg-gray-100 hover:scale-105 px-1 rounded-lg cursor-pointer"
                      >
                        {example}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resources */}
{topic.resources && topic.resources.length > 0 && (
  <div className="relative">
    <div className="ml-6">
      <button
        onClick={() => toggleSection(levelName, topic.topic, "resources")}
        className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 
                   border border-purple-200 transition-all duration-200 text-sm group"
      >
        <Link className="w-3 h-3 mr-2 text-purple-600" />
        <span className="flex-1 text-left font-medium text-gray-700">
          Resources ({topic.resources.length})
        </span>
        {expandedSections.has(`${topicKey}-resources`) ? (
          <ChevronDown className="w-3 h-3 text-purple-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-purple-600" />
        )}
      </button>

      {expandedSections.has(`${topicKey}-resources`) && (
        <div className="mt-2 ml-6 bg-white border border-purple-200 rounded-md p-3 shadow-sm">
          <ul className="space-y-2 list-none">
            {topic.resources.map((resource, idx) => {
              const [title, url] = resource.split(/:\s(.+)/); // split only at first colon
              return (
                <li key={idx} className="flex items-start text-sm">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <a
                    href={url?.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 underline hover:no-underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {title?.trim()}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  </div>
)}


      {/* Video Resources */}
      {topic.video_resources && topic.video_resources.length > 0 && (
        <div className="relative mt-4">
          <div className="ml-6">
            <button
              onClick={() => toggleSection(levelName, topic.topic, "video_resources")}
              className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 
                         border border-green-200 transition-all duration-200 text-sm group"
            >
              <Link className="w-3 h-3 mr-2 text-green-600" />
              <span className="flex-1 text-left font-medium text-gray-700">
                Video Resources ({topic.video_resources.length})
              </span>
              {expandedSections.has(`${topicKey}-video_resources`) ? (
                <ChevronDown className="w-3 h-3 text-green-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-green-600" />
              )}
            </button>

            {expandedSections.has(`${topicKey}-video_resources`) && (
              <div className="mt-2 ml-6 bg-white border border-green-200 rounded-md p-3 shadow-sm">
                <ul className="space-y-3 list-none">
                  {topic.video_resources.map((video, idx) => {
                    let title = "";
                    let url = "";
                    if (video.includes(":")) {
                      [title, url] = video.split(/:\s(.+)/);
                    } else {
                      url = video;
                      title = "Video";
                    }

                    const videoId = url?.split("v=")[1];
                    const thumbnailUrl = videoId
                      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                      : null;

                    return (
                      <li key={idx} className="flex items-center space-x-3">
                        {thumbnailUrl && (
                          <div
                            className="relative w-48 h-28 flex-shrink-0  p-1 overflow-hidden cursor-pointer group"
                            onClick={() => setActiveVideo(url)}
                          >
                            <img
                              src={thumbnailUrl}
                              alt={title}
                              className="w-full rounded-lg h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <FaPlayCircle className="absolute inset-0 m-auto text-white text-5xl opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <div
                          className="flex-1 text-sm text-gray-800 cursor-pointer hover:text-green-700 transition-colors"
                          onClick={() => setActiveVideo(url)}
                        >
                          {title}
                        </div>
                      </li>
                    );
                  })}
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
              onClick={() => toggleSection(levelName, topic.topic, "outcome")}
              className="cursor-pointer flex items-center w-full px-3 py-2 rounded-md bg-orange-50 hover:bg-orange-100 
                         border border-orange-200 transition-all duration-200 text-sm group"
            >
              <Target className="w-3 h-3 mr-2 text-orange-600" />
              <span className="flex-1 text-left font-medium text-gray-700">
                Learning Outcome
              </span>
              {expandedSections.has(`${topicKey}-outcome`) ? (
                <ChevronDown className="w-3 h-3 text-orange-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-orange-600" />
              )}
            </button>

            {expandedSections.has(`${topicKey}-outcome`) && (
              <div className="mt-2 ml-6 bg-white border border-orange-200 rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {topic.expected_outcome}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopicSection;