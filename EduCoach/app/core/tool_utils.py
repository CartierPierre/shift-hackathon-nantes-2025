import json
from collections.abc import Callable
from decimal import Decimal
from functools import wraps
from typing import Any

from langchain_core.messages import AnyMessage, ToolMessage
from langchain_core.runnables import RunnableLambda
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
from pydantic import BaseModel

from app.utils.logger import COLORS, setup_logger

logger = setup_logger("tools")


def log_tool_execution(tool_name: str):
    """Décorateur pour gérer les logs d'exécution des tools de manière cohérente."""

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            try:
                # Log de début d'exécution
                first_arg = args[0] if args else kwargs.get(next(iter(kwargs)))
                logged_input = (
                    str(first_arg)[:50] + "..." if len(str(first_arg)) > 50 else str(first_arg)
                )
                logger.info(
                    f"{COLORS['ORANGE']}({tool_name}){COLORS['RESET']} Exécution avec paramètre: {logged_input}"
                )

                # Exécution de la fonction
                result = func(*args, **kwargs)

                # Log des résultats en debug
                logger.debug(
                    f"{COLORS['ORANGE']}({tool_name}){COLORS['RESET']} Résultats: {result}"
                )

                return result

            except Exception as e:
                logger.error(
                    f"{COLORS['ORANGE']}({tool_name}){COLORS['RESET']} Erreur inattendue: {str(e)}",
                    exc_info=True,
                )
                return json.dumps({"error": f"Erreur inattendue: {str(e)}"})

        return wrapper

    return decorator


class DecimalEncoder(json.JSONEncoder):
    """Encodeur JSON pour les objets Decimal."""

    def default(self, obj):
        """Encodeur JSON pour les objets Decimal."""
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


def clean_description(description: str) -> str:
    """Nettoie une description avant la recherche d'UO."""
    main_desc = description.split("\n")[0].strip()
    if not main_desc:
        main_desc = description.strip()
    logger.debug(f"Description nettoyée: {main_desc}")
    return main_desc


def preserve_tool_docstring(func):
    """Préserve la docstring originale lors de l'utilisation du décorateur @tool."""
    wrapped = tool(func)
    wrapped.__doc__ = func.__doc__
    return wrapped


def handle_tool_error(state) -> dict:
    """Handle errors from a tool call."""
    error = state.get("error")
    tool_calls = state["messages"][-1].tool_calls
    return {
        "messages": [
            ToolMessage(
                content=f"Error: {repr(error)}\n please fix your mistakes.",
                tool_call_id=tc["id"],
            )
            for tc in tool_calls
        ]
    }


def create_tool_node_with_fallback(tools: list) -> dict:
    """Create a ToolNode with a fallback to handle errors."""
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)], exception_key="error"
    )


def tools_condition(
    state: list[AnyMessage] | dict[str, Any] | BaseModel,
    messages_key: str = "messages",
    tool_name: str = "tools",
    callback_node: str = "__end__",
) -> str:
    """Use in the conditional_edge to route to the ToolNode if the last message.

    has tool calls. Otherwise, route to the callback node.

    Args:
        state (Union[list[AnyMessage], dict[str, Any], BaseModel]): The state to check for
            tool calls.
        messages_key (str): The key to use to get messages from the state.
        tool_name (str): The name of the tool to route to if tool calls are present.
        callback_node (str): The node to route to if no tool calls are present.

    Returns:
        The next node to route to.
    """
    if isinstance(state, list):
        ai_message = state[-1]
    elif isinstance(state, dict) and (messages := state.get(messages_key, [])):
        ai_message = messages[-1]
    elif messages := getattr(state, messages_key, []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")

    has_tool_calls = hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0
    return tool_name if has_tool_calls else callback_node


def reset_tool_cache() -> None:
    """Réinitialise tous les caches LRU des fonctions d'outils.

    Cette fonction vide les caches pour toutes les fonctions décorées avec lru_cache
    dans le module des outils, permettant aux appels suivants de générer de nouveaux
    résultats plutôt que d'utiliser des résultats en cache.
    """
    # Importation ici pour éviter les dépendances circulaires
    from app.core.services.tools.tools import (
        search_document_impl,
        search_quote_items_impl,
        search_uo_impl,
    )

    # Réinitialisation des caches individuels
    search_uo_impl.cache_clear()
    search_quote_items_impl.cache_clear()
    search_document_impl.cache_clear()

    return None 