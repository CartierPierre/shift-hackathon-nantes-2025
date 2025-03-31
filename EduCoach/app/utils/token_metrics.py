import json
import time
from typing import Any

import tiktoken
from langchain_core.callbacks.base import BaseCallbackHandler
from langchain_core.messages import BaseMessage

from app.utils.logger import COLORS, setup_logger

logger = setup_logger("token_metrics")


class TokenMetrics:
    """Classe pour suivre l'utilisation des tokens."""

    def __init__(self):
        """Initialise les métriques."""
        self.total_tokens = 0
        self.total_prompt_tokens = 0
        self.total_completion_tokens = 0
        self.total_cost = 0
        self.calls = 0
        self.total_time = 0

    def update(self, prompt_tokens: int, completion_tokens: int, time_taken: float):
        """Met à jour les métriques."""
        self.total_prompt_tokens += prompt_tokens
        self.total_completion_tokens += completion_tokens
        self.total_tokens = self.total_prompt_tokens + self.total_completion_tokens
        self.calls += 1
        self.total_time += time_taken

    def __str__(self):
        """Retourne une représentation en chaîne des métriques."""
        return (
            f"{COLORS['BLUE']}token metrics =>{COLORS['RESET']}\n"
            f"  • Tokens - Total: {self.total_tokens:,} (Prompt: {self.total_prompt_tokens:,}, Completion: {self.total_completion_tokens:,})\n"
            f"  • Calls: {self.calls} (Avg tokens/call: {self.total_tokens / self.calls if self.calls > 0 else 0:,.0f}) - Total time: {self.total_time:.2f}s"
        )


class TokenCallbackHandler(BaseCallbackHandler):
    """Callback handler pour suivre l'utilisation des tokens."""

    def __init__(self):
        """Initialise le callback handler."""
        super().__init__()
        self.metrics = TokenMetrics()
        self._start_time = None

    def on_llm_start(self, *args, **kwargs):
        """Démarre le chronomètre."""
        self._start_time = time.time()

    def on_llm_end(self, response, *args, **kwargs):
        """Arrête le chronomètre et met à jour les métriques."""
        if self._start_time is not None:
            execution_time = time.time() - self._start_time

            # Extraire les tokens du prompt et de la complétion
            prompt_tokens = response.llm_output.get("token_usage", {}).get("prompt_tokens", 0)
            completion_tokens = response.llm_output.get("token_usage", {}).get(
                "completion_tokens", 0
            )

            # Mettre à jour les métriques
            self.metrics.update(prompt_tokens, completion_tokens, execution_time)

    def on_llm_error(self, error, *args, **kwargs):
        """Arrête le chronomètre en cas d'erreur."""
        self._start_time = None


def count_tokens(
    text: str | dict | None | BaseMessage | tuple[str, str], model: str = "gpt-4"
) -> int:
    """Compte le nombre de tokens dans un texte pour un modèle donné."""
    if text is None:
        return 0
    if isinstance(text, dict):
        text = json.dumps(text)
    if isinstance(text, BaseMessage):
        text = text.content
    if isinstance(text, tuple):
        # Pour les tuples (role, content) utilisés dans l'agent
        role, content = text
        return count_tokens(role) + count_tokens(content)
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(str(text)))


def count_messages_tokens(
    messages: list[dict[str, Any] | BaseMessage | tuple[str, str]] | dict[str, Any],
    model: str = "gpt-4",
) -> int:
    """Compte le nombre de tokens dans une liste de messages ou un état."""
    if isinstance(messages, dict) and "messages" in messages:
        # Si c'est un état avec une clé "messages"
        return count_messages_tokens(messages["messages"], model)

    total = 0
    for msg in messages:
        if isinstance(msg, BaseMessage):
            total += count_tokens(msg.content, model)
            total += count_tokens(msg.type, model)
        elif isinstance(msg, tuple):
            # Pour les tuples (role, content)
            total += count_tokens(msg)
        elif isinstance(msg, dict):
            total += count_tokens(msg.get("content"), model)
            total += count_tokens(msg.get("role"), model)
    return total


def log_token_metrics(func):
    """Décorateur pour logger les métriques de tokens après l'exécution d'une fonction."""

    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)

        logger.info("%s", token_handler.metrics)

        return result

    return wrapper


metrics = TokenMetrics()
token_handler = TokenCallbackHandler() 