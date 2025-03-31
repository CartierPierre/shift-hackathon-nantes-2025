import pytest
from run import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_get_entites(client):
    input_text = "Le chat est sur le canapé. Il est très mignon, la jeune femme le caresse."
    
    # Corps de la requête
    data = {"text": input_text}
    
    # Envoyer une requête POST à l'API
    response = client.post('/api/get_entites', json=data)
    
    # Vérifier que le code de statut est 200
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}, response data: {response.data}"
    
    # Vérifier que l'en-tête Content-Type est application/json
    assert response.content_type == "application/json", f"Unexpected Content-Type: {response.content_type}, response data: {response.data}"
    
    # Récupérer la réponse JSON
    response_json = response.get_json()
    assert response_json is not None, f"Response JSON is None. Raw response data: {response.data}"
    
    # Vérifier que la réponse contient a minima la référence concernant le chat
    result = response_json['response']
    assert "[le chat](le chat)" in result.lower(), f"Response does not tag 'Le chat' : {result}"
    assert "[il](le chat)" in result.lower(), f"Response does not define 'il': {result}"    


def test_get_definitions(client):
    input_text = """Le scientifique analyse le phénomène."""
    
    # Corps de la requête
    data = {"text": input_text}
    
    # Envoyer une requête POST à l'API
    response = client.post('/api/get_definitions', json=data)
    
    # Vérifier que le code de statut est 200
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}, response data: {response.data}"
    
    # Vérifier que l'en-tête Content-Type est application/json
    assert response.content_type == "application/json", f"Unexpected Content-Type: {response.content_type}, response data: {response.data}"
    
    # Récupérer la réponse JSON
    response_json = response.get_json()
    assert response_json is not None, f"Response JSON is None. Raw response data: {response.data}"
    
    # Vérifier que la réponse contient une défintion pour les deux mots "scientifique" et "phénomène"
    result = response_json['response']
    assert "[scientifique](" in result, f"Response does not contain definition for 'scientifique': {result}"
    assert "[phénomène](" in result, f"Response does not contain definition for 'phénomène': {result}"
