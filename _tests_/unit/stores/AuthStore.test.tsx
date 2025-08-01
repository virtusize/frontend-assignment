import { useAuthStore } from "../../../src/stores/useAuthStore";
import { act } from "react";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null });
  });

  it("should have default values", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("should login and set user", () => {
    const mockUser = { id: "1", username: "admin" };

    act(() => {
      useAuthStore.getState().login(mockUser);
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it("should logout and reset state", () => {
    const mockUser = { id: "1", username: "admin" };

    act(() => {
      useAuthStore.getState().login(mockUser);
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("should persist only when authenticated", () => {
    const partializeFn = (
      useAuthStore as typeof useAuthStore & {
        persist: { getOptions: () => { partialize?: (state: any) => any } };
      }
    ).persist.getOptions().partialize;

    const state = {
      isAuthenticated: true,
      user: { id: "1", username: "admin" },
      login: jest.fn(),
      logout: jest.fn(),
    };

    expect(partializeFn?.(state)).toEqual({
      isAuthenticated: true,
      user: { id: "1", username: "admin" },
    });
  });
});
