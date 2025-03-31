import streamlit as st
from app.interface.streamlit_app import StreamlitInterface
from app.utils.logger import setup_logger
from dotenv import load_dotenv

# Configuration du logger
logger = setup_logger(__name__)

# Chargement des variables d'environnement
load_dotenv()

def main():
    """Point d'entrée principal de l'application."""
    try:
        app = StreamlitInterface()
        app.run()
        logger.info("Application Streamlit démarrée avec succès")
    except Exception as e:
        logger.error(f"Erreur lors du démarrage de l'application : {e}")
        raise

if __name__ == "__main__":
    main() 