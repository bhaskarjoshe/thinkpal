import requests
from app.config.logger_config import logger
from google.adk.tools import FunctionTool


def wikidata_tool_func(query: str) -> str:
    """
    Functional tool to fetch factual information about a CSE topic from Wikidata.
    """
    sparql_query = f"""
    SELECT ?item ?itemLabel ?description WHERE {{
      ?item ?label "{query}"@en.
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 5
    """
    url = "https://query.wikidata.org/sparql"
    headers = {"Accept": "application/json"}

    try:
        logger.info(f"Fetching data from Wikidata for query: {query}")
        response = requests.get(
            url, params={"query": sparql_query}, headers=headers, timeout=5
        )
        response.raise_for_status()
        data = response.json().get("results", {}).get("bindings", [])
        if not data:
            return f"No data found for '{query}' on Wikidata."

        results = []
        for item in data:
            label = item.get("itemLabel", {}).get("value", "")
            description = item.get("description", {}).get("value", "")
            results.append(f"{label}: {description}")
        logger.info(f"Successfully fetched data from Wikidata for query: {query}")
        return "\n".join(results)

    except requests.RequestException as e:
        logger.error(f"Error fetching data from Wikidata: {e}")
        return f"Error fetching data from Wikidata: {e}"


wikidata_agent_func_tool = FunctionTool(
    func=wikidata_tool_func,
)
