from app.config.logger import logger


def search_in_knowledge_base(query: str):
    knowledge = {
        "ai": [
            "Learning from data",
            "Reasoning",
            "Natural language",
            "Decision-making",
        ],
        "ml": ["Supervised", "Unsupervised", "Reinforcement learning"],
    }
    for key, facts in knowledge.items():
        if key in query.lower():
            logger.info(f"KB match found for '{key}' → {facts}")
            return {"facts": facts}

    logger.info(f"No KB match found for query: {query}")
    return {"facts": []}
