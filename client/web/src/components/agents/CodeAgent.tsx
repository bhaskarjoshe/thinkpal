import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { UIComponent } from "../../types/types";
import { BiExpandVertical } from "react-icons/bi";
import { chatApi } from "../../api/chat";
import { useChatStore } from "../../store/chatStore";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../../types/types";
import { CiTextAlignJustify } from "react-icons/ci";

type CodeAgentProps = {
  component: UIComponent;
  index: number;
};

const CodeAgent = ({ component, index }: CodeAgentProps) => {
  const { chatId, addMessage } = useChatStore();
  const {
    title,
    content,
    content_json,
    brute_force_solution,
    optimal_solution,
    example_usage,
    extra_question,
    extra_code_problems,
  } = component;

  const nextTeacherPrompt = content_json?.next_teacher_prompt;
  const [activeSolution, setActiveSolution] = useState<
    "brute" | "optimal" | null
  >(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExtraCodeSections, setShowExtraCodeSections] = useState(
    Array(extra_code_problems?.length).fill(false)
  );

  const toggleSolution = (solution: "brute" | "optimal") => {
    setActiveSolution(activeSolution === solution ? null : solution);
  };

  const handleExtraCodeQuestionClick = async (query: string) => {
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
                  component_type: "code",
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
  const renderSolution = (
    solution: typeof brute_force_solution | typeof optimal_solution
  ) => (
    <div className="mb-4 space-y-4">
      {solution?.code && (
        <div>
          <strong className="text-white text-lg">Code:</strong>
          <div className="overflow-auto max-h-96 mt-2 rounded-lg shadow-xl border border-white/10">
            <SyntaxHighlighter
              language={solution.language || "python"}
              style={okaidia}
              wrapLines
            >
              {solution.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
      {solution?.explanation && (
        <div>
          <strong className="text-white text-lg">Explanation:</strong>
          <div className="whitespace-pre-wrap backdrop-blur-sm bg-gray-800/90 text-green-300 p-4 rounded-lg mt-2 border border-white/10 shadow-inner">
            {solution.explanation}
          </div>
        </div>
      )}
      {example_usage && (
        <div>
          <strong className="text-white text-lg">Example Usage:</strong>
          <div className="whitespace-pre-wrap backdrop-blur-sm bg-gray-800/90 text-green-300 p-4 rounded-lg mt-2 overflow-auto border border-white/10 shadow-inner">
            {example_usage}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      key={index}
      className="backdrop-blur-md bg-gray-900/95 border border-white/20 rounded-xl p-6 shadow-2xl text-green-300 font-mono text-sm animate-fadeIn mb-6 hover:border-white/30 transition-all duration-300"
    >
      {/* Title */}
      {title && <h3 className="font-bold text-2xl mb-4 text-white">{title}</h3>}

      {/* Summary / Content */}
      {content && (
        <div className="mb-6">
          <strong className="text-white text-lg">Summary:</strong>
          <p className="whitespace-pre-wrap backdrop-blur-sm bg-gray-800/90 text-green-300 p-4 rounded-lg mt-2 border border-white/10 shadow-inner">
            {content}
          </p>
        </div>
      )}

      {/* Solution Buttons */}
      <div className="flex space-x-4 mb-6">
        {brute_force_solution && (
          <button
            onClick={() => toggleSolution("brute")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border ${
              activeSolution === "brute"
                ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-lg shadow-green-500/25 border-green-400/50"
                : "bg-white/10 text-gray-200 hover:bg-gradient-to-r hover:from-green-500/80 hover:to-green-600/80 hover:text-white border-white/20 hover:border-green-400/50"
            }`}
          >
            Brute-force Solution
          </button>
        )}
        {optimal_solution && (
          <button
            onClick={() => toggleSolution("optimal")}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border ${
              activeSolution === "optimal"
                ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white shadow-lg shadow-green-500/25 border-green-400/50"
                : "bg-white/10 text-gray-200 hover:bg-gradient-to-r hover:from-green-500/80 hover:to-green-600/80 hover:text-white border-white/20 hover:border-green-400/50"
            }`}
          >
            Optimal Solution
          </button>
        )}
      </div>

      {/* Solution Panels */}
      <div className="relative space-y-4">
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeSolution === "brute" ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {activeSolution === "brute" &&
            brute_force_solution &&
            renderSolution(brute_force_solution)}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeSolution === "optimal" ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {activeSolution === "optimal" &&
            optimal_solution &&
            renderSolution(optimal_solution)}
        </div>
      </div>

      {/* Next Teacher Prompt */}
      {nextTeacherPrompt && (
        <div className="mt-4 p-4 backdrop-blur-sm bg-yellow-400/10 border-l-4 border-yellow-400/60 rounded-lg text-yellow-200 italic shadow-lg border border-yellow-400/20">
          {nextTeacherPrompt}
        </div>
      )}

      {/* Extra Code Problems */}
      {extra_code_problems && extra_code_problems.length > 0 && (
        <div className="mt-6">
          <strong className="text-white text-lg">Try These:</strong>
          <div className="flex flex-col gap-4 mt-3">
            {extra_code_problems.map((fq, idx) => (
              <div key={idx} className="w-full">
                {/* Problem Title */}
                <div
                  className="py-3 px-4 bg-gray-700 rounded-lg text-white cursor-pointer text-center shadow-md hover:shadow-lg transform transition-all duration-200"
                  onClick={() => {
                    const newState = [...showExtraCodeSections];
                    newState[idx] = !newState[idx];
                    setShowExtraCodeSections(newState);
                  }}
                >
                  {fq.title}
                </div>

                {/* Expanded Section */}
                {showExtraCodeSections[idx] && (
                  <div className="mt-2 p-4 bg-yellow-50  rounded-lg text-black shadow-inner">
                    <p className="text-sm mb-3">{fq.question}</p>
                    <button
                      className="flex items-center gap-2 py-2 px-4 bg-black/80 cursor-pointer text-white rounded-lg hover:bg-black transition-colors"
                      onClick={() =>
                        handleExtraCodeQuestionClick(
                          "Give code for " + fq.title
                        )
                      }
                    >
                      <CiTextAlignJustify /> Ask ThinkPal
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Do You Know Section */}
      {extra_question && (
        <div className="mt-6">
          <strong className="text-white text-lg">Think:</strong>
          <div
            className="mt-2 py-3 px-4 backdrop-blur-sm bg-gray-700/80 rounded-lg text-white cursor-pointer shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-101 border border-white/20 hover:border-white/40 flex  justify-between"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <span className="flex-1">{extra_question.question}</span>

            <BiExpandVertical />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showAnswer ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {showAnswer && (
              <div className="mt-2 p-4 backdrop-blur-sm bg-white/90 text-gray-800 rounded-lg shadow-xl border border-white/30 transition-all duration-300">
                {extra_question.answer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeAgent;
