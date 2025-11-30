import axios from "axios";

export const buildTranslationUrl = (originalText: string, translateTo: "russian" | "nanai") => {
  const prefix = translateTo === "nanai" ? "to-nanai" : "to-russian";
  const field = translateTo === "nanai" ? "russian_text" : "nanai_text";
  return `http://localhost:3001/translation/${prefix}?${field}=${originalText}`;
};

export const fetchTranslation = (text: string, translateTo: "russian" | "nanai") => {
    return axios.get(buildTranslationUrl(text, translateTo))
    .then((response) => response.data.text_to_translated);
}