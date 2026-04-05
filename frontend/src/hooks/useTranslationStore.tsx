import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TranslationStore } from "@/utils/interfaces";

/**
 * Хук для хранения состояния переводчика
 * @returns объект с состоянием переводчика:
 * translateTo - язык перевода, originalText - исходный текст, translatedText - переведенный текст
 */
const useTranslationStore = create<TranslationStore>()(
  persist(
    (set) => ({
      translateTo: "russian",
      setTranslateTo: (translateTo) => set({ translateTo }),

      translateFrom: "nanai",
      setTranslateFrom: (translateFrom) => set({ translateFrom }),

      originalText: "",
      setOriginalText: (originalText) => set({ originalText }),

      translatedText: "",
      setTranslatedText: (translatedText) => set({ translatedText }),
    }),
    {
      name: "translation-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            [
              "translateTo",
              "translateFrom",
              "originalText",
              "translatedText",
            ].includes(key),
          ),
        ),
    },
  ),
);

export default useTranslationStore;
