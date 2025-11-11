import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  FavoriteTranslationItem,
  FavoriteTranslationsStore,
} from "@/utils/interfaces";

/**
 * Хук для хранения состояния избранных переводов
 */
const useFavoriteTranslationsStore = create<FavoriteTranslationsStore>()(
  persist(
    (set, get) => ({
      favoriteTranslations: [],
      addFavoriteTranslation: (translation) =>
        set({
          favoriteTranslations: [...get().favoriteTranslations, translation],
        }),
      removeFavoriteTranslation: (id: FavoriteTranslationItem["id"]) =>
        set({
          favoriteTranslations: get().favoriteTranslations.filter(
            (t) => t.id !== id
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
