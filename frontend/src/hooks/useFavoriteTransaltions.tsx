import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteTranslationItem{
  sourceLanguage: "nanai" | "russian",
  sourceContent: string
  tragetLanguage: "nanai" | "russian",
  tragetContent: string
}

interface FavoriteTranslationsStore {
  favoriteTranslations: FavoriteTranslationItem[];
  addFavoriteTranslation: (translation: FavoriteTranslationItem) => void;
  removeFavoriteTranslation: (translation: FavoriteTranslationItem) => void;
}

const useFavoriteTranslationsStore = create<FavoriteTranslationsStore>()(
  persist(
    (set, get) => ({
      favoriteTranslations: [{
        sourceLanguage:"nanai",
        sourceContent: "1211111111111111111111111111111111",
        tragetLanguage:"russian",
        tragetContent: "1211111111111111111111111111111111 211111111111111111111111111111111211111111111111111111111111111111211111111111111111111111111111111",
      },{
        sourceLanguage:"nanai",
        sourceContent: "1211111111111111111111111111111111",
        tragetLanguage:"russian",
        tragetContent: "1211111111111111111111111111111111 211111111111111111111111111111111211111111111111111111111111111111211111111111111111111111111111111",
      },{
        sourceLanguage:"nanai",
        sourceContent: "1211111111111111111111111111111111",
        tragetLanguage:"russian",
        tragetContent: "1211111111111111111111111111111111 211111111111111111111111111111111211111111111111111111111111111111211111111111111111111111111111111",
      }],
      addFavoriteTranslation: (translation) =>
        set({
          favoriteTranslations: [...get().favoriteTranslations, translation],
        }),
      removeFavoriteTranslation: (translation) =>
        set({
          favoriteTranslations: get().favoriteTranslations.filter(
            (t) => t !== translation
          ),
        }),
    }),
    {
      name: "favorite-translations-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFavoriteTranslationsStore;
