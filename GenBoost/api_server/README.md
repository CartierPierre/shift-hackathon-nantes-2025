# <img src="images/Genboost-avatar-icon.png" alt="Icon" width="20" /> GenBoost api_server

Serveur API pour le moteur linguistique générant les enrichissements

<img src="images/Genboost-avatar-zoom.png" alt="GenBoost Avatar" width="200" />

## Utilisation

Lancer le serveur avec la commande (port 5000 par défaut)

Lancement en local : `python ./run.py`

Lancement par Docker : `docker compose up -d --build`

## Requirements

- dotenv
- flask
- flask-cors
- mistralai
- pytest

Pour les installer : `pip install -r requirements.txt`

## Lancement des tests unitaires

`pytest tests/`
