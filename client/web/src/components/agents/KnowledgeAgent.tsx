import type { UIComponent } from "../../types/types";
import { chatApi } from "../../api/chat";
import { useChatStore } from "../../store/chatStore";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../../types/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Lightbulb,
  ArrowRightCircle,
  Download,
  Compass,
} from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";

const PAGE_CHAR_LIMIT = 1800;

const splitContentIntoPages = (content: string) => {
  const parts: string[] = [];
  let remaining = content;
  while (remaining.length > PAGE_CHAR_LIMIT) {
    let splitIndex = remaining.lastIndexOf("\n", PAGE_CHAR_LIMIT);
    if (splitIndex === -1) splitIndex = PAGE_CHAR_LIMIT;
    parts.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex);
  }
  if (remaining.length > 0) parts.push(remaining);
  return parts;
};

const KnowledgeAgent = ({
  component,
  index,
}: {
  component: UIComponent;
  index: number;
}) => {
  const { chatId, addMessage } = useChatStore();
  const [page, setPage] = useState(0);

  const pages = splitContentIntoPages(component.content || "");
  const isLongResponse = (component.content?.length || 0) > PAGE_CHAR_LIMIT;

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

  const handleDownload = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const margin = 40;
    const pageHeight = doc.internal.pageSize.height - margin * 2;

    const lines = doc.splitTextToSize(component.content || "", 500);

    let y = margin;
    lines.forEach((line: string) => {
      if (y > pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 20;
    });

    doc.save(`${component.title || "knowledge"}.pdf`);
  };

  const nextTeacherPrompt =
    (component.content_json as Record<string, any>)?.next_teacher_prompt ||
    null;

  const userIntent =
    (component.content_json as Record<string, any>)?.user_intent_analysis ||
    null;

  return (
    <div
      key={index}
      className="p-6 border rounded-2xl shadow bg-white space-y-6"
    >
      {/* Title + Download */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          {component.title}
        </h2>
        {isLongResponse && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded-lg 
                     hover:bg-gray-100 transition text-gray-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        )}
      </div>

      {/* Paginated Markdown Content */}
      <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed p-5 rounded bg-gray-50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pages[page]}</ReactMarkdown>
      </div>

      {/* Pagination Controls */}
      {pages.length > 1 && (
        <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {pages.length}
          </span>
          <button
            disabled={page === pages.length - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Features */}
      {component.features?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {component.features?.map((feature: any, i: number) => {
              const label =
                typeof feature === "string" ? feature : feature.label;
              const description =
                typeof feature === "string" ? "" : feature.description || "";

              return (
                <div
                  key={i}
                  onClick={() => handleClick(label)}
                  className="cursor-pointer p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                >
                  <p className="font-medium text-gray-800">{label}</p>
                  {description && (
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* User Intent Analysis */}
      {userIntent && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-500" />
            Suggested Next Steps
          </h3>
          <p className="text-xs text-gray-600 italic mb-2">
            Likely you want: {userIntent.likely_direction}
          </p>
          <div className="flex flex-wrap gap-2">
            {userIntent.suggested_ui_options?.map(
              (choice: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleClick(choice)}
                  className="cursor-pointer px-4 py-2 text-sm rounded-xl bg-purple-50 
                           border border-purple-300 text-purple-700 hover:bg-purple-100 transition"
                >
                  {choice}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Teacher Next Prompt */}
      {nextTeacherPrompt && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg text-sm text-gray-800 italic">
          {nextTeacherPrompt}
        </div>
      )}

      {/* Next Topics */}
      {component.next_topics_to_learn?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <ArrowRightCircle className="w-4 h-4 text-green-500" />
            Next Topics to Learn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {component.next_topics_to_learn?.map((topic: any, i: number) => {
              const label = typeof topic === "string" ? topic : topic.label;
              const description =
                typeof topic === "string" ? "" : topic.description || "";

              return (
                <div
                  key={i}
                  onClick={() => handleClick(label)}
                  className="cursor-pointer p-3 border rounded-xl bg-white hover:bg-gray-50 transition shadow-sm"
                >
                  <p className="font-medium text-gray-800">{label}</p>
                  {description && (
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeAgent;
