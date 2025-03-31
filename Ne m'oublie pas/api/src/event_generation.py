from pathlib import Path
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from .schema import Event
from .tools import get_model, text_to_file
import os


class EventMemory(BaseModel):
    title: str = Field(description="The title of the memory (between 3 and 10 words)")
    summary: str = Field(description="A summary of the memory")

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", """Tu es un assistant bienveillant spécialisé dans la stimulation de la mémoire émotionnelle chez les personnes 
                      âgées ayant une déficience de leur mémoire. Tu aides à raviver les souvenirs marquants à travers des récits narratifs, sensoriels et profondément humains."""),
        ("user", """
         Voici les informations sur la personne agée :
            Nom : {name}
            Age : {age}
            Profession : {occupation}
         Voici différents souvenirs exprimées par des proches de la personne agée au sujet de l'évènement :.
            {event}
         Raconte cet évènement à la personne agée comme une petite histoire intime, d’environ 100 mots, qui lui parle directement.
         Utilise un ton amical, rassurant et affectueux, comme si tu étais un proche.
         Fais vivre l’histoire par les émotions, les détails sensoriels (la lumière, les couleurs, les sons, les sourires…).
         Intègre au moins une anecdote si elle est présente dans les souvenirs fournis.
         Sois doux et encourageant : le but est de faire naître un sourire, une réminiscence, une sensation familière.
         """),
    ]
)

def generate_event_memory(event: Event):
    filename = Path(os.environ.get("AUDIO_DIR"))

    file_path = filename / f"event{event.id}.mp3"
    # Check if the file already exists
    if file_path.exists():
        return str(file_path)

    model = get_model()
    chain = prompt_template | model.with_structured_output(EventMemory)

    name = "Monique"
    age = 75
    occupation = "Ancienne Assistante sociale"
    event_json = event.model_dump(include={"name", "date", "description", "annecdotes"})

    day_memory = chain.invoke({"name": name,
                                "age": age,
                                "occupation": occupation,
                                "event": event_json})
    print(day_memory.summary)

    text_to_file(day_memory.summary, file_path)

    return str(file_path)