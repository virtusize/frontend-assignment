import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "./types";

export const authPartialize = (state: AuthState) =>
  state.isAuthenticated
    ? { isAuthenticated: state.isAuthenticated, user: state.user }
    : {};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => {
        set({ isAuthenticated: true, user });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth",
      partialize: authPartialize,
    }
  )
);
