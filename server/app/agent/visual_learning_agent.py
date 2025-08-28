import os

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class VisualLearningAgent:
    """
    Handles diagrams, charts, and flowcharts using Gemini Diagram Generation tool.
    """

    def run(self, query: str, chat_history: list):
        try:
            messages = []

            messages.append(
                {
                    "role": "system",
                    "parts": [
                        "You are a Visual Learning Assistant. "
                        "Always generate explanations as diagrams, flowcharts, or charts when possible. "
                        "Keep responses concise but educational. If text is needed, make it minimal."
                    ],
                }
            )

            if chat_history:
                for msg in chat_history:
                    messages.append({"role": "user", "parts": [msg["query"]]})
                    messages.append({"role": "model", "parts": [msg["response"]]})

            messages.append({"role": "user", "parts": [query]})

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=messages,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(diagram_generation=types.ToolDiagramGeneration())]
                ),
            )

            return {
                "component_type": "visual",
                "title": "Visual Learning",
                "content": response.text,
                "features": ["visual", "diagram", "chart"],
            }

        except Exception as e:
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
