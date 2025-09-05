import type { UIComponent } from "../../types/types";
import { useChatStore } from "../../store/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Lightbulb, ArrowRightCircle, Download } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import { handleClick } from "../../utils/chatApiCall";

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

const KnowledgeAgent = ({ component }: { component: UIComponent }) => {
  const { chatId, addMessage } = useChatStore();
  const [page, setPage] = useState(0);

  const pages = splitContentIntoPages(component.content || "");
  const isLongResponse = (component.content?.length || 0) > PAGE_CHAR_LIMIT;

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

  const smartChoices =
    (component.content_json as Record<string, any>)?.smart_choices || [];
  const nextTeacherPrompt =
    (component.content_json as Record<string, any>)?.next_teacher_prompt ||
    null;

  return (
    <div className="p-6 max-w-3xl mx-auto rounded-2xl shadow bg-white space-y-5">
      {/* Title + Download */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          {component.title}
        </h2>
        {isLongResponse && (
          <button
            onClick={handleDownload}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm border rounded-lg 
                     hover:bg-gray-100 transition text-gray-700"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        )}
      </div>

      {/* Paginated Markdown Content */}
      <div className="wrap prose prose-blue text-gray-800 leading-relaxed p-5 rounded break-words max-h-[600px] overflow-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{pages[page]}</ReactMarkdown>
      </div>

      {/* Pagination Controls */}
      {pages.length > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {pages.length}
          </span>
          <button
            disabled={page === pages.length - 1}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer px-3 py-1 rounded border disabled:opacity-50"
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
                  onClick={() => handleClick(chatId, addMessage, label)}
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

      {/* Smart Choices */}
      {smartChoices.length > 0 && (
        <div>
          <h3 className="text-sm flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" /> Smart Choices for
            You
          </h3>
          <div className="flex flex-col items-start gap-2">
            {smartChoices.map((choice: any, i: number) => (
              <button
                key={i}
                onClick={() => handleClick(chatId, addMessage, choice.label)}
                className="cursor-pointer pl-4 pr-8 py-2 text-sm rounded-xl bg-blue-50 
                 border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
              >
                {choice.label}
              </button>
            ))}
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
                  onClick={() => handleClick(chatId, addMessage, label)}
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

      {/* Suggested UI Options */}
      {component.content_json?.user_intent_analysis?.suggested_ui_options
        ?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" /> You can try:
          </h3>
          <div className="flex flex-wrap gap-2">
            {component.content_json?.user_intent_analysis?.suggested_ui_options?.map(
              (option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleClick(chatId, addMessage, option + " for " + (component.title))}
                  className="cursor-pointer px-4 py-2 text-sm rounded-xl bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100 transition"
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeAgent;
