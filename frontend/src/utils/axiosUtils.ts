import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api.ai-heritage.ru"
    : "http://localhost:3002";

export const buildTranslationUrl = (
  originalText: string,
  translateTo: "russian" | "nanai",
  attempt: number,
) => {
  const prefix = translateTo === "nanai" ? "to-nanai" : "to-russian";
  const field = translateTo === "nanai" ? "russian_text" : "nanai_text";
  return `${API_BASE}/translation/${prefix}?${field}=${originalText}&attempt=${attempt}`;
};

export const buildTextToSpeechUrl = (
  text: string,
  language: "russian" | "nanai",
) => {
  return `${API_BASE}/tts/${language === "nanai" ? "nanai-tts" : "russian-tts"}?${language === "nanai" ? "nanai_text" : "ru_text"}=${text}`;
};

export const fetchTranslation = async (
  text: string,
  translateTo: "russian" | "nanai",
  attempt: number = 1,
  signal?: AbortSignal,
) => {
  const response = await axios.get(
    buildTranslationUrl(text, translateTo, attempt),
    { signal },
  ); // По умолчанию 1 чтобы использовался дефолтный перевод по полной строке
  return response.data.text_to_translated;
};

export const fetchTextToSpeech = async (
  text: string,
  language: "russian" | "nanai",
  signal?: AbortSignal,
) => {
  const response = await axios.get(buildTextToSpeechUrl(text, language), {
    signal,
  });
  return response.data.audio;
};

export const fetchWordUsages = async (word: string, signal?: AbortSignal) => {
  const response = await axios.get(
    `${API_BASE}/dictionary/get-word?word=${word}`,
    { signal },
  );
  return response.data.translations;
};

export const fetchSentencesUsages = async (
  word: string,
  signal?: AbortSignal,
) => {
  const response = await axios.get(
    `${API_BASE}/dictionary/sentences?word=${word}`,
    { signal },
  );
  return response.data.matches;
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const fetchSpeechToText = async (
  audioBlob: Blob,
  language: "russian" | "nanai",
  signal?: AbortSignal,
): Promise<string> => {
  if (language === "nanai") {
    const base64 = await blobToBase64(audioBlob);
    const response = await axios.get(`${API_BASE}/stt/nanai-stt`, {
      params: { nanai_audio: base64 },
      signal,
    });
    return response.data.text;
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const response = await axios.post(
    `${API_BASE}/stt/russian-stt`,
    formData,
    { signal },
  );
  return response.data.text;
};

export const fetchOCR = async (
  imageFile: File,
  signal?: AbortSignal,
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const response = await axios.post(
    `${API_BASE}/ocr/ocr`,
    formData,
    { signal },
  );
  return response.data.text;
};
