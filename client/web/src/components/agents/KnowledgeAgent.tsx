import type { UIComponent } from "../../types/types";
import { chatApi } from "../../api/chat";
import { useChatStore } from "../../store/chatStore";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../../types/types";

const KnowledgeAgent = ({
  component,
  index,
}: {
  component: UIComponent;
  index: number;
}) => {
  const { chatId, addMessage } = useChatStore();

  const handleClick = async (query: string) => {
    try {
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: "user",
        content: query,
      };
      addMessage(userMessage);

      const response = await chatApi({
        chat_id: chatId,
        chat_mode: "normal",
        query: query,
      });

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        ui_components:
          response.ui_components && response.ui_components.length > 0
            ? response.ui_components
            : [
                {
                  component_type: "knowledge",
                  title: "No Response",
                  content: "Sorry, no response.",
                  features: [],
                },
              ],
      };
      addMessage(aiMessage);
      
      
    } catch (error) {
      console.error(error);
    }
  };
  

  // Safely extract smart choices + teacher prompt
  const smartChoices =
    (component.content_json as Record<string, any>)?.smart_choices || [];
  const nextTeacherPrompt =
    (component.content_json as Record<string, any>)?.next_teacher_prompt || null;

  return (
    <div>
      <div
        key={index}
        className="p-5 border rounded-2xl shadow-sm bg-white animate-fadeIn space-y-4"
      >
        {/* Title */}
        <h2 className="text-lg font-semibold">{component.title}</h2>

        {/* Main Content */}
        <p className="text-gray-700 leading-relaxed">{component.content}</p>

        {/* Features */}
        {component.features?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Key Features:</h3>
            <div className="flex flex-wrap gap-2">
              {component.features?.map((feature, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(feature)}
                  className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded-full 
                         text-gray-700 hover:bg-gray-100 transition"
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Smart Choices from AI */}
        {smartChoices.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Smart Choices for You:</h3>
            <div className="flex flex-wrap gap-2">
              {smartChoices.map((choice: any, i: number) => (
                <button
                  key={i}
                  onClick={() => handleClick(choice.label)}
                  className="cursor-pointer px-4 py-2 text-sm border border-blue-400 rounded-xl 
                         text-blue-600 hover:bg-blue-50 transition shadow-sm"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Teacher-style Next Prompt */}
        {nextTeacherPrompt && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg text-sm text-gray-700">
            {nextTeacherPrompt}
          </div>
        )}

        {/* Next Topics to Learn (legacy field) */}
        {component.next_topics_to_learn?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Next Topics to Learn:</h3>
            <div className="flex flex-wrap gap-2">
              {component.next_topics_to_learn?.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleClick(topic)}
                  className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded-lg 
                         text-gray-700 hover:bg-gray-100 transition"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeAgent;
