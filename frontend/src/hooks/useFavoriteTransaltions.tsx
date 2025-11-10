import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteTranslationsStore {
  favoriteTranslations: string[];
  addFavoriteTranslation: (translation: string) => void;
  removeFavoriteTranslation: (translation: string) => void;
}

const useFavoriteTranslationsStore = create<FavoriteTranslationsStore>()(
  persist(
    (set, get) => ({
      favoriteTranslations: [],
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
