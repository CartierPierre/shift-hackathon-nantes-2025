import pytest
from run import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_get_rhese(client):
    input_text = "Le soleil brille et les oiseaux chantent. Espérons que la tempête ne va pas venir."
    
    # Corps de la requête
    data = {"text": input_text}
    
    # Envoyer une requête POST à l'API
    response = client.post('/api/get_rhese', json=data)
    
    # Vérifier que le code de statut est 200
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}, response data: {response.data}"
    
    # Vérifier que l'en-tête Content-Type est application/json
    assert response.content_type == "application/json", f"Unexpected Content-Type: {response.content_type}, response data: {response.data}"
    
    # Récupérer la réponse JSON
    response_json = response.get_json()
    assert response_json is not None, f"Response JSON is None. Raw response data: {response.data}"
    
    # Vérifier que la réponse contient les rhèses attendues
    expected_rheses = ["Le soleil brille",
                       "et les oiseaux chantent.",
                       "Espérons",
                       "que la tempête ne va pas venir."]
    
    assert response_json['response'] == expected_rheses, f"Unexpected response: {response_json}"