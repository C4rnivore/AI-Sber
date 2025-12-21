import axios, { AxiosResponse } from "axios";
import {
  WordUsagesDTO,
  SentencesUsagesDTO,
  TranslationResponseDTO,
} from "./types";

export const buildTranslationUrl = (
  originalText: string,
  translateTo: "russian" | "nanai",
  attempt: number
) => {
  const prefix = translateTo === "nanai" ? "to-nanai" : "to-russian";
  const field = translateTo === "nanai" ? "russian_text" : "nanai_text";
  return `http://localhost:5174/translation/${prefix}?${field}=${originalText}&attempt=${attempt}`;
};

export const fetchTranslation = (
  text: string,
  translateTo: "russian" | "nanai",
  attempt: number = 1,
  signal?: AbortSignal
) => {
  return axios
    .get(buildTranslationUrl(text, translateTo, attempt), { signal }) // По умолчанию 1 чтобы использовался дефолтный перевод по полной строке
    .then(
      (response: AxiosResponse<TranslationResponseDTO>) =>
        response.data.text_to_translated
    );
};

export const fetchWordUsages = (word: string, signal?: AbortSignal) => {
  return axios
    .get(`http://localhost:5174/dictionary/get-word?word=${word}`, { signal })
    .then(
      (response: AxiosResponse<WordUsagesDTO>) => response.data.translations
    );
};

export const fetchSentencesUsages = (word: string, signal?: AbortSignal) => {
  return axios
    .get(`http://localhost:5174/dictionary/sentences?word=${word}`, { signal })
    .then(
      (response: AxiosResponse<SentencesUsagesDTO>) => response.data.matches
    );
};
