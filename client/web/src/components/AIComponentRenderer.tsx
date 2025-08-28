import type { UIComponent } from "../types/types";

export const AIComponentRenderer = ({
  component,
}: {
  component: UIComponent;
}) => {
  switch (component.component_type) {
    case "card":
      return (
        <div className="border rounded-lg p-4 shadow-md bg-white mb-2 animate-fadeIn">
          {component.title && <h3 className="font-bold text-lg mb-1">{component.title}</h3>}
          {component.content && <p className="text-gray-700 mb-1">{component.content}</p>}
          {component.features && (
            <ul className="list-disc list-inside text-gray-600">
              {component.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case "quiz":
      return (
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg mb-2">
          {component.title && <h3 className="font-bold text-lg mb-1">{component.title}</h3>}
          {component.content && <p className="text-gray-800 mb-1">{component.content}</p>}
          {component.content_json && (
            <ul className="list-decimal list-inside text-gray-700">
              {component.content_json.questions?.map((q: string, idx: number) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case "roadmap":
      return (
        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg mb-2">
          {component.title && <h3 className="font-bold text-lg mb-1">{component.title}</h3>}
          {component.content && <p className="text-gray-800 mb-1">{component.content}</p>}
          {component.content_json && (
            <ol className="list-decimal list-inside text-gray-700">
              {component.content_json.steps?.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      );

    case "code":
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-2">
          {component.content}
        </pre>
      );

    case "image":
      return (
        <div className="border p-4 rounded-lg mb-2 bg-yellow-50">
          {component.title && <h3 className="font-bold text-lg mb-1">{component.title}</h3>}
          {component.content_image ? (
            <img src={component.content_image} alt={component.title} className="w-full h-auto rounded-md" />
          ) : (
            <p className="text-gray-700">{component.content}</p>
          )}
        </div>
      );

    default:
      return null;
  }
};
