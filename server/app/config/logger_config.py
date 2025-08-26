# app/logger.py
import logging
import sys
from logging.config import dictConfig

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,  # keep uvicorn & fastapi loggers
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "level": "DEBUG",
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
        },
    },
    "root": {  # applies to uvicorn + your app
        "level": "INFO",
        "handlers": ["default"],
    },
    "loggers": {
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {"level": "INFO"},
        "app": {"level": "DEBUG", "handlers": ["default"], "propagate": False},
    },
}

dictConfig(LOGGING_CONFIG)

logger = logging.getLogger("app")
