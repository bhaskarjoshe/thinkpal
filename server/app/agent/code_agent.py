import json
import os

from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class CodeAgent:
    """
    Handles programming queries and executes code using Gemini's Code Execution tool.
    Provides structured JSON response with brute-force and optimal solutions.
    """

    def run(self, query: str, chat_history: list):
        try:
            # Convert chat history into Gemini-friendly format
            chat_history_text = ""
            for msg in chat_history:
                role_text = "User: " if msg["role"] == "user" else "Assistant: "
                chat_history_text += f"{role_text}{msg['content']}\n"

            # Strong system prompt with structured fields for code
            system_prompt = """
You are CodeAgent. Generate a JSON object strictly following this schema:

{
  "component_type": "code",
  "title": "string (short description of the problem)",
  "content": "string (brief summary of the problem)",
  "brute_force_solution": {
    "code": "string (actual code for brute-force approach, must compile)",
    "explanation": "string (explanation of the brute-force approach)"
  },
  "optimal_solution": {
    "code": "string (actual code for optimal approach, must compile)",
    "explanation": "string (explanation of the optimal approach)"
  },
  "example_usage": "string (demonstration of how to run the code with input/output)",
  "features": ["code", "programming", "algorithm"]
}

Rules:
1. Provide **both brute-force and optimal solutions**, clearly separated.
2. Include **code in each solution**, never omit it.
3. Include **explanations** for each solution.
4. Include **an example usage**.
5. Return only valid JSON, **do not include markdown fences** or extra text.
6. Use triple quotes for multi-line code if needed within JSON strings.
"""

            contents = [
                chat_history_text.strip(),
                system_prompt.strip(),
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
                "component_type": "card",
                "title": "Error",
                "content": str(e),
                "features": [],
            }
