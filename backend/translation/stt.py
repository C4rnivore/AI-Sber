from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
import os

class STTService:
    def __init__(self):
        print("Загрузка моделей STT...")
        self.processor = WhisperProcessor.from_pretrained("openai/whisper-medium")
        self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-medium")
        self.forced_decoder_ids = self.processor.get_decoder_prompt_ids(language="russian", task="transcribe")

        print("Модели загружены!")

    def audio_to_text(self, tmp_path) -> str:

        audio_array, sr = librosa.load(tmp_path, sr=16000)
        os.unlink(tmp_path)

        input_features = self.processor(
            audio_array,
            sampling_rate=sr,
            return_tensors="pt"
        ).input_features

        forced_decoder_ids = self.processor.get_decoder_prompt_ids(
            language="russian",
            task="transcribe"
        )

        predicted_ids = self.model.generate(
            input_features,
            forced_decoder_ids=forced_decoder_ids
        )

        text = self.processor.batch_decode(
            predicted_ids,
            skip_special_tokens=True
        )[0]

        return text


_stt_service: STTService | None = None


def get_stt_service() -> STTService:
    global _stt_service
    if _stt_service is None:
        _stt_service = STTService()
    return _stt_service