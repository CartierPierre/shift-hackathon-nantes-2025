# EduCoach

Un assistant éducatif intelligent utilisant l'IA pour aider les étudiants dans leur apprentissage.

## Installation

1. Assurez-vous d'avoir Python 3.9+ installé
2. Installez Poetry :
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. Clonez le repository et installez les dépendances :
```bash
git clone [URL_DU_REPO]
cd EduCoach
poetry install
```

4. Configurez votre environnement :
   - Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
   - Modifiez le fichier `.env` avec vos valeurs :
     - `AZURE_OPENAI_API_KEY` : Votre clé API Azure OpenAI
     - `AZURE_OPENAI_DEPLOYMENT_NAME` : Le nom de votre déploiement
     - Les autres variables sont optionnelles et peuvent être laissées par défaut

## Utilisation

Pour lancer l'application :
```bash
poetry run streamlit run app/main.py
```

L'application sera accessible à l'adresse : http://localhost:8501

## Configuration

### Variables d'environnement
Le fichier `.env` permet de configurer :
- Les paramètres de connexion à Azure OpenAI
- Les paramètres de l'application (environnement, debug, logging)
- Les paramètres du modèle (température, tokens max)

### Logging
Le système de logging est configuré via le fichier `config/logging_config.yml` :
- `default_level` : Niveau de log par défaut (INFO, DEBUG, WARNING, ERROR, CRITICAL)
- `debug_modules` : Liste des modules pour lesquels le niveau DEBUG est activé

Les logs sont stockés dans le dossier `logs/` avec le format :
- Console : Logs colorés avec timestamp, nom du module, niveau, fonction et message
- Fichier : Logs détaillés dans `logs/educoach_YYYYMMDD.log`

## Fonctionnalités

- Interface de chat intuitive avec Streamlit
- Agent conversationnel basé sur LangGraph
- Historique des conversations
- Réponses générées par Azure OpenAI (GPT-3.5-turbo)
- Gestion des erreurs et des exceptions
- Architecture modulaire avec séparation des responsabilités
- Configuration flexible via variables d'environnement
- Système de logging avancé avec :
  - Logs colorés dans la console
  - Logs détaillés dans des fichiers journaliers
  - Configuration flexible des niveaux de log par module
  - Suivi des tokens et des appels API