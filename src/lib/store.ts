import { create } from "zustand";
import type { Lang } from "./i18n";

export interface Project {
  id: string;
  name: string;
  description: string;
  scratchId: string;
  likes: number;
  views: number;
  createdAt: string;
  author: string;
}

interface AppStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
  projects: Project[];
  addProject: (p: Omit<Project, "id" | "likes" | "views" | "createdAt">) => void;
  likeProject: (id: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  lang: "tr",
  setLang: (lang) => set({ lang }),
  projects: [
    {
      id: "1",
      name: "Uzay Macerası",
      description: "Bir uzay gemisiyle galaksiyi keşfet!",
      scratchId: "104",
      likes: 42,
      views: 230,
      createdAt: new Date().toISOString(),
      author: "ScratchKid",
    },
    {
      id: "2",
      name: "Platform Oyunu",
      description: "Klasik platform macerası",
      scratchId: "1032956",
      likes: 18,
      views: 95,
      createdAt: new Date().toISOString(),
      author: "GameMaker",
    },
    {
      id: "3",
      name: "Müzik Kutusu",
      description: "Kendi melodini oluştur!",
      scratchId: "10128407",
      likes: 67,
      views: 412,
      createdAt: new Date().toISOString(),
      author: "MusicFan",
    },
  ],
  addProject: (p) =>
    set((s) => ({
      projects: [
        {
          ...p,
          id: Date.now().toString(),
          likes: 0,
          views: 0,
          createdAt: new Date().toISOString(),
        },
        ...s.projects,
      ],
    })),
  likeProject: (id) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      ),
    })),
}));
