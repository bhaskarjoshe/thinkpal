export type UIComponent = {
  component_type: "card" | "text" | "list";
  title?: string;
  content?: string;
  features?: string[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};
