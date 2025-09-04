export type Subtopic = {
  name: string;
  description: string;
  examples?: string[];
};

export type Topic = {
  topic_name: string;
  brief: string;
  subtopics: Subtopic[];
  resources: string[];
  video_resources: string[];
  expected_outcome: string;
};

export type Level = {
  level_name: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  topics: Topic[];
};

export type RoadmapContent = {
  roadmap_type: "structured";
  levels: Level[] | Record<string, Topic[]>;
};

export type CodeSolution = {
  code?: string;
  explanation: string;
  language?: string;
};

export type QuizQuestion = {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export type QuizContent = {
  quiz_type: "mcq" | "true_false" | "fill_blank";
  questions: QuizQuestion[];
  next_teacher_prompt?: string;
};

export type Feature = {
  label: string;
  description: string;
};

export type RelatedTopic = {
  label: string;
  description: string;
};

export type ExtraQuestion = {
  question: string;
  answer: string;
};

export type ForwardQuestion = {
  title: string;
  question: string;
};

export type VisualContent = {
  title: string;
  content: string;
  image_url: string;
};

export type KnowledgeContent = {
  features: Feature[];
  next_topics_to_learn?: RelatedTopic[];
  smart_choices?: { label: string; action: string }[];
  next_teacher_prompt?: string;
};

export type UIComponent = {
  component_type:
    | "knowledge"
    | "list"
    | "quiz"
    | "roadmap"
    | "code"
    | "visual"
    | "text";

  title: string;
  content?: string | string[];
  content_text?: string | null;
  content_json?: 
    | QuizContent
    | KnowledgeContent
    | VisualContent
    | RoadmapContent
    | Record<string, any>
    | null;

  image_url?: string | null;
  features: (string | Feature)[];
  related_topics?: (string | RelatedTopic)[];
  next_topics_to_learn?: (string | RelatedTopic)[];

  brute_force_solution?: CodeSolution;
  optimal_solution?: CodeSolution;
  example_usage?: string;
  children?: UIComponent[];

  extra_question?: ExtraQuestion;
  extra_code_problems?: ForwardQuestion[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content?: string;
  ui_components?: UIComponent[];
};

export interface RoadmapAgentProps {
  component: UIComponent;
}
