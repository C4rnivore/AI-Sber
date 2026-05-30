import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://api.ai-heritage.ru"
    : "http://localhost:8000");

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
  const response = await axios
    .get(buildTranslationUrl(text, translateTo, attempt), { signal }) // По умолчанию 1 чтобы использовался дефолтный перевод по полной строке
    ;
  return response.data.text_to_translated;
};

export const fetchTextToSpeech = async (
  text: string,
  language: "russian" | "nanai",
  signal?: AbortSignal,
) => {
  const response = await axios
    .get(buildTextToSpeechUrl(text, language), { signal });
  return response.data.audio;
};

export const fetchWordUsages = async (word: string, signal?: AbortSignal) => {
  const response = await axios
    .get(`${API_BASE}/dictionary/get-word?word=${word}`, { signal });
  return response.data.translations;
};

export const fetchSentencesUsages = async (word: string, signal?: AbortSignal) => {
  const response = await axios
    .get(`${API_BASE}/dictionary/sentences?word=${word}`, { signal });
  return response.data.matches;
};
