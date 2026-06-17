from transformers import VitsModel, AutoTokenizer
import torch
import scipy
import io
import base64


class TTSService:
    """Сервис для преобразования текста в речь"""

    def __init__(self):
        print("Загрузка моделей TTS...")
        self.models = {}
        self.tokenizers = {}

        self.models['ru'] = VitsModel.from_pretrained("facebook/mms-tts-rus")
        self.tokenizers['ru'] = AutoTokenizer.from_pretrained("facebook/mms-tts-rus")

        self.models['nanai'] = VitsModel.from_pretrained("facebook/mms-tts-gld")
        self.tokenizers['nanai'] = AutoTokenizer.from_pretrained("facebook/mms-tts-gld")

        print("Модели загружены!")

    def text_to_audio_base64(self, text: str, lang: str) -> str:
        model = self.models[lang]
        tokenizer = self.tokenizers[lang]
        sampling_rate = self.models[lang].config.sampling_rate
        inputs = tokenizer(text, return_tensors="pt")

        with torch.no_grad():
            output = model(**inputs).waveform
            audio_array = output.squeeze().numpy()

        with io.BytesIO() as buffer:
            scipy.io.wavfile.write(
                buffer,
                rate=sampling_rate,
                data=audio_array
            )
            audio_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

        return audio_base64


_tts_service: TTSService | None = None


def get_tts_service() -> TTSService:
    global _tts_service
    if _tts_service is None:
        _tts_service = TTSService()
    return _tts_service
