import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TranslatorModeStore {
  translatorMode: "expanded" | "collapsed";
  setTranslatorMode: (mode: "expanded" | "collapsed") => void;
}

const useTranslatorModeStore = create<TranslatorModeStore>()(
  persist(
    (set) => ({
      translatorMode: "collapsed",
      setTranslatorMode: (translatorMode) => set({ translatorMode }),
    }),
    {
      name: "translator-mode-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useTranslatorModeStore;
