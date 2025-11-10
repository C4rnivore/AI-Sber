import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TranslationStore {
  translateTo: "russian" | "nanai";
  setTranslateTo: (translateTo: "russian" | "nanai") => void;

  originalText: string;
  setOriginalText: (originalText: string) => void;

  translatedText: string;
  setTranslatedText: (translatedText: string) => void;
}

const useTranslationStore = create<TranslationStore>()(
  persist(
    (set) => ({
      translateTo: "nanai",
      setTranslateTo: (translateTo) => set({ translateTo }),

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
          Object.entries(state).filter(([key]) => ["translateTo"].includes(key))
        ),
    }
  )
);

export default useTranslationStore;
