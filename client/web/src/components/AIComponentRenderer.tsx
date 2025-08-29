import type { UIComponent } from "../types/types";
import CodeAgent from "./agents/CodeAgent";
import KnowledgeAgent from "./agents/KnowledgeAgent";
import QuizAgent from "./agents/QuizAgent";
import RoadmapAgent from "./agents/RoadmapAgent";
import VisualAgent from "./agents/VisualAgent";

export const AIComponentRenderer = ({
  setInputQuery,
  components,
}: {
  setInputQuery: (query: string) => void;
  components: UIComponent[];
}) => {
  if (!components || components.length === 0) {
    return <p className="text-gray-500">No results to display</p>;
  }
  console.log("Components:", components);
  return (
    <div className="space-y-4">
      {components.map((component, index) => {
        switch (component.component_type) {
          case "quiz":
            return <QuizAgent component={component} index={index} />;

          case "roadmap":
            return (
              <RoadmapAgent
                component={component}
                index={index}
                setInputQuery={setInputQuery}
              />
            );

          case "code":
            return (
              <CodeAgent key={index} component={component} index={index} />
            );

          case "visual":
            return (
              <VisualAgent key={index} component={component} index={index} />
            );

          case "knowledge":
            return (
              <KnowledgeAgent
                key={index}
                component={component}
                index={index}
                setInputQuery={setInputQuery}
              />
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
