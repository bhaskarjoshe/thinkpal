from app.utils.history_cleaner import clean_chat_history
from google.adk.tools import FunctionTool


def route_welcome_tool(inputs: dict) -> str:
    """
    Route welcome messages and provide personalized greeting.

    Args:
        inputs: Dictionary containing user information

    Returns:
        Personalized welcome message
    """
    user = inputs.get("user", {})

    # If user is a string (username), convert to dict with just 'name'
    if isinstance(user, str):
        user = {"name": user}

    # Ensure all fields are present and of the correct type
    name = user.get("name", "Guest")
    semester = user.get("semester", "Unknown")
    skills = (
        ", ".join(user.get("skills", []))
        if isinstance(user.get("skills"), list)
        else ""
    )
    interests = (
        ", ".join(user.get("interests", []))
        if isinstance(user.get("interests"), list)
        else ""
    )
    programming_languages = (
        ", ".join(user.get("programming_languages", []))
        if isinstance(user.get("programming_languages"), list)
        else ""
    )

    return f"""Welcome {name} 👋
Semester: {semester}
Skills: {skills}
Interests: {interests}
Programming Languages: {programming_languages}

What would you like to learn today?
"""


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


# Create FunctionTool instances with proper descriptions for Google ADK
route_welcome_func_tool = FunctionTool(func=route_welcome_tool)

route_query_func_tool = FunctionTool(func=route_query_tool)
