import openai
from app.utils.logger import setup_logger
import tempfile
import os

logger = setup_logger("audio_service")

class AudioService:
    # Instruction par défaut pour l'assistant
    DEFAULT_INSTRUCTION = """
    Accent : Speak with a French accent from France (not Canadian/Quebecois !),

    Voice Affect:
    Friendly, relaxed, and approachable — speak like you’re chatting with close friends over coffee or during a gaming session. Create a warm, genuine, and easygoing vibe full of camaraderie and trust.

    Tone:
    Use a slightly pitch than normal adult speech.
    Playful, supportive, and a little teasing in a light-hearted, good-natured way. Use humor to soften any moments of doubt, and build a “we’ve got this together” kind of energy. Encourage with friendly challenge, like “Come on, show me what you’ve got,” but never pushy or pressuring.

    Pacing:
    Natural and flowing, with lively little bursts—just like in a real conversation between friends. Don’t hesitate to slow down for a punchline, or speed up to build excitement or suspense.

    Emotion:
    Warmth, kindness, and a cheeky spark. You're here to say: “We’re all in this together,” that you believe in them, and that there’s always room for laughter—even when things get tricky. The energy is positive, uplifting, and contagious.

    Pronunciation:
    Clear, but relaxed. Loosen up on the formal tone—use casual expressions, friendly interjections, a conversational rhythm. Talk like you would to your crew.

    Pauses:
    Use silences like winks. Take a beat after a joke, or after a question like “You know what I mean?” — leaving space for a smile, a laugh, or that shared moment of understanding.
    """

    def __init__(self, api_key: str):
        """
        Initialise le service audio avec la clé API OpenAI.
        
        Args:
            api_key (str): La clé API OpenAI
        """
        self.client = openai.OpenAI(api_key=api_key)
        logger.info("Service audio initialisé")

    def transcribe_audio(self, audio_bytes: bytes, prompt: str = None) -> str:
        """
        Transcrit l'audio en texte en utilisant l'API Whisper d'OpenAI.
        
        Args:
            audio_bytes (bytes): Les données audio à transcrire
            prompt (str, optional): Instructions ou contexte pour la transcription
            
        Returns:
            str: Le texte transcrit
        """
        try:
            # Création d'un fichier temporaire pour l'audio
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name

            # Vérification de la taille du fichier
            file_size = os.path.getsize(temp_file_path)
            if file_size > 25 * 1024 * 1024:  # 25 MB
                raise ValueError(f"Le fichier audio est trop volumineux: {file_size / 1024 / 1024:.2f} MB. Maximum: 25 MB")

            # Transcription avec Whisper
            with open(temp_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=audio_file,
                    language="fr",
                    temperature=0.2
                )
            
            # Nettoyage du fichier temporaire
            os.unlink(temp_file_path)
            
            logger.info("Transcription audio réussie")
            return transcript.text
            
        except Exception as e:
            logger.error(f"Erreur lors de la transcription audio : {str(e)}")
            raise Exception(f"Erreur lors de la transcription : {str(e)}")

    def text_to_speech(self, text: str) -> bytes:
        """
        Convertit le texte en audio en utilisant l'API TTS d'OpenAI.
        
        Args:
            text (str): Le texte à convertir en audio
            
        Returns:
            bytes: Les données audio générées
        """
        try:
            response = self.client.audio.speech.create(
                model="gpt-4o-mini-tts",
                voice="ballad",
                input=text
            )
            logger.info("Conversion TTS réussie")
            return response.content
        except Exception as e:
            logger.error(f"Erreur lors de la conversion TTS : {str(e)}")
            raise Exception(f"Erreur lors de la conversion TTS : {str(e)}") 