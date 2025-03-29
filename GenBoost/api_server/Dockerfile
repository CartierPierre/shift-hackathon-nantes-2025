# Dockerfile

# Utiliser une image de base officielle de Python
FROM python:3.12-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers requirements.txt et installer les dépendances
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copier tout le contenu du projet dans le conteneur
COPY . .

# Exposer le port sur lequel Flask va tourner (5000 par défaut)
EXPOSE 5000

# Lancer le script de démarrage
CMD ["./start.sh"]