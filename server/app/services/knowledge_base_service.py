from app.config.logger_config import logger


def search_in_knowledge_base(query: str):
    try:
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
    except Exception as e:
        logger.exception(f"Error in searching in knowledge base: {e}")
        return {"facts": []}
