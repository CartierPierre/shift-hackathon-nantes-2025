import streamlit as st
from app.core.agent import create_agent
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage
from app.core.audio_service import AudioService
from app.utils.logger import setup_logger
import os
import json
import uuid
import base64
from pathlib import Path
from PIL import Image
import PIL

logger = setup_logger("streamlit_app")


class StreamlitInterface:
    def __init__(self):
        st.set_page_config(
            page_title="EduCoach - Ton assistant scolaire",
            page_icon="🤖",
            layout="wide",
            initial_sidebar_state="collapsed"  # Cache la barre latérale par défaut
        )

        # Style personnalisé
        st.markdown("""
            <style>
            .stApp {
                background: linear-gradient(135deg, rgba(240, 245, 255, 0.9) 0%, rgba(200, 220, 255, 0.9) 100%);
                color: #2E4053;
            }
            .stTitle {
                color: #2E4053;
                font-size: 3rem !important;
                text-align: center;
                margin-bottom: 2rem;
                animation: fadeInDown 1s ease-out;
            }
            .st-emotion-cache-1y4p8pa {
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }
            .st-emotion-cache-1y4p8pa:hover {
                transform: translateY(-5px);
            }
            /* Style pour le conteneur de chat */
            .chat-container {
                max-width: 800px;
                margin: 0 auto;
            }
            /* Style pour la zone de saisie */
            .stChatInput {
                margin-bottom: 1rem;
                animation: slideUp 0.5s ease-out;
            }
            /* Style pour le bouton audio */
            .stAudioInput {
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
            }
            /* Style pour les messages du chat */
            .stChatMessage {
                background: white;
                border-radius: 20px;
                padding: 1.5rem;
                margin: 1rem 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                animation: slideIn 0.5s ease-out;
            }
            .stChatMessage:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            /* Style spécifique pour les messages de l'assistant */
            .stChatMessage[data-testid="assistant"] {
                background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                border-left: 4px solid #4CAF50;
            }
            /* Style spécifique pour les messages de l'utilisateur */
            .stChatMessage[data-testid="user"] {
                background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
                border-left: 4px solid #2196F3;
            }
            /* Style pour l'avatar dans les messages */
            .stChatMessage .st-emotion-cache-1v0mbdj {
                padding: 0.5rem;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-right: 1rem;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .stChatMessage .st-emotion-cache-1v0mbdj img {
                width: 100% !important;
                height: 100% !important;
                border-radius: 50%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            .stChatMessage .st-emotion-cache-1v0mbdj img:hover {
                transform: scale(1.1);
            }
            /* Style pour l'avatar de l'assistant */
            .stChatMessage[data-testid="assistant"] .st-emotion-cache-1v0mbdj {
                background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                border: 2px solid #4CAF50;
            }
            /* Style pour l'avatar de l'utilisateur */
            .stChatMessage[data-testid="user"] .st-emotion-cache-1v0mbdj {
                background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
                border: 2px solid #2196F3;
            }
            /* Animation pour les messages */
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            /* Style pour le contenu des messages */
            .message-content {
                font-size: 1.1em;
                line-height: 1.5;
                color: #2E4053;
            }
            .message-time {
                font-size: 0.8em;
                color: #666;
                margin-top: 0.5rem;
                text-align: right;
            }
            /* Style pour les emojis dans les messages */
            .message-emoji {
                font-size: 1.2em;
                margin-right: 0.5rem;
            }
            /* Style pour agrandir l'avatar */
            .st-emotion-cache-1v0mbdj > img {
                width: 64px !important;
                height: 64px !important;
                transition: transform 0.3s ease;
            }
            .st-emotion-cache-1v0mbdj > img:hover {
                transform: scale(1.1);
            }
            /* Animations */
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            /* Style pour les badges */
            .badge {
                display: inline-block;
                padding: 0.8rem 1.2rem;
                margin: 0.5rem;
                border-radius: 15px;
                background: linear-gradient(135deg, #FF6B6B, #FF8E53);
                color: white;
                font-weight: bold;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                width: calc(100% - 1rem);
            }
            .badge:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            }
            .badge::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
                transform: rotate(45deg);
                transition: all 0.3s ease;
            }
            .badge:hover::before {
                transform: rotate(45deg) translate(50%, 50%);
            }
            /* Style pour les sujets maîtrisés */
            .subject-card {
                background: linear-gradient(135deg, #ffffff, #f8f9fa);
                border-radius: 12px;
                padding: 1rem;
                margin: 0.5rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
                border-left: 4px solid #4CAF50;
            }
            .subject-card:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            /* Style pour les statistiques */
            .stat-container {
                background: rgba(255, 255, 255, 0.9);
                border-radius: 10px;
                padding: 1rem;
                margin: 0.5rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .stat-value {
                font-size: 1.5em;
                font-weight: bold;
                color: #2E4053;
                text-align: center;
            }
            .stat-label {
                font-size: 0.9em;
                color: #666;
                text-align: center;
            }
            /* Style pour le streak calendar */
            .streak-calendar {
                display: flex;
                justify-content: center;
                gap: 4px;
                margin: 1rem 0;
            }
            .streak-day {
                width: 20px;
                height: 20px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.5);
                border: 1px solid #ddd;
            }
            .streak-day.active {
                background: linear-gradient(135deg, #4CAF50, #8BC34A);
                border: none;
            }
            /* Style pour la barre de progression */
            .stProgress > div > div {
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                transition: width 0.5s ease-in-out;
            }
            /* Style pour les boutons */
            .stButton > button {
                transition: all 0.3s ease;
            }
            .stButton > button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            /* Style personnalisé pour la barre de progression XP */
            .xp-progress {
                background-color: rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                padding: 4px;
                margin: 10px 0;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            .xp-progress-bar {
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                height: 20px;
                border-radius: 6px;
                transition: width 0.5s ease-in-out;
                position: relative;
                overflow: hidden;
            }
            .xp-progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    45deg,
                    rgba(255,255,255,0.2) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255,255,255,0.2) 50%,
                    rgba(255,255,255,0.2) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 20px 20px;
                animation: xp-progress-animation 1s linear infinite;
            }
            @keyframes xp-progress-animation {
                from {
                    background-position: 0 0;
                }
                to {
                    background-position: 20px 0;
                }
            }
            .xp-text {
                text-align: center;
                font-weight: bold;
                color: #2E4053;
                margin: 5px 0;
                font-size: 0.9em;
            }
            /* Style pour l'avatar */
            [data-testid="stImage"] {
                border-radius: 50% !important;
                overflow: hidden;
                border: 3px solid #4CAF50;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            [data-testid="stImage"]:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 12px rgba(0,0,0,0.2);
            }
            [data-testid="stImage"] img {
                border-radius: 50% !important;
            }
            </style>
        """, unsafe_allow_html=True)

        st.title("👋 Salut! Je suis EduCoach, ton assistant scolaire!")
        st.markdown("### Je suis là pour t'aider dans tes devoirs et répondre à tes questions! 📚")

        self.api_key = os.getenv("AZURE_OPENAI_API_KEY")
        if not self.api_key:
            st.error("⚠️ Oups! Il manque une configuration importante. Contacte ton professeur!")
            st.stop()

        if "thread_id" not in st.session_state:
            st.session_state.thread_id = str(uuid.uuid4())
            logger.info(f"Nouveau thread créé: {st.session_state.thread_id}")

        if "messages" not in st.session_state:
            st.session_state.messages = []

        if "agent" not in st.session_state:
            st.session_state.agent = None

        if "graph_state" not in st.session_state:
            st.session_state.graph_state = None

        if "audio_service" not in st.session_state:
            st.session_state.audio_service = AudioService(api_key=os.getenv("OPENAI_API_KEY"))

        if "reflections" not in st.session_state:
            st.session_state.reflections = []

        if "tts_enabled" not in st.session_state:
            st.session_state.tts_enabled = True  # TTS activé par défaut

        if "debug_mode" not in st.session_state:
            st.session_state.debug_mode = False  # Mode debug désactivé par défaut

        if "instruction" not in st.session_state:
            st.session_state.instruction = st.session_state.audio_service.DEFAULT_INSTRUCTION

        if "user_stats" not in st.session_state:
            st.session_state.user_stats = {
                "niveau": 5,
                "xp": 2340,
                "xp_next_level": 3000,
                "questions_posees": 42,
                "sujets_maitrises": ["Mathématiques", "Histoire", "Français"],
                "badges": [
                    {"nom": "🎯 Premier Pas", "description": "A posé sa première question"},
                    {"nom": "🔥 Curieux", "description": "3 jours consécutifs de questions"},
                    {"nom": "🧮 Math Expert", "description": "10 questions en mathématiques"}
                ],
                "streak": 3,
                "temps_total": "5h 30min"
            }

    def autoplay_audio(self, audio_data):
        b64 = base64.b64encode(audio_data).decode()
        md = f"""
            <audio autoplay>
                <source src="data:audio/mp3;base64,{b64}" type="audio/mp3">
            </audio>
            """
        st.markdown(md, unsafe_allow_html=True)

    def create_execution_dump(self, messages):
        return {
            "thread_id": st.session_state.thread_id,
            "messages": [vars(message) for message in messages]
        }

    def get_avatar_image(self):
        """Charge et prépare l'image de l'avatar pour l'assistant."""
        try:
            # Vérifier si le dossier assets existe, sinon le créer
            assets_dir = Path("assets")
            if not assets_dir.exists():
                assets_dir.mkdir(parents=True)
            
            # Chemin de l'avatar
            avatar_path = assets_dir / "educoach_avatar.png"
            
            # Si l'avatar existe, le charger
            if avatar_path.exists():
                return Image.open(avatar_path)
            else:
                logger.warning("Avatar image not found in assets directory")
                return None
        except Exception as e:
            logger.error(f"Error loading avatar image: {e}")
            return None

    def load_avatar_image(self):
        """Charge et retourne l'image de l'avatar en base64."""
        try:
            avatar_path = Path("avatar.JPG")
            logger.info(f"Tentative de chargement de l'avatar depuis: {avatar_path.absolute()}")
            
            if not avatar_path.exists():
                logger.warning(f"Le fichier avatar n'existe pas à l'emplacement: {avatar_path.absolute()}")
                return None
                
            logger.info("Le fichier avatar existe, tentative d'ouverture...")
            with open(avatar_path, "rb") as f:
                image_bytes = f.read()
                base64_image = base64.b64encode(image_bytes).decode()
                logger.info("Image convertie en base64 avec succès")
                return f"data:image/jpeg;base64,{base64_image}"

        except FileNotFoundError as e:
            logger.error(f"Fichier introuvable: {e}")
            return None
        except Exception as e:
            logger.error(f"Erreur inattendue lors du chargement de l'avatar: {str(e)}")
            logger.exception(e)
            return None

    def display_chat_history(self, container):
        """Affiche l'historique des messages avec un style amélioré."""
        with container:
            for message in st.session_state.messages:
                # Pour l'assistant, on utilise l'avatar personnalisé
                if message["role"] == "assistant":
                    avatar = self.load_avatar_image() or "🤖"
                else:
                    avatar = "🤓"
                
                with st.chat_message(
                    message["role"],
                    avatar=avatar
                ):
                    # Ajout d'emojis contextuels selon le contenu
                    content = message["content"].strip()
                    # Nettoyage du contenu
                    content = content.replace("</div>", "").replace("<div>", "").strip()
                    
                    if message["role"] == "assistant":
                        if "?" in content:
                            content = "🤔 " + content
                        elif any(word in content.lower() for word in ["bravo", "excellent", "bien"]):
                            content = "🌟 " + content
                        elif any(word in content.lower() for word in ["exemple", "voici"]):
                            content = "📝 " + content
                        else:
                            content = "💡 " + content
                    
                    st.text(content)
            
            # Affichage conditionnel du bloc de débogage
            if st.session_state.debug_mode:
                with st.expander("🔧 Mode développeur", expanded=True):
                    st.markdown("### Données techniques")
                    st.json(st.session_state.messages)
                    if st.session_state.graph_state:
                        st.json(st.session_state.graph_state)

    def handle_user_input(self, prompt, audio_file):
        """Traite l'entrée utilisateur et génère une réponse."""
        current_prompt = prompt
        message_processed = False

        if audio_file:
            with st.spinner("🎤 Je t'écoute..."):
                try:
                    current_prompt = st.session_state.audio_service.transcribe_audio(audio_file.getvalue())
                    if not current_prompt:
                        st.warning("Je n'ai pas bien entendu, peux-tu répéter?")
                        return
                except Exception as e:
                    st.error("Oups! J'ai eu un petit souci. Peux-tu réessayer?")
                    return

        if current_prompt:
            user_message = HumanMessage(content=current_prompt)

            message_prefix = "🎤 " if audio_file else ""
            user_message_dict = {
                "role": "user", 
                "content": f"{message_prefix}{current_prompt}"
            }
            st.session_state.messages.append(user_message_dict)
            message_processed = True

            if st.session_state.agent is None:
                with st.spinner("🤖 Je me prépare à t'aider..."):
                    st.session_state.agent = create_agent(
                        api_key=self.api_key,
                        thread_id=st.session_state.thread_id,
                        system_prompt=st.session_state.instruction,
                    )

            with st.spinner("💭 Je réfléchis..."):
                try:
                    final_state = st.session_state.agent(current_prompt, st.session_state.thread_id)
                    st.session_state.graph_state = final_state

                    messages = final_state["messages"]
                    ai_messages = []
                    
                    for i in range(len(messages)-1, -1, -1):
                        if isinstance(messages[i], AIMessage):
                            ai_messages.insert(0, {
                                "role": "assistant",
                                "content": messages[i].content
                            })
                        else:
                            break
                    
                    st.session_state.messages.extend(ai_messages)

                    if st.session_state.tts_enabled:
                        for message in ai_messages:
                            try:
                                audio_data = st.session_state.audio_service.text_to_speech(message["content"])
                                self.autoplay_audio(audio_data)
                            except Exception as e:
                                st.error("Je n'ai pas pu parler, mais j'ai écrit ma réponse!")

                except Exception as e:
                    st.error("Oups! J'ai rencontré un petit problème. Peux-tu réessayer?")

    def run(self):
        """Point d'entrée principal de l'interface."""
        # Configuration de la barre latérale avec gamification
        with st.sidebar:
            st.markdown("### 🏆 Mon Profil")
            
            # Avatar
            avatar_image = self.load_avatar_image()
            if avatar_image:
                st.markdown(f"""
                    <div style="text-align: center;">
                        <img src="{avatar_image}" 
                             style="width: 150px; 
                                    height: 150px; 
                                    border-radius: 50%; 
                                    border: 3px solid #4CAF50;
                                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown("🤓")
            
            # Niveau et XP
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Niveau", st.session_state.user_stats["niveau"])
            with col2:
                st.metric("Streak", f"🔥 {st.session_state.user_stats['streak']} jours")
            
            # Barre de progression XP personnalisée
            xp = st.session_state.user_stats["xp"]
            xp_next = st.session_state.user_stats["xp_next_level"]
            progress = (xp / xp_next) * 100
            
            st.markdown(f"""
                <div class="xp-text">Progression vers le niveau suivant</div>
                <div class="xp-progress">
                    <div class="xp-progress-bar" style="width: {progress}%;"></div>
                </div>
                <div class="xp-text">{xp} / {xp_next} XP</div>
            """, unsafe_allow_html=True)
            
            # Statistiques
            st.markdown("### 📊 Statistiques")
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"""
                    <div class="stat-container">
                        <div class="stat-value">{st.session_state.user_stats['questions_posees']}</div>
                        <div class="stat-label">Questions posées</div>
                    </div>
                """, unsafe_allow_html=True)
            with col2:
                st.markdown(f"""
                    <div class="stat-container">
                        <div class="stat-value">{st.session_state.user_stats['temps_total']}</div>
                        <div class="stat-label">Temps d'apprentissage</div>
                    </div>
                """, unsafe_allow_html=True)
            
            # Sujets maîtrisés
            st.markdown("### 📚 Sujets maîtrisés")
            for sujet in st.session_state.user_stats["sujets_maitrises"]:
                st.markdown(f"""
                    <div class="subject-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>✨ {sujet}</span>
                            <span style="color: #4CAF50;">Maîtrisé</span>
                        </div>
                    </div>
                """, unsafe_allow_html=True)
            
            # Badges avec style amélioré
            st.markdown("### 🎖️ Mes badges")
            for badge in st.session_state.user_stats["badges"]:
                st.markdown(f"""
                    <div class="badge">
                        <div style="font-size: 1.1em;">{badge['nom']}</div>
                        <div style="font-size: 0.8em; opacity: 0.9;">{badge['description']}</div>
                    </div>
                """, unsafe_allow_html=True)
            
            # Calendrier de streak
            st.markdown("### 🔥 Streak actuel")
            streak_days = 7  # Nombre de jours à afficher
            st.markdown(f"""
                <div class="streak-calendar">
                    {''.join(['<div class="streak-day active"></div>' if i < st.session_state.user_stats['streak'] else '<div class="streak-day"></div>' for i in range(streak_days)])}
                </div>
                <div style="text-align: center; font-size: 0.8em; color: #666;">
                    {st.session_state.user_stats['streak']} jours consécutifs
                </div>
            """, unsafe_allow_html=True)
            
            # Paramètres existants
            st.markdown("---")
            st.markdown("### ⚙️ Paramètres")
            
            st.session_state.tts_enabled = st.toggle(
                "🔊 Activer la voix",
                value=st.session_state.tts_enabled,
                help="Je peux te parler!"
            )

            st.session_state.debug_mode = st.toggle(
                "🔧 Mode développeur",
                value=st.session_state.debug_mode,
                help="Affiche les données techniques"
            )

            if st.button("🆕 Nouvelle discussion", type="primary"):
                st.session_state.thread_id = str(uuid.uuid4())
                st.session_state.messages = []
                st.session_state.agent = None
                st.rerun()

        # Zone de chat plus conviviale
        st.markdown('<div class="chat-container">', unsafe_allow_html=True)
        
        # Zone de saisie
        prompt = st.chat_input("Pose-moi ta question ici! 😊", key="chat_input")
        
        # Bouton audio aligné
        audio_file = st.audio_input("🎤", key="audio_input", label_visibility="collapsed")

        if prompt or audio_file:
            self.handle_user_input(prompt, audio_file)

        # Affichage des messages
        main_container = st.container()
        self.display_chat_history(main_container)
        
        st.markdown('</div>', unsafe_allow_html=True)
