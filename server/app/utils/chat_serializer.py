def serialize_chat_history(messages):
    """Convert DB ChatMessage objects to Gemini-compatible chat format."""
    history = []
    for msg in messages:
        history.append({
            "role": "user",
            "parts": [msg.query]
        })

        response_text = (
            msg.response
            if isinstance(msg.response, str)
            else msg.response.get("content", "")
        )
        history.append({
            "role": "model", 
            "parts": [response_text]
        })
    return history
