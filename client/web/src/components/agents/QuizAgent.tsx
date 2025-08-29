import { useState } from "react";
import type { UIComponent } from "../../types/types";

const QuizAgent = ({
  component,
  index,
}: {
  component: UIComponent;
  index: number;
}) => {
  const quiz = component.content_json;
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  if (!quiz || !quiz.questions) return null;

  const handleOptionSelect = (qIndex: number, option: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qIndex]: option }));
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <div
      key={index}
      className="border rounded-lg p-4 shadow-md bg-blue-50 animate-fadeIn"
    >
      {/* Quiz Title */}
      <h3 className="font-bold text-lg mb-2">{component.title}</h3>

      {/* Intro / Description */}
      {component.content && (
        <p className="text-gray-700 mb-4">{component.content}</p>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q: any, idx: number) => (
          <div
            key={idx}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            {/* Question */}
            <p className="font-medium text-gray-800 mb-3">
              {idx + 1}. {q.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt: string, i: number) => {
                const isSelected = answers[idx] === opt;
                const isCorrect = q.answer === opt;

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(idx, opt)}
                    disabled={submitted}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition 
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-100 hover:cursor-ponter"
                          : "border-gray-300 bg-gray-50"
                      }
                      ${
                        submitted
                          ? isCorrect
                            ? "border-green-500 bg-green-100"
                            : isSelected
                            ? "border-red-500 bg-red-100"
                            : ""
                          : ""
                      }
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Submit Quiz
        </button>
      )}

      {/* Score */}
      {submitted && score !== null && (
        <div className="mt-4 p-3 border rounded-lg bg-white shadow-sm text-gray-800">
          <p className="font-semibold">
            Your Score: {score} / {quiz.questions.length}
          </p>
        </div>
      )}

      {/* Next topics */}
      {component.next_topics_to_learn &&
        component.next_topics_to_learn.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">
              Next topics to learn:
            </h4>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              {component.next_topics_to_learn.map((topic: string, i: number) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};

export default QuizAgent;
