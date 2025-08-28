import type { UIComponent } from "../types/types";

export const AIComponentRenderer = ({
  components,
}: {
  components: UIComponent[];
}) => {
  if (!components || components.length === 0) {
    return <p className="text-gray-500">No results to display</p>;
  }

  return (
    <div className="space-y-4">
      {components.map((component, index) => {
        switch (component.component_type) {
          case "card":
            return (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-md bg-white mb-2 animate-fadeIn"
              >
                {component.title && (
                  <h3 className="font-bold text-lg mb-2">{component.title}</h3>
                )}
                {component.content && (
                  <p className="text-gray-700 mb-2">{component.content}</p>
                )}
                {component.content_text && (
                  <p className="text-gray-600 text-sm mb-2">
                    {component.content_text}
                  </p>
                )}
                {component.features && (
                  <ul className="list-disc list-inside text-gray-600">
                    {component.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                )}
                {component.next_steps && component.next_steps.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm">Next Steps:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {component.next_steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );

          case "quiz":
            return (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-md bg-blue-50 animate-fadeIn"
              >
                <h3 className="font-bold text-lg mb-2">{component.title}</h3>
                {component.content && (
                  <p className="text-gray-700 mb-2">{component.content}</p>
                )}
                {component.content_json &&
                  Array.isArray(component.content_json.questions) && (
                    <ul className="list-decimal list-inside text-gray-700">
                      {component.content_json.questions.map(
                        (q: string, idx: number) => (
                          <li key={idx}>{q}</li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            );

          case "roadmap":
            return (
              <div
                key={index}
                className="border-l-4 border-green-500 p-4 bg-green-50 rounded-md shadow-sm animate-fadeIn"
              >
                <h3 className="font-bold text-lg mb-2">{component.title}</h3>
                {component.content && (
                  <p className="text-gray-700 mb-2">{component.content}</p>
                )}
                {component.content_json &&
                  Array.isArray(component.content_json.steps) && (
                    <ol className="list-decimal list-inside text-gray-700">
                      {component.content_json.steps.map(
                        (step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        )
                      )}
                    </ol>
                  )}
              </div>
            );

          case "code":
            return (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-md bg-gray-900 text-green-300 font-mono text-sm animate-fadeIn"
              >
                <h3 className="font-bold text-lg mb-2 text-white">
                  {component.title}
                </h3>
                {component.content && (
                  <pre className="whitespace-pre-wrap">{component.content}</pre>
                )}
              </div>
            );

          case "image":
            return (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-md bg-yellow-50 animate-fadeIn"
              >
                <h3 className="font-bold text-lg mb-2">{component.title}</h3>
                {component.content && (
                  <p className="text-gray-700 mb-2">{component.content}</p>
                )}
                {component.content_image && (
                  <img
                    src={component.content_image}
                    alt={component.title}
                    className="mt-2 rounded-lg shadow-md"
                  />
                )}
              </div>
            );

          case "list":
            return (
              <ul
                key={index}
                className="list-disc list-inside text-gray-700 animate-fadeIn"
              >
                {component.features?.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            );

          case "text":
            return (
              <p key={index} className="text-gray-800 animate-fadeIn">
                {component.content}
              </p>
            );

          default:
            return (
              <p key={index} className="text-gray-500">
                Unsupported component type: {component.component_type}
              </p>
            );
        }
      })}
    </div>
  );
};
