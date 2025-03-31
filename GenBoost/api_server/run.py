import os, re, json
from mistralai import Mistral
from flask import Flask, request, jsonify
from flask_cors import CORS
from rhese import decoupe_rhese
from entites import list_entites, list_definitions, list_explanations

# Get the environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialisation du modèle de langage
llm = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))
FLASK_PORT = os.getenv("FLASK_PORT", 5000)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return 'Index Page'

@app.route('/api/get_rhese', methods=['POST'])
def get_rhese ():
    # Récupérer le texte envoyé dans le corps de la requête
    data = request.get_json()
    # Vérifier si le texte est présent
    if 'text' not in data:
        return jsonify({'error': 'Aucun texte fourni'}), 400
    
    input_text = data['text']
    response_text = decoupe_rhese(llm, input_text)
    return response_text, 200, {'Content-Type': 'application/json'}


@app.route('/api/get_entites', methods=['POST'])
def get_entites():
    # Récupérer le texte envoyé dans le corps de la requête
    data = request.get_json()
    # Vérifier si le texte est présent
    if 'text' not in data:
        return jsonify({'error': 'Aucun texte fourni'}), 400
    
    input_text = data['text']
    response_text = list_entites(llm, input_text)
    return response_text, 200, {'Content-Type': 'application/json'}


@app.route('/api/get_definitions', methods=['POST'])
def get_definitions():
    # Récupérer le texte envoyé dans le corps de la requête
    data = request.get_json()
    # Vérifier si le texte est présent
    if 'text' not in data:
        return jsonify({'error': 'Aucun texte fourni'}), 400
    
    input_text = data['text']
    response_text = list_definitions(llm, input_text)
    return response_text, 200, {'Content-Type': 'application/json'}


@app.route('/api/get_explanations', methods=['POST'])
def get_explanations():
    # Récupérer le texte envoyé dans le corps de la requête
    data = request.get_json()
    # Vérifier si le texte est présent
    if 'text' not in data:
        return jsonify({'error': 'Aucun texte fourni'}), 400
    
    input_text = data['text']
    response_text = list_explanations(llm, input_text)
    return response_text, 200, {'Content-Type': 'application/json'}


def fusionne_rhese_explanations(llm, input_text):
    list_rhese = decoupe_rhese(llm, input_text)
    # Changer en json pour récupérer la réponse
    list_rhese = json.loads(list_rhese)
    list_rhese = list_rhese.get('response')    
    text_explained = list_explanations(llm, input_text)
    # Changer en json pour récupérer la réponse
    text_explained = json.loads(text_explained)
    text_explained = text_explained.get('response')

    # Étape 1: Extraire tous les enrichissements
    pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    enrichments = re.findall(pattern, text_explained)
    
    # Créer un dictionnaire de termes à enrichir
    enrichment_dict = {term: explanation for term, explanation in enrichments}
    
    # Étape 2: Créer une version sans enrichissements du texte_explained
    simplified_text = text_explained
    for term, explanation in enrichments:
        simplified_text = simplified_text.replace(f"[{term}]({explanation})", term)
    
    # Étape 3: Enrichir chaque rhèse
    enriched_rheses = []
    for rhese in list_rhese:
        enriched_rhese = rhese
        # Trier les termes par longueur décroissante pour éviter les remplacements partiels
        for term in sorted(enrichment_dict.keys(), key=len, reverse=True):
            if term in enriched_rhese:
                # Remplacer le terme par sa version enrichie
                enriched_rhese = enriched_rhese.replace(term, f"[{term}]({enrichment_dict[term]})")
        
        enriched_rheses.append(enriched_rhese)
    
    return enriched_rheses


@app.route('/api/get_rhese_and_explained', methods=['POST'])
def get_rhese_and_explanations():
    # Récupérer le texte envoyé dans le corps de la requête
    data = request.get_json()
    # Vérifier si le texte est présent
    if 'text' not in data:
        return jsonify({'error': 'Aucun texte fourni'}), 400
    
    input_text = data['text']
    response_text = fusionne_rhese_explanations(llm, input_text)
    return response_text, 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=True)
