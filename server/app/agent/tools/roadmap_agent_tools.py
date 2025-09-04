import os

import requests
from app.config.logger_config import logger
from google.adk.tools import FunctionTool


def youtube_tool_func(query: str, max_results: int = 5) -> str:
    """
    Functional tool to fetch relevant YouTube videos for a given topic.
    Returns a string list of videos with title and link, suitable for roadmap resources.
    """
    search_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": os.getenv("GOOGLE_CSE_API_KEY"),
    }

    try:
        logger.info(f"Fetching YouTube videos for query: {query}")
        response = requests.get(search_url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json().get("items", [])

        if not data:
            return f"No YouTube videos found for '{query}'."

        results = []
        for item in data:
            title = item["snippet"]["title"]
            video_id = item["id"]["videoId"]
            url = f"https://www.youtube.com/watch?v={video_id}"
            results.append(f"{title}: {url}")

        logger.info(f"Successfully fetched YouTube videos for query: {query}")
        return "\n".join(results)

    except requests.RequestException as e:
        logger.error(f"Error fetching YouTube videos: {e}")
        return f"Error fetching YouTube videos: {e}"


youtube_agent_func_tool = FunctionTool(func=youtube_tool_func)

