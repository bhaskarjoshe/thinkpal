from app.utils.history_cleaner import clean_chat_history
from google.adk.tools import FunctionTool


def format_agent_input_tool(inputs: dict, query_label: str = "Student Query") -> str:
    """
    Formats chat history and query for any agent LLM.

    inputs: {
        "query": str,
        "chat_history": list[dict]
    }
    query_label: Label to use for the student's query (e.g., 'Student Programming Query')
    """
    query = inputs.get("query", "")
    chat_history = inputs.get("chat_history", [])
    clean_history = clean_chat_history(chat_history)

    history_text = "\n".join(
        [f"{m['role'].capitalize()}: {m['content']}" for m in clean_history]
    )

    return f"""
Chat History:
{history_text}

{query_label}:
"{query}"
"""


format_agent_input_func_tool = FunctionTool(func=format_agent_input_tool)
