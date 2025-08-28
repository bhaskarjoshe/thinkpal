

class RoadmapAgent:
    """
    Generates structured learning roadmaps for CSE topics.
    """

    def run(self, query: str):
        query_lower = query.lower()
        if "plan" in query_lower:
            content = f"Structured roadmap for {query}"
        elif "path" in query_lower:
            content = f"Suggested learning path for {query}"
        else:
            content = f"Prerequisites for {query}"
        return {
            "component_type": "roadmap",
            "title": "Learning Roadmap",
            "content": content,
            "features": ["roadmap", "learning", "CSE"],
        }
