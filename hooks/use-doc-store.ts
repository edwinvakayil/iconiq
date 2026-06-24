import { create } from "zustand";

interface DocStore {
  activeVariantIndex: number;
  playgroundCode: string | null;
  setActiveVariantIndex: (index: number) => void;
  setPlaygroundCode: (code: string | null) => void;
}

export const useDocStore = create<DocStore>((set) => ({
  activeVariantIndex: -1,
  playgroundCode: null,
  setActiveVariantIndex: (index) => set({ activeVariantIndex: index }),
  setPlaygroundCode: (code) => set({ playgroundCode: code }),
}));
