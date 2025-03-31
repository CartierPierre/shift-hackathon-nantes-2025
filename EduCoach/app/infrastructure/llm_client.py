from langchain_openai import AzureChatOpenAI
from langchain_openai import AzureOpenAIEmbeddings
from typing import Optional
import os
import numpy as np
from dotenv import load_dotenv
from app.utils.logger import setup_logger
from app.utils.token_metrics import token_handler, log_token_metrics

# Chargement des variables d'environnement
load_dotenv()
logger = setup_logger("llm")

# Configuration des modèles
EMBEDDING_MODEL = "text-embedding-3-large"

class LLMClient:
    def __init__(
        self,
        api_key: Optional[str] = None,
        api_version: Optional[str] = None,
        deployment_name: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ):
        """
        Initialise le client LLM pour Azure OpenAI.
        
        Args:
            api_key: Clé API Azure OpenAI (optionnel, utilise la variable d'environnement si non fourni)
            api_version: Version de l'API Azure OpenAI (optionnel)
            deployment_name: Nom du déploiement du modèle (optionnel)
            temperature: Température pour la génération (0.0 à 1.0) (optionnel)
            max_tokens: Nombre maximum de tokens pour la réponse (optionnel)
        """
        self.api_key = api_key or os.getenv("AZURE_OPENAI_API_KEY")
        self.api_version = api_version or os.getenv("AZURE_OPENAI_API_VERSION")
        self.deployment_name = deployment_name or os.getenv("AZURE_OPENAI_MODEL_NAME")
        self.azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        
        logger.info(f"Initialisation du LLM avec:\n"
                   f"  • API Key: ***{self.api_key[-4:]}\n"
                   f"  • API Version: {self.api_version}\n" 
                   f"  • Deployment: {self.deployment_name}\n"
                   f"  • Endpoint: {self.azure_endpoint}")

        if not all([self.api_key, self.deployment_name, self.azure_endpoint]):
            raise ValueError("Les variables d'environnement Azure OpenAI ne sont pas correctement configurées")
        
        logger.info(f"Initialisation du LLM avec le déploiement {self.deployment_name}")
        
        self.llm = AzureChatOpenAI(
            api_key=self.api_key,
            api_version=self.api_version,
            azure_endpoint=self.azure_endpoint,
            deployment_name=self.deployment_name,
            temperature=float(temperature or os.getenv("MODEL_TEMPERATURE", "0.7")),
            max_tokens=int(max_tokens or os.getenv("MAX_TOKENS", "2000")),
            callbacks=[token_handler]
        )
        
        # Initialisation du client d'embeddings
        self.embeddings = AzureOpenAIEmbeddings(
            api_version=self.api_version,
            azure_endpoint=self.azure_endpoint,
            api_key=self.api_key,
            model=EMBEDDING_MODEL,
            dimensions=3072
        )

    @log_token_metrics
    def get_llm(self):
        """
        Retourne l'instance du LLM configurée.
        """
        return self.llm
    
    def get_embeddings(self, texts: str | list[str]) -> np.ndarray:
        """
        Obtient les embeddings pour un ou plusieurs textes.
        
        Args:
            texts: Un texte ou une liste de textes à encoder
            
        Returns:
            np.ndarray: Les embeddings sous forme de tableau numpy
            
        Raises:
            ValueError: Si les textes sont vides ou trop longs
            RuntimeError: Si une erreur se produit lors du calcul des embeddings
        """
        # Convertir en liste si c'est une chaîne unique
        if isinstance(texts, str):
            texts = [texts]
            
        try:
            # Vérifier que les textes ne sont pas vides
            if not texts:
                raise ValueError("La liste de textes est vide")
                
            # S'assurer que tous les textes sont des chaînes de caractères
            texts = [str(text) for text in texts]
            
            # Vérifier la longueur des textes
            for text in texts:
                if not text.strip():
                    raise ValueError("Un des textes est vide")
                if len(text) > 8000:  # Limite arbitraire pour éviter les textes trop longs
                    raise ValueError(f"Texte trop long ({len(text)} caractères)")
            
            logger.debug(f"Calcul des embeddings pour {len(texts)} textes...")
            embeddings = self.embeddings.embed_documents(texts)
            embeddings = np.array(embeddings)
            
            logger.debug(f"Embeddings calculés avec succès, shape: {embeddings.shape}")
            return embeddings
            
        except ValueError as e:
            logger.error(f"Erreur de validation des textes: {str(e)}")
            raise
        except Exception as e:
            error_msg = f"Erreur lors du calcul des embeddings: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise RuntimeError(error_msg) from e 