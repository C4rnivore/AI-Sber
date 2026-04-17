import axios, { AxiosResponse } from "axios";
import {
  WordUsagesDTO,
  SentencesUsagesDTO,
  TranslationResponseDTO,
  TextToSpeechResponseDTO,
} from "./types";

const API_BASE = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_PROD_SERVER_URL : (process.env.NEXT_PUBLIC_SERVER_URL || "localhost:3001");

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

export const fetchTranslation = (
  text: string,
  translateTo: "russian" | "nanai",
  attempt: number = 1,
  signal?: AbortSignal,
) => {
  return axios
    .get(buildTranslationUrl(text, translateTo, attempt), { signal }) // По умолчанию 1 чтобы использовался дефолтный перевод по полной строке
    .then(
      (response: AxiosResponse<TranslationResponseDTO>) =>
        response.data.text_to_translated,
    );
};

export const fetchTextToSpeech = (
  text: string,
  language: "russian" | "nanai",
  signal?: AbortSignal,
) => {
  return axios
    .get(buildTextToSpeechUrl(text, language), { signal })
    .then(
      (response: AxiosResponse<TextToSpeechResponseDTO>) => response.data.audio,
    );
};

export const fetchWordUsages = (word: string, signal?: AbortSignal) => {
  return axios
    .get(`${API_BASE}/dictionary/get-word?word=${word}`, { signal })
    .then(
      (response: AxiosResponse<WordUsagesDTO>) => response.data.translations,
    );
};

export const fetchSentencesUsages = (word: string, signal?: AbortSignal) => {
  return axios
    .get(`${API_BASE}/dictionary/sentences?word=${word}`, { signal })
    .then(
      (response: AxiosResponse<SentencesUsagesDTO>) => response.data.matches,
    );
};
