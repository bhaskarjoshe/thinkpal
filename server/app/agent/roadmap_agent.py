import json
import os
from typing import List

from app.schemas.ui_schema import UIComponent
from google import genai
from app.agent.prompts.roadmap_agent_prompt import ROADMAP_AGENT_PROMPT

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class RoadmapAgent:
    """
    Generates a flattened learning roadmap for any topic.
    Returns a JSON compatible with UIComponent.
    """

    def run(self, query: str, chat_history: List[dict]):
        try:
            messages: List[str] = [ROADMAP_AGENT_PROMPT]
            for msg in chat_history:
                messages.append(f"User: {msg['content']}")
            messages.append(f"User: {query}")

            # Minimal JSON template for model to fill
            template = {
                "component_type": "roadmap",
                "title": f"Learning Roadmap: {query}",
                "content": "Brief description of the roadmap",
                "content_json": {
                    "levels": [
                        {"level_name": "Beginner", "description": "", "topics": []},
                        {"level_name": "Intermediate", "description": "", "topics": []},
                        {"level_name": "Advanced", "description": "", "topics": []},
                    ]
                },
                "features": ["roadmap", "learning"],
                "next_topics_to_learn": [],
            }
            messages.append(
                f"Fill this JSON template with a roadmap relevant to the query:\n{json.dumps(template, indent=2)}"
            )

            # Call Gemini API
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=messages,  # <-- List of strings, NOT dicts
            )

            # Extract raw text
            raw_text = getattr(response, "text", None)
            if not raw_text:
                raw_text = getattr(response, "output_text", "")

            try:
                parsed = json.loads(raw_text)
            except Exception:
                parsed = template

            # Ensure 'content' key exists
            if "content" not in parsed:
                parsed["content"] = "Detailed roadmap could not be generated."

            # Return as UIComponent
            return UIComponent(**parsed)

        except Exception as e:
            return UIComponent(
                component_type="knowledge", title="Error", content=str(e), features=[]
            )
