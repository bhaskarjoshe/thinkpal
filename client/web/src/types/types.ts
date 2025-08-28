export type UIComponent = {
  component_type: "card" | "knowledge" | "list" | "quiz" | "roadmap" | "code" | "image";
  title?: string;
  content?: string;
  content_json?: any;
  content_image?: string;
  features?: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};
