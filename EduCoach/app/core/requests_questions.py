import os
from mistralai import Mistral
from pydantic import BaseModel, Field
from app.infrastructure.llm_client import LLMClient

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

class Question(BaseModel):
    question: str = Field(description="La question posée par l'élève")

class QuestionsList(BaseModel):
    questions: list[Question] = Field(description="Liste des questions posées par l'élève")

def fetch_questions(category: str, course: str) -> list[str]:
    """
    Génère une liste de questions pour un chapitre et une matière donnés.
    
    Args:
        category (str): Le chapitre à réviser
        course (str): La matière concernée
        
    Returns:
        list[str]: Liste des questions générées
    """
    prompt = f"""
    Role : You are a student in 6-grade.
    Contexte : You study the chapter : {category} in the class : {course}. You are studying with a friend.
    Task : You ask 5 questions in order that your friend explain to you the most important knowledge of the course.
    Tone :  You talk to a good friend who is also in your 6-grade class.
            You did not understand very well and you hesitate a little bit.
            There are compassion and kindness. You try to lead a cooperation process by teenage idioms and expressions such as "let's see", "let's find out together", "I am hesitating", "I wonder", "What do you think?", "I am not sure"
    Format : You answer in French. You speak in a familiar way as a teenager. For each question, add a teenage idioms in french or an expression in french such as  "let's see", "let's find out together", "I am hesitating", "I wonder", "What do you think?", "I am not sure"
    """
    llm_client = LLMClient()
    structured_llm = llm_client.get_llm().with_structured_output(QuestionsList)
    
    response = structured_llm.invoke(prompt)
    return [question.question for question in response.questions]
