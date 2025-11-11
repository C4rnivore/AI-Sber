import { TextareaHTMLAttributes } from "react";
import { NavigationTabs } from "./types";

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
}

export interface LanguageSwitcherProps {
  activeTargetLanguage: "nanai" | "russian";
  onChange: (lang: "nanai" | "russian") => void;
}

export interface FavoriteItemProps {
  sourceLanguage: string;
  content: string;
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