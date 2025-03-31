from pathlib import Path
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from .schema import Person
from .tools import get_model, text_to_file
import os


class PersonMemory(BaseModel):
    summary: str = Field(description="A summary of the memory about a person.")

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", """Tu es un assistant bienveillant spécialisé dans la stimulation de la mémoire émotionnelle chez les personnes 
                      âgées ayant une déficience de leur mémoire. Tu aides à raviver les souvenirs marquants à travers des récits narratifs, sensoriels et profondément humains."""),
        ("user", """
         Voici les informations sur la personne agée :
            Nom : {name}
            Age : {age}
            Profession : {occupation}
         Voici différents souvenirs exprimées par des proches de la personne agée au sujet de l'un de ses proches :.
            {person}
         Résume des annectotes au sujet de ce proche à la personne agée comme une petite histoire intime, d’environ 100 mots, qui lui parle directement.
         Utilise un ton amical, rassurant et affectueux, comme si tu étais un proche.
         Utilise les émotions, les détails sensoriels (la lumière, les couleurs, les sons, les sourires…).
         Sois doux et encourageant : le but est de faire naître un sourire, une réminiscence, une sensation familière.
         """),
    ]
)

def generate_person_memory(person: Person):
    filename = Path(os.environ.get("AUDIO_DIR"))

    file_path = filename / f"person{person.id}.mp3"

    if file_path.exists():
        return os.path.basename(file_path)

    model = get_model()
    chain = prompt_template | model.with_structured_output(PersonMemory)

    name = "Monique"
    age = 75
    occupation = "Ancienne Assistante sociale"
    person_json = person.model_dump(include={"name", "surname", "birthdate", "description", "annecdotes", "relationship_type", "relationship"})

    person_memory = chain.invoke({"name": name,
                                "age": age,
                                "occupation": occupation,
                                "person": person_json})
    print(person_memory.summary)

    text_to_file(person_memory.summary, file_path)

    return os.path.basename(file_path)