import json
import os

from google import genai
from google.genai import types

from app.agent.prompts.code_agent_prompt import CODE_AGENT_SYSTEM_PROMPT

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class CodeAgent:
    """
    Handles programming queries and executes code using Gemini's Code Execution tool.
    Provides structured JSON response with brute-force and optimal solutions.
    """

    def run(self, query: str, chat_history: list):
        try:
            chat_history_text = ""
            for msg in chat_history:
                role_text = "User: " if msg["role"] == "user" else "Assistant: "
                chat_history_text += f"{role_text}{msg['content']}\n"

            contents = [
                chat_history_text.strip(),
                CODE_AGENT_SYSTEM_PROMPT.strip(),
                f"User Query: {query}",
            ]

            # Call Gemini LLM
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(code_execution=types.ToolCodeExecution)]
                ),
            )

            raw_text = response.text.strip()

            # Clean markdown fences
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`")
                if raw_text.lower().startswith("json"):
                    raw_text = raw_text[4:].strip()

            # Attempt JSON parsing
            try:
                parsed_response = json.loads(raw_text)
            except Exception:
                # Fallback minimal valid code structure
                parsed_response = {
                    "component_type": "code",
                    "title": "Code Result",
                    "content": "Default code explanation due to invalid LLM output.",
                    "brute_force_solution": {
                        "code": "# Placeholder brute-force code",
                        "explanation": "Explanation placeholder",
                    },
                    "optimal_solution": {
                        "code": "# Placeholder optimal code",
                        "explanation": "Explanation placeholder",
                    },
                    "example_usage": "Example input/output placeholder",
                    "features": ["code", "programming"],
                }

            return parsed_response

        except Exception as e:
            return {
                "component_type": "knowledge",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
