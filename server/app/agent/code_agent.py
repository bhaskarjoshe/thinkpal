import os

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class CodeAgent:
    """
    Handles programming queries and executes code using Gemini's Code Execution tool.
    """

    def run(self, query: str):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(code_execution=types.ToolCodeExecution)]
                ),
            )
            # Parse JSON output if returned as string
            return {
                "component_type": "card",
                "title": "Code Result",
                "content": response.text,
                "features": ["code", "programming"],
            }
        except Exception as e:
            return {
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
