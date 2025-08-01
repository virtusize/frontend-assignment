import { create } from "zustand";
import { ModalStore } from "./types";

export const useModalStore = create<ModalStore>((set, get) => ({
  modalId: null,
  props: {},

  open: (id, props = {}) => set({ modalId: id, props }),
  close: () => set({ modalId: null, props: {} }),

  setModalId: (id, props = {}) =>
    set({ modalId: id, props: id ? props ?? {} : {} }),

  isOpen: (id) => get().modalId === id,
}));
