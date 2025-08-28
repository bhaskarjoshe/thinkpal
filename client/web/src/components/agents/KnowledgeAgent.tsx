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
      console.log(component);
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
      console.log(response);
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "ai",
        content: JSON.stringify(response.ui_component || { component_type: "knowledge", content: "Sorry, no response." }),
      };
      addMessage(aiMessage);
    } catch (error) {
      console.log(error);
    }
  };

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

        {/* Next Topics to Learn */}
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
