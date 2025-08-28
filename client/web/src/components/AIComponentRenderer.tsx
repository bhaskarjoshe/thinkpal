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
          {component.title && (
            <h3 className="font-bold text-lg mb-1">{component.title}</h3>
          )}
          {component.content && (
            <p className="text-gray-700 mb-1">{component.content}</p>
          )}
          {component.features && (
            <ul className="list-disc list-inside text-gray-600">
              {component.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case "text":
      return <p className="text-gray-800">{component.content}</p>;

    case "list":
      return (
        <ul className="list-disc list-inside text-gray-700">
          {component.features?.map((f, idx) => (
            <li key={idx}>{f}</li>
          ))}
        </ul>
      );

    default:
      return null;
  }
};


