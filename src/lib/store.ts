import { create } from "zustand";
import type { Lang } from "./i18n";

interface AppStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  lang: "tr",
  setLang: (lang) => set({ lang }),
}));
