def serialize_chat_history(messages):
    """Convert DB ChatMessage objects to LLM-readable format."""
    history = []
    for msg in messages:
        history.append({"role": "user", "content": msg.query})
        history.append(
            {
                "role": "assistant",
                "content": (
                    msg.response
                    if isinstance(msg.response, str)
                    else msg.response.get("content", "")
                ),
            }
        )
    return history
