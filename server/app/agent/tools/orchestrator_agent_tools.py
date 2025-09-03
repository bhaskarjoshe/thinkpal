from app.utils.history_cleaner import clean_chat_history
from google.adk.tools import FunctionTool


def route_query_tool(inputs: dict) -> str:
    """
    Route and analyze student queries to determine appropriate agent selection.

    Args:
        inputs: Dictionary containing query and chat history

    Returns:
        Analysis of the query for routing purposes
    """
    query = inputs.get("query", "")
    chat_history = inputs.get("chat_history", [])
    clean_history = clean_chat_history(chat_history)
    history_text = "\n".join(
        [f"{m['role'].capitalize()}: {m['content']}" for m in clean_history]
    )

    return f"""
Student's Recent Conversation (last messages):
{history_text}

New Student Query:
"{query}"
"""


route_query_func_tool = FunctionTool(func=route_query_tool)
