export type CodeSolution = {
  code: string;
  explanation: string;
};

export type QuizQuestion = {
  question: string;
  options?: string[];
  answer: string;
};

export type QuizContent = {
  quiz_type: "mcq" | "true_false" | "fill_blank";
  questions: QuizQuestion[];
};

export type UIComponent = {
  component_type:
    | "card"
    | "knowledge"
    | "list"
    | "quiz"
    | "roadmap"
    | "code"
    | "image"
    | "text";
  title: string;
  content: string;
  content_text?: string | null;
  content_json?: QuizContent | Record<string, any> | null;
  content_image?: string | null;
  features: string[];
  next_topics_to_learn?: string[];
  // Optional fields for CodeAgent
  brute_force_solution?: CodeSolution;
  optimal_solution?: CodeSolution;
  example_usage?: string;
};


export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};
