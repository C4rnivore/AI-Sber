import { create } from "zustand";
import type { NavigationTabs } from "@/utils/types";

interface NavigationStore {
  navigationTab: NavigationTabs;
  setNavigationTab: (navigationTab: NavigationTabs) => void;
}

const useNavigationStore = create<NavigationStore>((set) => ({
  navigationTab:
    (window.localStorage.getItem("lastNavigationTab") as NavigationTabs) ||
    "translator",
  setNavigationTab: (navigationTab) => {
    set({ navigationTab });
  },
}));

export default useNavigationStore;
