from elevenlabs.client import ElevenLabs
from elevenlabs import play, save

import os

def generate_voice(text: str, voice_id: str, output_path: str) -> None:
    """
    Generate voice from text using ElevenLabs API and save it to a file.

    Args:
        text (str): The text to convert to speech.
        voice_id (str): The ID of the voice to use for the conversion.
        output_path (str): The path where the generated audio file will be saved.

    Returns:
        None
    """
    # Initialize ElevenLabs client with your API key
    api_key = os.getenv("ELEVENLABS_API_KEY")
    client = ElevenLabs(api_key=api_key)

    # Generate audio from text using the specified voice ID
    audio = client.generate(
        text=text,
        voice=voice_id,
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",

    )

    # Save the generated audio to a file
    save(audio, output_path)
    print(f"Audio saved to {output_path}")

