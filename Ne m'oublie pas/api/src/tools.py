from langchain.chat_models import init_chat_model
import os
from elevenlabs.client import ElevenLabs
from elevenlabs import save

def get_model():
    model = init_chat_model("mistral-large-latest", model_provider="mistralai", temperature=0.2)
    #model = init_chat_model("gpt-4o-mini", model_provider="openai", temperature=0.3, max_retries=3)
    return model

def text_to_file(text: str, file_path: str):

    api_key = os.getenv("ELEVENLABS_API_KEY")
    client = ElevenLabs(api_key=api_key)
    voice_id = "sSSnx1yBXjhBo6gzmfyI"

    # Generate audio from text using the specified voice ID
    audio = client.generate(
        text=text,
        voice=voice_id,
        model="eleven_multilingual_v2",
        output_format="mp3_44100_128",
        # voice_settings={
        #     "stability": 0.70,
        #     "similarity_boost": 0.75
        # }
    )

    # Save the generated audio to a file
    save(audio, file_path)
    print(f"Audio saved to {file_path}")