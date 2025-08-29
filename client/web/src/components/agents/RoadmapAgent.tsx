import type { UIComponent } from "../../types/types";

const RoadmapAgent = ({
  component,
  index,
  setInputQuery,
}: {
  component: UIComponent;
  index: number;
  setInputQuery: (query: string) => void;
}) => {
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
        "levels" in component.content_json &&
        Array.isArray(component.content_json.levels) && (
          <ol className="list-decimal list-inside text-gray-700">
            {component.content_json.levels.map(
              (level: { level_name: string }, idx: number) => (
                <li key={idx} onClick={() => setInputQuery(level.level_name)}>
                  {level.level_name}
                </li>
              )
            )}
          </ol>
        )}
    </div>
  );
};

export default RoadmapAgent;
