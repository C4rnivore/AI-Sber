import { create } from "zustand";

interface LocalStorage {
  setValue: (key: string, value: string) => void;
  getValue: (key: string) => string | null;
  removeValue: (key: string) => void;
  clear: () => void;
}

const useLocalStorage = create<LocalStorage>(() => ({
  setValue: (key: string, value: string) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  getValue: (key: string) => {
    try {
      if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  },

  removeValue: (key: string) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
}));

export default useLocalStorage;
