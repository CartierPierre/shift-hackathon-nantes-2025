from responseLLM import responseLLM

def decoupe_rhese(llm, input_text, model="mistral-small-latest"):
    """
    Découpe un texte en rhèses (unités de sens) en utilisant un LLM.
    
    Args:
        llm (Mistral): Instance du modèle de langage à utiliser.
        text (str): Le texte à découper.
        model (str): Le modèle de langage à utiliser (par défaut : "mistral-small-latest").
    
    Returns:
        response: un json contenant une variable "response" qui contient la liste des rhèses.
    """
    try:
        # Construction du prompt pour le modèle de langage
        prompt = f"""
        Tu es un expert linguistique, tu vas découper le texte suivant en rhèse. L'objectif est de limiter l'effort
        cognitif de lecture pour un collégien dyslexique. Renvoie le texte rhésé sous forme de liste. Ne modifie pas
        le texte, ne change pas les mots ou la structure des phrases.
        Rhèses courtes : Découpe le texte en segments adapté à la lecture d'un collégien dyslexique.
        Respecte la ponctuation : Conserve les signes de ponctuation pour maintenir le sens des phrases.
        Merci de suivre ces consignes pour aider l'élève à mieux comprendre le texte.
        Retourne ta réponse sous la forme d'un dictionnaire json, avec une clé response, qui contient en valeur le texte.

        Exemples de réponses :
        {{"response": ["Le soleil brille",
                       "et les oiseaux chantent.",
                       "Espérons",
                       "que la tempête ne va pas venir."]}}
                
        Voici le texte à découper :
        {input_text}

        """

        # Extraction de la réponse du modèle qui est sous forme de AIMessage
        rhese_output = responseLLM(llm, model, prompt)
        return rhese_output
    
    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")
        return []