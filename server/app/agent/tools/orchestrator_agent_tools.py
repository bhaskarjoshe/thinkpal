from app.utils.history_cleaner import clean_chat_history
from google.adk.tools import FunctionTool


def route_welcome_tool(inputs: dict) -> str:
    user = inputs.get("user")
    return f"""
Welcome {user['name']} 👋
Semester: {user.get('semester', 'Unknown')}
Skills: {', '.join(user.get('skills', []))}
Interests: {', '.join(user.get('interests', []))}
Programming Languages: {', '.join(user.get('programming_languages', []))}

What would you like to learn today?
"""


def route_query_tool(inputs: dict) -> str:
    query = inputs.get("query", "")
    chat_history = inputs.get("chat_history", [])
    clean_history = clean_chat_history(chat_history)
    history_text = "\n".join(
        [f"{m['role'].capitalize()}: {m['content']}" for m in clean_history]
    )

    return f"""
Student’s Recent Conversation (last messages):
{history_text}

New Student Query:
"{query}"
"""


route_welcome_func_tool = FunctionTool(func=route_welcome_tool)
route_query_func_tool = FunctionTool(func=route_query_tool)
