def serialize_chat_history(messages):
    """Convert DB ChatMessage objects to a continuous string format for Gemini."""
    history = []
    for msg in messages:
        user_text = msg.query if isinstance(msg.query, str) else str(msg.query)
        history.append({"role": "user", "content": user_text})

        response_text = ""
        if isinstance(msg.response, str):
            response_text = msg.response
        elif isinstance(msg.response, dict):
            response_text = msg.response.get("content", "")
            if msg.response.get("content_text"):
                response_text += "\n" + msg.response["content_text"]

        history.append(
            {
                "role": "assistant",
                "content": response_text,
            }
        )
    return history
