import re


def clean_json_text(text: str) -> str:
    """
    Remove markdown code blocks like ```json ... ``` or ``` ... ```
    so that the text can be safely parsed as JSON.
    """
    # Remove ```json or ``` at start and ``` at end
    cleaned = re.sub(r"^```(json)?\s*", "", text.strip())
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned
