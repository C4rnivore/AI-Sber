import { create } from "zustand";
import type { NavigationTabs } from "@/utils/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface NavigationStore {
  navigationTab: NavigationTabs;
  setNavigationTab: (navigationTab: NavigationTabs) => void;
}

const useNavigationStore = create<NavigationStore>()(
  persist(
    (set): NavigationStore => ({
      navigationTab: "translator",
      setNavigationTab: (navigationTab: NavigationTabs) => {
        set({ navigationTab });
      },
    }),
    {
      name: "navigation-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useNavigationStore;
