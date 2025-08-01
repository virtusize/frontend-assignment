import { act } from "react";
import { useModalStore } from "../../../src/stores/useModalStore";

beforeEach(() => {
  const { close } = useModalStore.getState();
  act(() => {
    close();
  });
});

describe("useModalStore", () => {
  it("should initialize with null modalId and empty props", () => {
    const state = useModalStore.getState();
    expect(state.modalId).toBe(null);
    expect(state.props).toEqual({});
  });

  it("should set modalId and props when open is called", () => {
    act(() => {
      useModalStore.getState().open("test-modal", { foo: "bar" });
    });

    const state = useModalStore.getState();
    expect(state.modalId).toBe("test-modal");
    expect(state.props).toEqual({ foo: "bar" });
  });

  it("should reset modalId and props when close is called", () => {
    act(() => {
      useModalStore.getState().open("modal-1", { data: 123 });
      useModalStore.getState().close();
    });

    const state = useModalStore.getState();
    expect(state.modalId).toBe(null);
    expect(state.props).toEqual({});
  });

  it("should update modalId and props with setModalId", () => {
    act(() => {
      useModalStore.getState().setModalId("custom-modal", { id: 42 });
    });

    const state = useModalStore.getState();
    expect(state.modalId).toBe("custom-modal");
    expect(state.props).toEqual({ id: 42 });
  });

  it("isOpen should return true when modalId matches", () => {
    act(() => {
      useModalStore.getState().open("confirm-modal");
    });

    const isOpen = useModalStore.getState().isOpen("confirm-modal");
    expect(isOpen).toBe(true);
  });

  it("isOpen should return false when modalId does not match", () => {
    act(() => {
      useModalStore.getState().open("confirm-modal");
    });

    const isOpen = useModalStore.getState().isOpen("other-modal");
    expect(isOpen).toBe(false);
  });
});
