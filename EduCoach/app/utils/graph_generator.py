from langgraph.graph import StateGraph
from app.core.agent import create_agent
from app.utils.logger import setup_logger
import os

logger = setup_logger("graph_generator")

def generate_graph(graph_instance, filename: str) -> None:
    """Génère une visualisation du graphe et la sauvegarde en tant que fichier PNG.

    Args:
        graph_instance: L'instance du graphe à visualiser
        filename: Nom du fichier de sortie (sans extension)
    """
    try:
        # Génération du code Mermaid pour la visualisation
        mermaid_code = graph_instance.get_graph().draw_mermaid()
        # Force le layout horizontal
        mermaid_code = mermaid_code.replace("graph TD;", "graph LR;")

        # Génération de l'image PNG
        graph_img = graph_instance.get_graph().draw_mermaid_png()
        output_path = f"{filename}.png"
        with open(output_path, "wb") as f:
            f.write(graph_img)
        logger.info(f"Graphe sauvegardé sous '{output_path}'")
    except Exception as e:
        logger.error(f"Erreur lors de la génération du graphe '{filename}': {e}")

def generate_all_graphs():
    """Génère la visualisation pour tous les graphes disponibles."""
    try:
        # Récupération de la clé API
        api_key = os.getenv("AZURE_OPENAI_API_KEY")
        if not api_key:
            raise ValueError("La clé API Azure OpenAI n'est pas configurée")

        # Génération du graphe pour l'agent principal
        agent = create_agent(api_key=api_key)
        generate_graph(agent, "educoach_agent_graph")

        logger.info("Tous les graphes ont été générés avec succès")

    except Exception as e:
        logger.error(f"Erreur dans le processus de génération des graphes: {e}")

def main():
    generate_all_graphs()

if __name__ == "__main__":
    generate_all_graphs() 