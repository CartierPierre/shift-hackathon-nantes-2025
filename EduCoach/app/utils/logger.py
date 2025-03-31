import logging
import os
from datetime import datetime
from pathlib import Path

import colorlog
import yaml

COLORS = {
    "RED": "\033[31m",
    "ORANGE": "\033[38;5;208m",
    "GREEN": "\033[32m",
    "YELLOW": "\033[33m",
    "BLUE": "\033[34m",
    "MAGENTA": "\033[35m",
    "CYAN": "\033[36m",
    "RESET": "\033[0m",
}

logger = logging.getLogger("logger")


def load_log_config():
    """Charge la configuration des niveaux de log depuis le fichier de config."""
    project_root = Path(__file__).parent.parent.parent
    config_path = project_root / "config" / "logging_config.yml"
    if config_path.exists():
        with open(config_path) as f:
            return yaml.safe_load(f)

    return {"default_level": "INFO", "debug_modules": []}


def setup_logger(name: str | None = None):
    """Initialise un logger avec un nom donné.

    Args:
        name (str, optional): Nom du logger. Defaults to None.
    """
    logger_name = f"{name}" if name else "<unamed_module>"
    logger = logging.getLogger(logger_name)

    if logger.handlers:
        return logger

    # Chargement de la configuration
    log_config = load_log_config()
    default_level = getattr(logging, log_config.get("default_level", "INFO"))
    debug_modules = log_config.get("debug_modules", [])
    logger.info(f"Liste des modules de débogage: {debug_modules}")

    # Définition du niveau de log en fonction de la configuration
    logger_level = (
        logging.DEBUG if any(module in logger_name for module in debug_modules) else default_level
    )
    logger.setLevel(logger_level)

    logger.propagate = False

    file_formatter = logging.Formatter(
        "%(asctime)s - [%(name)s] - %(levelname)s - %(funcName)s - %(message)s"
    )

    console_formatter = colorlog.ColoredFormatter(
        "%(asctime)s - %(log_color)s[%(name)s] - %(levelname)s - %(funcName)s%(reset)s - %(message)s",
        "%Y-%m-%d %H:%M:%S",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "red,bg_white",
        },
    )

    if not os.path.exists("logs"):
        os.makedirs("logs")

    file_handler = logging.FileHandler(
        f"logs/educoach_{datetime.now().strftime('%Y%m%d')}.log", encoding="utf-8"
    )
    file_handler.setFormatter(file_formatter)
    file_handler.setLevel(logging.DEBUG)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(console_formatter)
    console_handler.setLevel(logging.DEBUG)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger 