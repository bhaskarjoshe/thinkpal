def clean_chat_history(chat_history: list) -> list:
    """Remove malformed assistant messages to avoid confusing the routing LLM."""
    clean_history = []
    for m in chat_history[-5:]:
        if m.get("role") not in ["user", "assistant"]:
            continue
        content = m.get("content")
        if content is None or content.strip() == "":
            continue
        if content in ["'message'", "unhashable type: 'list'"]:
            continue
        clean_history.append({"role": m["role"], "content": content})
    return clean_history
