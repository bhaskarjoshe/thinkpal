tools = {
    "CodeAgent": "Handles programming, code explanations, and Python-related queries",
    "QuizAgent": "Generates quizzes, MCQs, and practice questions",
    "VisualLearningAgent": "Creates diagrams, flowcharts, charts for visual learning",
    "RoadmapAgent": "Provides structured learning plans and roadmaps for CSE students",
    "KnowledgeAgent": "Fallback: answers general queries using knowledge base + GenAI",
}


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
