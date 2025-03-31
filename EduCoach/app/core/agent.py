from typing import TypedDict, Sequence, List, Optional, Dict, Any, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain.tools import BaseTool
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import add_messages
from langgraph.prebuilt import ToolNode
from app.infrastructure.llm_client import LLMClient
from app.core.tools import (
    simplify_expr,
    solve_equation,
    derivative,
    integrate_expr,
    factor_expr,
    expand_expr
)
from app.core.tool_utils import tools_condition, create_tool_node_with_fallback
from app.core.requests_questions import fetch_questions
import logging
import uuid
import random

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Définition des types pour notre état
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    current_step: str
    thread_id: str
    questions: List[str]
    analyses: List[Dict[str, Any]]
    waiting_for_answer: bool
    needs_evaluation: bool
    current_question_index: int
    nb_good_answers: int = 0
    category: str = "Conjugaison des verbes du 2ème groupe"
    course: str = "Français"

# Configuration par défaut
QUESTIONS_SYSTEM_PROMPT = """
Pose-moi la question suivante : 'Comment conjugue-t-on le verbe boire au présent ?'
Analyse ma réponse et attribue une note de 1 à 5.

5 = Tout est correct
4 = Une petite erreur
3 = Quelques erreurs
2 = Beaucoup d'erreurs
1 = Presque tout est faux

Ajoute un commentaire dans un objet JSON avec :

 - note : (le score sur 5)
 - commentaire : un message qui souligne ce que j'ai bien fait et corrige mes erreurs si nécessaire

Tu es un adolescent de 12 ans en classe de 6ème. Ton langage est naturel, simple et un peu familier, comme si tu parlais à un copain en classe.
"""

DEFAULT_SYSTEM_PROMPT = "Tu es une personne chaleureuse et attentionnée. Tu m'aide à réviser ses leçons."

from pydantic import BaseModel, Field

class EvaluationResponse(BaseModel):
    note: int = Field(..., ge=1, le=5)
    comment: str

class CompleteEvaluationResponse(BaseModel):
    note: int = Field(..., ge=1, le=5, description="Note sur 5 de la réponse")
    feedback: str = Field(description="Commentaire détaillé sur la réponse")

class AgentResponse(BaseModel):
    content: str
    evaluation: Optional[EvaluationResponse] = None

def create_agent(
    api_key: str,
    system_prompt: Optional[str] = DEFAULT_SYSTEM_PROMPT,
    tools: Optional[List[Dict[str, Any]]] = None,
    thread_id: Optional[str] = None,
    category: str = "",
    course: str = "",
    nb_good_answers: int = 0
):
    try:
        # Initialisation du client LLM
        llm_client = LLMClient(api_key=api_key)
        llm = llm_client.get_llm()

        # Initialisation des outils
        tool_objects = []

        # Ajout des outils mathématiques par défaut
        default_tools = [
            simplify_expr,
            solve_equation,
            derivative,
            integrate_expr,
            factor_expr,
            expand_expr
        ]

        # Ajout des outils par défaut
        tool_objects.extend(default_tools)
        logger.info(f"Outils par défaut ajoutés: {[tool.name for tool in default_tools]}")

        # Ajout des outils personnalisés
        if tools:
            for tool in tools:
                try:
                    if not all(k in tool for k in ["name", "description", "func"]):
                        logger.error(f"L'outil personnalisé doit avoir un nom, une description et une fonction: {tool}")
                        continue

                    @tool
                    def custom_tool(**kwargs):
                        return tool["func"](**kwargs)

                    custom_tool.name = tool["name"]
                    custom_tool.description = tool["description"]
                    tool_objects.append(custom_tool)
                    logger.info(f"Outil personnalisé ajouté: {tool['name']}")
                except Exception as e:
                    logger.error(f"Erreur lors de la création de l'outil personnalisé {tool.get('name', 'unknown')}: {str(e)}")
                    continue

        if not tool_objects:
            logger.warning("Aucun outil valide n'a été créé")

        # Bind des outils au LLM
        llm_with_tools = llm.bind_tools(tool_objects)
        logger.info(f"Outils liés au LLM: {[tool.name for tool in tool_objects]}")


        # Fonction pour définir les questions
        def define_questions(state: AgentState) -> AgentState:
            logger.info("Définition des questions")

            # Initialisation de l'état si c'est la première fois
            if not state.get("questions"):
                logger.info("🔄 Initialisation de l'état")
                state.update({
                    "messages": [HumanMessage(content=state["messages"][0].content)],
                    "questions": [],
                    "analyses": [],
                    "category": state.get("category", "Conjugaison des verbes du 2ème groupe"),
                    "course": state.get("course", "Français"),
                    "waiting_for_answer": False,
                    "needs_evaluation": False,
                    "current_question_index": 0,
                    "nb_good_answers": 0
                })

            # Récupération des questions
            questions = fetch_questions(state["category"], state["course"])
            state["questions"] = questions
            logger.info(f"❓ Questions définies: {questions}")
            logger.info(f"❔ État actuel: {state}")
            return state

        # Fonction pour poser les questions
        def ask_questions(state: AgentState) -> AgentState:
            logger.info("Pose des questions")
            can_ask_question = not state["waiting_for_answer"]
            has_remaining_questions = len(state["questions"]) > state["current_question_index"]

            logger.info(f"📊 Nombre total de questions: {len(state['questions'])}")
            logger.info(f"📍 Index question actuelle: {state['current_question_index']}")
            logger.info(f"💣 Attente de réponse ?: {state['waiting_for_answer']}")

            # Si on attend déjà une réponse, on ne fait rien
            if state["waiting_for_answer"]:
                logger.info("En attente de réponse, pas d'action nécessaire")
                return state

            # Si on a encore des questions à poser
            if has_remaining_questions:
                next_question = state["questions"][state["current_question_index"]]
                state["messages"].append(AIMessage(content=next_question))
                state["waiting_for_answer"] = True
                state["needs_evaluation"] = True
                state["current_question_index"] += 1
                logger.info(f"Question posée: {next_question}")
            else:
                logger.info("Toutes les questions ont été posées")
                state["current_step"] = END

            return state

        # Fonction pour évaluer les réponses
        def evaluate_answers(state: AgentState) -> AgentState:
            logger.info("🚩 Évaluation des réponses")

            # Vérification des indicateurs d'état
            if not state["needs_evaluation"]:
                logger.warning("Pas besoin d'évaluation selon l'état")
                return state

            # Récupération des messages
            messages = state["messages"]

            # Vérification qu'il y a au moins 2 messages (question et réponse)
            if len(messages) < 2:
                logger.warning("Pas assez de messages pour évaluer")
                return state

            # Vérification que le dernier message est humain (réponse de l'utilisateur)
            if not isinstance(messages[-1], HumanMessage):
                logger.warning("Le dernier message n'est pas un message humain")
                return state

            # Vérification que l'avant-dernier message est IA (question)
            if not isinstance(messages[-2], AIMessage):
                logger.warning("L'avant-dernier message n'est pas un message IA")
                return state

            # Récupération question/réponse
            last_question = messages[-2].content
            last_answer = messages[-1].content
            logger.info(f"🔍 Question: {last_question}")
            logger.info(f"🔍 Réponse: {last_answer}")

            if not last_question or not last_answer:
                logger.warning("Impossible de trouver la question et la réponse")
                return state

            # Création du prompt pour l'évaluation
            evaluation_prompt =f"""
            Role : You are a referent student in 6-grade.
            Contexte : You are studying with a friend and classmate.
                        Question :  {last_question}
                        Anwser : {last_answer}
            Task : Your evaluate the answer of your classmate basing into these 2 criterias:
                    1. Quality of the answer : excellent, very good, good, average, to be improved. You don't give a note but a quality appreciation such as "your answer is correct but incomplete"
                    2. A detailled feedback. You highlight the positive points of the answer and you correct all the mistakes.
                    3. A cheering idioms or expression such as "you'll make it", "bravo".
            Tone : You talk to a good friend who is also in your 6-grade class.
                    There are compassion and kindness.
                    You are passionnate and you have mentorship abilities to lead the classmate to improve himself.
            Format : You answer in French. You speak in a familiar way as a teenager.
            """
            # Configuration du LLM avec sortie structurée
            structured_llm = llm.with_structured_output(CompleteEvaluationResponse)

            try:
                # Évaluation de la réponse
                evaluation = structured_llm.invoke(evaluation_prompt)

                # Ajout de l'évaluation à la liste des analyses
                state["analyses"].append({
                    "question": last_question,
                    "answer": last_answer,
                    "evaluation": evaluation.dict()
                })

                # choix du message d'encouragement à afficher
                msg = f""

                if evaluation.note >=2:
                    state["nb_good_answers"] += 1
                else:
                    state["nb_good_answers"] = 0

                if state["nb_good_answers"] >= 2:
                    # message de félicitations si au moins 2 bonnes réponses de suite
                    msgs = [f"Bravo ! Cela fait {state["nb_good_answers"]} bonnes réponses de suite !",
                        f"Tu peux être fier de toi ! C'est une série gagnante de {state["nb_good_answers"]} bonnes réponses d'affilée !",
                        f"Bravo ! Tu es un crack ! {state["nb_good_answers"]} bonnes réponses de suite !"
                    ]
                    choix=random.choice(range(0, 2))
                    msg=msgs[choix]

                # Ajout du feedback dans les messages
                feedback_message = f"""
                {evaluation.feedback}

                {msg}
                """

                state["messages"].append(AIMessage(content=feedback_message))
                logger.info(f"Évaluation effectuée : {evaluation.dict()}")

                # Mise à jour des indicateurs après évaluation
                state["waiting_for_answer"] = False
                state["needs_evaluation"] = False

            except Exception as e:
                logger.error(f"Erreur lors de l'évaluation : {str(e)}")
                error_message = "Désolé, j'ai eu un problème pour évaluer ta réponse. On peut continuer avec la question suivante !"
                state["messages"].append(AIMessage(content=error_message))
                # En cas d'erreur, on réinitialise aussi les indicateurs

            logger.info(f"❔ État actuel: {state}")
            return state

        # Fonction pour déterminer la prochaine étape
        def determine_next_step(state: AgentState) -> str:
            logger.info("🔄 Détermination de la prochaine étape")
            logger.info(f"📊 État actuel: waiting_for_answer={state['waiting_for_answer']}, needs_evaluation={state['needs_evaluation']}")
            logger.info(f"📝 Nombre d'analyses: {len(state['analyses'])}, Nombre de questions: {len(state['questions'])}")

            # Si nous attendons une réponse
            if state["waiting_for_answer"]:
                logger.info("⏳ En attente d'une réponse de l'utilisateur")
                return "evaluate_answers"

            # Si nous avons besoin d'évaluer une réponse
            if state["needs_evaluation"]:
                logger.info("📝 Besoin d'évaluer la dernière réponse")
                return "evaluate_answers"

            # Si nous avons des questions restantes
            if state["current_question_index"] < len(state["questions"]):
                logger.info("❓ Questions restantes à traiter")
                return "ask_questions"

            # Si toutes les questions ont été traitées
            logger.info("✅ Toutes les questions ont été traitées")
            return END

        # Création du graphe
        workflow = StateGraph(AgentState)

        # Ajout des nœuds
        workflow.add_node("define_questions", define_questions)
        workflow.add_node("ask_questions", ask_questions)
        workflow.add_node("evaluate_answers", evaluate_answers)

        # Création du nœud d'outils avec gestion des erreurs
        tool_node = create_tool_node_with_fallback(tool_objects)
        workflow.add_node("execute_tools", tool_node)

        # Configuration du flux
        workflow.add_edge(START, "define_questions")

        # Edge conditionnel après define_questions
        workflow.add_conditional_edges(
            "define_questions",
            determine_next_step,
            {
                "evaluate_answers": "evaluate_answers",
                "ask_questions": "ask_questions",
                END: END
            }
        )

        workflow.add_edge("evaluate_answers", "ask_questions")
        workflow.add_edge("ask_questions", END)

        # Initialisation de la mémoire
        memory = MemorySaver()
        logger.info(f"Agent créé avec mémoire pour le thread: {thread_id}")

        # Compilation du graphe avec la mémoire
        chain = workflow.compile(checkpointer=memory)
        logger.info("Agent créé avec succès")

        # Fonction d'entrée pour le graphe
        def run_graph(user_message: str, thread_id: str) -> Dict[str, Any]:
            """
            Fonction d'entrée pour exécuter le graphe avec un message utilisateur.

            Args:
                user_message: Le message de l'utilisateur
                thread_id: L'identifiant unique de la conversation

            Returns:
                Dict[str, Any]: L'état final après exécution du graphe
            """
            try:
                # Configuration du graphe avec le thread_id
                config = {
                    "configurable": {
                        "thread_id": thread_id,
                        "system_prompt": system_prompt
                    }
                }

                # Création de l'état initial minimal
                state = {
                    "messages": [HumanMessage(content=user_message)],
                    "thread_id": thread_id
                }

                logger.info(f"Démarrage du graphe avec l'état initial: {state}")
                logger.info(f"Configuration du graphe: {config}")

                # Exécution du graphe avec la configuration
                final_state = chain.invoke(state, config=config)
                logger.info("Graphe exécuté avec succès")
                return final_state
            except Exception as e:
                logger.error(f"Erreur lors de l'exécution du graphe: {str(e)}")
                raise

        return run_graph
    except Exception as e:
        logger.error(f"Erreur lors de la création de l'agent: {str(e)}")
        raise
