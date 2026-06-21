import { create } from "zustand";

interface DocStore {
  activeVariantIndex: number;
  setActiveVariantIndex: (index: number) => void;
}

export const useDocStore = create<DocStore>((set) => ({
  activeVariantIndex: -1,
  setActiveVariantIndex: (index) => set({ activeVariantIndex: index }),
}));
