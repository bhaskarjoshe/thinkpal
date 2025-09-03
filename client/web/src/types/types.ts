export type CodeSolution = {
  code?: string;
  explanation: string;
  language?: string; // keep consistent with backend
};

export type QuizQuestion = {
  question: string;
  options?: string[];   // only for MCQ or True/False
  answer: string;
  explanation: string;  // ✅ added to match backend
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
  content: string | string[];
  content_text?: string | null;
  content_json?: QuizContent | KnowledgeContent | Record<string, any> | null;
  content_image?: string | null;

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
