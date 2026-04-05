export type NavigationTabs =
  | "translator"
  | "favorites"
  | "history"
  | "storyteller";

export type TranslationResponseDTO = {
  text_to_translated: string;
};

export type TextToSpeechResponseDTO = {
  audio: string;
};

export type WordUsagesDTO = {
  original: string;
  translations: string[];
};

export type SentencesUsagesDTO = {
  searched_word: string;
  matches: { original: string; translated: string }[];
};
