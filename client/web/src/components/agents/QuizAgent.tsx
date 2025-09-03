import { useState } from "react";
import type { UIComponent } from "../../types/types";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage } from "../../types/types";
import { chatApi } from "../../api/chat";
import { useChatStore } from "../../store/chatStore";

const QuizAgent = ({
  component,
  index,
}: {
  component: UIComponent;
  index: number;
}) => {
  const quiz = component.content_json;
  const { chatId, addMessage } = useChatStore();

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  if (!quiz || !quiz.questions) return null;

  const handleQuizRequest = async (query: string) => {
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
                  component_type: "quiz",
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

  const handleOptionSelect = (questionIdx: number, selectedOption: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIdx]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div
      key={index}
      className="border border-gray-200 rounded-lg p-6 bg-white space-y-6"
    >
      {/* Quiz Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {component.title}
        </h3>
        {component.content && (
          <p className="text-gray-600 mt-1">{component.content}</p>
        )}

        {!submitted && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((q: any, idx: number) => (
          <div key={idx} className="space-y-3">
            <p className="font-medium text-gray-900">
              {idx + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt: string, i: number) => {
                const isSelected = answers[idx] === opt;
                const isCorrect = q.answer === opt;
                const isIncorrect = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(idx, opt)}
                    disabled={submitted}
                    className={`w-full text-left px-3 py-2 rounded-md border transition-colors cursor-pointer ${
                      isSelected && !submitted
                        ? "border-blue-500 bg-blue-50"
                        : !submitted
                        ? "border-gray-300 bg-white hover:bg-gray-50"
                        : ""
                    } ${
                      submitted
                        ? isCorrect
                          ? "border-green-500 bg-green-50 text-green-800"
                          : isIncorrect
                          ? "border-red-500 bg-red-50 text-red-800"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                        : ""
                    } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div
                className={`mt-3 p-3 rounded-md text-sm ${
                  answers[idx] === q.answer
                    ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                    : "bg-red-50 border-l-4 border-red-500 text-red-700"
                }`}
              >
                {answers[idx] === q.answer ? (
                  <p className="font-medium">Correct!</p>
                ) : (
                  <p className="font-medium">Correct Answer: {q.answer}</p>
                )}
                {q.explanation && (
                  <p className="mt-2 text-gray-700">{q.explanation}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit / Results Section */}
      <div className="pt-4 border-t border-gray-200">
        {!submitted ? (
          <div className="space-y-2">
            <button
              onClick={handleSubmit}
              disabled={answeredQuestions !== totalQuestions}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${
                answeredQuestions === totalQuestions
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Submit Quiz
            </button>
            {answeredQuestions < totalQuestions && (
              <p className="text-sm text-gray-500 text-center">
                Answer all questions to submit
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-gray-50 border rounded-lg p-4 text-center">
              <p className="text-lg font-semibold">
                Score: {score}/{totalQuestions} (
                {Math.round(((score || 0) / totalQuestions) * 100)}%)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Retry Quiz
              </button>

              <button
                onClick={() =>
                  handleQuizRequest("Give a quiz on " + component.label)
                }
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
              >
                More Questions
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Topics */}
      {component.related_topics && component.related_topics.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Related Topics:</h4>
          <div className="grid gap-2">
            {component.related_topics.map((topic: any, i: number) => (
              <button
                key={i}
                onClick={() =>
                  handleQuizRequest("Give a quiz on " + topic.label)
                }
                className="p-3 text-left border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="font-medium text-gray-900">{topic.label}</p>
                {topic.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {topic.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAgent;
