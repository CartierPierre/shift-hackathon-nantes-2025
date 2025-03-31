from responseLLM import responseLLM

def list_entites(llm, input_text, model="mistral-large-latest"):
    try:
        prompt = f"""Tu es un spécialiste des dyslexiques depuis 20 ans. 
            Je vais te fournir un texte et tu vas identifier les entités nommées pour pouvoir les indiquer
            aux dyslexiques lorsqu'elles sont référencées par des pronoms ou des références.
            Tu ne dois pas modifier le texte, mais juste identifier les entités nommées et les références.

            Tu va me fournir le texte résultat selon la manière suivante :
            - Les entités nommés que tu auras identifiées seront entre crochets avec le nom de l'entité ensuite
            - Lorsque tu as une référence à une entité nommée, tu vas également la mettre entre crochets et indiquer
            ensuite le nom de l'entité. En utilisant le même nom que lors de l'identification de l'entité.
            L'ensemble respectera les contraintes markdown [entité nommé](nom de l'entité) ou [référence](nom de l'entité).
            Tu ne dois pas faire de résumé, tu dois juste identifier les entités nommées et les références.
            Attention, tu ne dois pas identifier inutilement les entités nommées si elles ne sont pas référencées
            par des pronoms ou des références dans le texte qui t'est fourni. Mais ) l'inverse si tu trouves une référence
            à une entité nommée, tu dois l'identifier.

            Retourne ta réponse sous la forme d'un dictionnaire json avec comme clé response.
            Voici plusieurs exemples de réponse :
            
            {{"response": "[Le chat](le chat) est sur le canapé. [Il](le chat) est très mignon, la 
            [jeune femme](jeune femme) [le](le chat) caresse."}}

            {{"response": "[Marie](Marie) et [Paul](Paul) sont amis. [Ils](Marie et Paul) se
            rencontrent souvent. [Elle](Marie) aime beaucoup [lui](Paul)."}}

            {{"response": "Les Fables choisies, mises en vers par M. de La Fontaine, appelées simplement
            [Fables de La Fontaine](Fables de La Fontaine), sont trois recueils regroupant deux cent
            quarante-trois fables allégoriques publiés par [Jean de La Fontaine](Jean de La Fontaine)
            entre 1668 et 1694. [La plupart](Fables de la Fontaine), inspirées des fables d'Ésope, Babrius
            et Phèdre, mettent en scène des animaux anthropomorphes."}}

            Voici le texte à analyser :

            {input_text}
            """

        response = responseLLM(llm, model, prompt)
        
        return response

    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")


def list_definitions(llm, input_text, model="mistral-small-latest"):
    try:
        prompt = f"""tu es un spécialiste des dyslexique depuis 20 ans. 
            Je vais te fournir un texte et tu vas identifier les mots complexes pour des collégiens 
            dyslexiques pour pouvoir les indiquer et proposer une courte définition.
            Tu va me fournir le texte résultat selon la manière suivante : les mots complexes que tu auras
            identifiés seront entre crochets avec l'explication ensuite.
            L'ensemble respectera les contraintes markdown [mot complexe](explication).
            Tu ne dois pas faire de résumé, tu dois juste identifier les mots complexes pour les collégiens
            et les définir.

            Retourne ta réponse sous la forme d'un dictionnaire json avec comme clé response.
            Voici un exemple de réponse :
            {{"response": "Le [scientifique](Une personne qui étudie et cherche à comprendre le monde 
            à travers des expériences et des observations) analyse le [phénomène](Quelque chose qui se
            passe et qu'on peut observer, comme un arc-en-ciel ou une éclipse)."}}

            Voici le texte à analyser :

            {input_text}
            """

        response = responseLLM(llm, model, prompt)
        
        return response

    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")


def list_explanations(llm, input_text, model="mistral-large-latest"):
    try:
        prompt = f"""Tu es un spécialiste des dyslexique depuis 20 ans. 
            Pour rappel une rhèse est un groupe de mots d'une phrase qui porte un sens et cadence le discours.
            Les rhèses que tu vas produire ici seront courtes (moins de 7 mots environ) pour être adaptées
            à la lecture d'un collégien dyslexique.

            Je vais te fournir un texte et tu vas détecter :
            - les mots complexes pour des collégiens dyslexiques (ex. : "phénomène", "scientifique", etc.)
            - les expressions (ex. : "tombé dans les pommes", "mis en vers", etc.)
            - les références à une entité nommée, par exemple par un pronom (ex. : "il", "la", etc.), un pronom
            d'appartenance (ex. : "son", "leur", etc.) ou une expression (ex. : "la plupart", "les autres", etc.)

            Tu vas me fournir le texte résultat en respectant le format markdown suivant [mot détecté](complément).
            Tu renseigneras le complément de la manière suivante :
            - Pour les mots complexes tu donneras une définition simple et courte.
            - Pour les expressions tu donneras une reformulation de la partie de la phrase concernée
            mais sans utiliser d'expression.
            - Pour les références à une entité nommée tu reformuleras la rhèse à laquelle il appartient en 
            remplacant la référence par le nom de l'entité correspondante
            
            L'ensemble respectera les contraintes markdown.
            Tu ne dois pas faire de résumé, tu dois juste identifier les mots que je t'ai demandé de
            détecter et les expliquer.

            Retourne ta réponse sous la forme d'un dictionnaire json avec comme clé response.
            Voici des exemples de réponses :
            {{"response": "Le [scientifique](Une personne qui étudie et cherche à comprendre le monde 
            à travers des expériences et des observations) analyse le [phénomène](Quelque chose qui se
            passe et qu'on peut observer, comme un arc-en-ciel ou une éclipse)."}}

            {{"response": "Le chat est sur le canapé. [Il](Le chat est très mignon) est très mignon, la 
            jeune femme [le](La jeune femme caresse le chat) caresse."}}

            {{"response": "Marie et Paul sont amis. [Ils](Marie et Paul se rencontrent) se
            rencontrent souvent. [Elle](Marie l'aime beaucoup) [l'aime](Elle aime beaucoup Paul) beaucoup."}}

            {{"response": "Les Fables choisies, mises en [vers](Les fables sous forme de poème) par
            M. de La Fontaine, appelées simplement Fables de La Fontaine, sont trois recueils regroupant deux
            cent quarante-trois fables allégoriques publiés par Jean de La Fontaine entre 1668 et 1694.
            [La plupart](La plupart des fables de la Fontaine), inspirées des fables d'Ésope, Babrius et Phèdre,
            mettent en scène des animaux [anthropomorphes](des animaux qui se comportent comme des humains)."}}

            Voici le texte à analyser :

            {input_text}
            """

        response = responseLLM(llm, model, prompt)
        
        return response

    except Exception as e:
        print(f"Erreur lors de l'appel au LLM : {e}")