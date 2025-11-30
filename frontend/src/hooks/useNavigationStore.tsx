import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { NavigationStore } from "@/utils/interfaces";

/**
 * Хук для хранения состояния навигации
 */
const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      navigationTab: "translator",
      setNavigationTab: (navigationTab) => set({ navigationTab }),
    }),
    {
      name: "navigation-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useNavigationStore;
