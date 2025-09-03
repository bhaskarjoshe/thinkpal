import os

import requests
from app.config.logger_config import logger
from google.adk.tools import FunctionTool


def generate_image_tool(prompt: str) -> str:
    """
    Takes a text prompt, generates an image using HuggingFace Stable Diffusion,
    saves it locally, and returns a URL to access it.
    """
    HF_TOKEN = os.getenv("HF_TOKEN")
    HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/sd-turbo"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}

    STATIC_DIR = "static/images"
    os.makedirs(STATIC_DIR, exist_ok=True)

    logger.info(f"Generating image locally: {prompt}")
    logger.debug(f"HF TOKEN present: {bool(HF_TOKEN)}")

    response = requests.post(HF_API_URL, headers=headers, json={"inputs": prompt})

    if response.status_code != 200:
        logger.error(f"HF API error {response.status_code}: {response.text}")
        return "Error generating image."

    image_bytes = response.content
    filename = f"{prompt[:20].replace(' ', '_')}.png"
    filepath = os.path.join(STATIC_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(image_bytes)

    image_url = f"http://localhost:8000/{STATIC_DIR}/{filename}"
    logger.info(f"Image saved to: {image_url}")

    return image_url


def fetch_image_url(query: str) -> str:
    """Fetch the first image URL from Google Custom Search."""
    try:
        search_url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": os.getenv("GOOGLE_CSE_API_KEY"),
            "cx": os.getenv("GOOGLE_CSE_ID"),
            "q": query,
            "searchType": "image",
            "num": 1,
            "safe": "off",
        }
        response = requests.get(search_url, params=params)
        data = response.json()
        logger.info("successful Google CSE Response ")
        if "items" in data and len(data["items"]) > 0:
            logger.info(
                f"successful Google CSE Response with image URL: {data['items'][0]['link']}"
            )
            return data["items"][0]["link"]
        logger.warning("Google CSE Response with no image URL")
        return ""
    except Exception as e:
        logger.error("Error fetching image:", e)
        return ""


generate_image_tool_func_tool = FunctionTool(func=generate_image_tool)
fetch_image_url_tool_func_tool = FunctionTool(func=fetch_image_url)
