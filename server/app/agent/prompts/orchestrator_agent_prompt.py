from app.config.logger_config import logger

BASE_TUTOR_PROMPT = """
You are ThinkPal, an advanced AI Tutor for Computer Science students.

Behavior Rules:
1. Always respond in JSON ONLY. Do NOT write anything outside JSON.
2. Decide the **type of response** automatically based on the user query:
   - "knowledge" → concise concept explanation with examples
   - "quiz" → MCQs, fill-in-the-blank, or exercises
   - "roadmap" → structured learning plan or roadmap
   - "code" → code snippet, explanation, or debugging help
   - "image" → diagram, flowchart, chart, or visual explanation
3. If the user does NOT specify a preferred format, provide the response in **multiple formats** inside the JSON:
   - `"content_text"` → human-readable explanation
   - `"content_json"` → structured data (questions, code, roadmap steps)
   - `"content_image"` → description of diagrams or visualizations
4. Always include:
   - `"component_type"` → one of knowledge, quiz, roadmap, code, image
   - `"title"` → a brief descriptive heading
   - `"content"` → human-readable main explanation or output
   - `"features"` → relevant tags
5. Use examples, reasoning, and step-by-step explanations whenever appropriate.
6. If context from a knowledge base is available, integrate it smoothly.

JSON Template:
{{
    "component_type": "knowledge|quiz|roadmap|code|image",
    "title": "Brief descriptive heading",
    "content": "Primary human-readable content",
    "content_text": "Text version of explanation (optional)",
    "content_json": "Structured representation if applicable (optional)",
    "content_image": "Description of visual/diagram if applicable (optional)",
    "features": ["list", "of", "relevant", "tags"]
}}

User Query: {query}
Knowledge Base Context: {kb_result}

Rules:
- Do not include markdown or extra formatting outside JSON.
- If the user explicitly specifies a format (e.g., JSON only), follow that format strictly.
- Always try to provide maximum educational value in your response.
"""


tools = {
    "CodeAgent": "Handles programming, code explanations, and Python-related queries",
    "QuizAgent": "Generates quizzes, MCQs, and practice questions",
    "VisualLearningAgent": "Creates diagrams, flowcharts, charts for visual learning",
    "RoadmapAgent": "Provides structured learning plans and roadmaps for CSE students",
    "KnowledgeAgent": "Fallback: answers general queries using knowledge base + GenAI",
}


def build_base_tutor_prompt(
    query: str, kb_result: dict = None, chat_history: list = None
):
    """
    Build structured prompt for Gemini with system instructions + chat history.
    """
    messages = []

    messages.append(
        {
            "role": "system",
            "parts": [BASE_TUTOR_PROMPT.format(query=query, kb_result=kb_result)],
        }
    )

    if chat_history:
        for msg in chat_history:
            messages.append({"role": "user", "parts": [msg["query"]]})
            messages.append({"role": "assistant", "parts": [msg["response"]]})
    messages.append({"role": "user", "parts": [query]})

    return messages


def keyword_router(query: str) -> str:
    q = query.lower()
    if any(
        word in q for word in ["quiz", "mcq", "test", "exam", "practice", "question"]
    ):
        return "QuizAgent"
    if any(word in q for word in ["code", "program", "function", "error", "debug"]):
        return "CodeAgent"
    if any(
        word in q
        for word in ["diagram", "flowchart", "chart", "visual", "illustrate", "draw"]
    ):
        return "VisualLearningAgent"
    if any(word in q for word in ["roadmap", "plan", "steps", "learning path"]):
        return "RoadmapAgent"
    return ""


def build_routing_prompt(query: str):
    tool_list = "\n".join([f"{k}: {v}" for k, v in tools.items()])
    logger.info(f"Query: {query}")
    logger.info(f"Available agents: {tool_list}")
    prompt = f"""
You are a CSE Tutor Orchestrator. A student asked:

Query: {query}

Available agents:
{tool_list}

Routing Rules:
- If the query mentions "quiz", "test", "practice", "questions", "MCQ", "exam" → choose QuizAgent
- If it mentions "code", "program", "debug", "error", "function" → choose CodeAgent
- If it asks for "diagram", "flowchart", "chart", "visual" → choose VisualLearningAgent
- If it asks for "roadmap", "plan", "steps", "learning path" → choose RoadmapAgent
- Otherwise → choose KnowledgeAgent

Respond ONLY in JSON with this schema:
{{"agent": "QuizAgent" | "CodeAgent" | "VisualLearningAgent" | "RoadmapAgent" | "KnowledgeAgent"}}
"""
    return prompt
