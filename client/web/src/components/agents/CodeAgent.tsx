import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { UIComponent } from "../../types/types";

type CodeAgentProps = {
  component: UIComponent;
  index: number;
};

const CodeAgent = ({ component, index }: CodeAgentProps) => {
  const { title, content, brute_force_solution, optimal_solution, example_usage } = component;

  const [activeSolution, setActiveSolution] = useState<"brute" | "optimal" | null>(null);

  const toggleSolution = (solution: "brute" | "optimal") => {
    setActiveSolution(activeSolution === solution ? null : solution);
  };

  const renderSolution = (solution: typeof brute_force_solution | typeof optimal_solution) => (
    <div className="mb-4 space-y-3">
      {/* Code */}
      <div>
        <strong className="text-white">Code:</strong>
        <div className="overflow-auto max-h-80 mt-1 rounded shadow-inner">
          <SyntaxHighlighter language="python" style={okaidia} wrapLines>
            {solution?.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Explanation */}
      {solution?.explanation && (
        <div>
          <strong className="text-white">Explanation:</strong>
          <div className="whitespace-pre-wrap bg-gray-800 text-green-300 p-3 rounded mt-1">
            {solution.explanation}
          </div>
        </div>
      )}

      {/* Example Usage */}
      {example_usage && (
        <div>
          <strong className="text-white">Example Usage:</strong>
          <div className="whitespace-pre-wrap bg-gray-800 text-green-300 p-3 rounded mt-1 overflow-auto">
            {example_usage}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      key={index}
      className="border rounded-lg p-4 shadow-md bg-gray-900 text-green-300 font-mono text-sm animate-fadeIn mb-4"
    >
      {/* Title */}
      {title && <h3 className="font-bold text-xl mb-4 text-white">{title}</h3>}

      {/* Summary */}
      {content && (
        <div className="mb-6">
          <strong className="text-white">Summary:</strong>
          <p className="whitespace-pre-wrap bg-gray-800 text-green-300 p-3 rounded mt-1">{content}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-4 mb-4">
        {brute_force_solution && (
          <button
            onClick={() => toggleSolution("brute")}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              activeSolution === "brute"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            Brute-force Solution
          </button>
        )}
        {optimal_solution && (
          <button
            onClick={() => toggleSolution("optimal")}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              activeSolution === "optimal"
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            Optimal Solution
          </button>
        )}
      </div>

      {/* Solution Panels */}
      <div className="relative">
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeSolution === "brute" ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {activeSolution === "brute" && brute_force_solution && renderSolution(brute_force_solution)}
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            activeSolution === "optimal" ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          {activeSolution === "optimal" && optimal_solution && renderSolution(optimal_solution)}
        </div>
      </div>
    </div>
  );
};

export default CodeAgent;
