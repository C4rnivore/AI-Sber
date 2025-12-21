import { TextareaHTMLAttributes } from "react";
import { NavigationTabs } from "./types";
import { AxiosRequestConfig } from "axios";

// Props
export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value?: string;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  className?: string;
  showCharCount?: boolean;
  syncHeight?: number;
  copy?: boolean;
  tts?: boolean;
  inFavorites?: boolean;
  interactive?: boolean;

  onChange?: (value: string) => void;
  onHeightChange?: (height: number) => void;
  onAddToFavorites?: () => void;
  onRemoveFromFavorites?: () => void;
  onWordSelect?: (word: string | null) => void;
}

export interface LanguageSwitcherProps {
  activeTargetLanguage: "nanai" | "russian";
  onChange: (lang: "nanai" | "russian") => void;
}

export interface FavoriteItemProps {
  sourceLanguage: string;
  content: string;
  className?: string;
}

export interface ButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
}

// Stores
export interface FavoriteTranslationItem {
  id: number;
  sourceLanguage: "nanai" | "russian";
  sourceContent: string;
  targetLanguage: "nanai" | "russian";
  targetContent: string;
  createdAt: Date;
}

export interface FavoriteTranslationsStore {
  favoriteTranslations: FavoriteTranslationItem[];
  addFavoriteTranslation: (translation: FavoriteTranslationItem) => void;
  removeFavoriteTranslation: (id: FavoriteTranslationItem["id"]) => void;
}

export interface NavigationStore {
  navigationTab: NavigationTabs;
  setNavigationTab: (navigationTab: NavigationTabs) => void;
}

export interface TranslationStore {
  translateTo: "russian" | "nanai";
  originalText: string;
  translatedText: string;
  setTranslateTo: (translateTo: "russian" | "nanai") => void;
  setOriginalText: (originalText: string) => void;
  setTranslatedText: (translatedText: string) => void;
}

export interface AlternativeTranslationsStore {
  alternativeTranslations: string[];
  addAlternativeTranslation: (translation: string) => void;
  clearAlternativeTranslations: () => void;
}

export interface UsagesStore {
  wordUsages: string[];
  sentencesUsages: { original: string; translation: string }[];
  setWordUsages: (words: string[]) => void;
  setSentencesUsages: (
    sentences: { original: string; translation: string }[]
  ) => void;
  clearUsages: () => void;
}

export interface HistoryTranslationItem {
  id: number;
  sourceLanguage: "nanai" | "russian";
  sourceText: string;
  targetLanguage: "nanai" | "russian";
  targetText: string;
  translatedAt: Date;
}

export interface HistoryStore {
  historyTranslations: HistoryTranslationItem[];
  addHistoryTranslation: (translation: HistoryTranslationItem) => void;
  removeHistoryTranslation: (id: HistoryTranslationItem["id"]) => void;
}

export interface HistoryItemProps {
  sourceLanguage: string;
  content: string;
  onDelete?: () => void;
}
