import os

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class VisualLearningAgent:
    """
    Handles diagrams, charts, and flowcharts using Gemini Diagram Generation tool.
    """

    def run(self, query: str):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(diagram_generation=types.ToolDiagramGeneration)]
                ),
            )
            return {
                "component_type": "card",
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
