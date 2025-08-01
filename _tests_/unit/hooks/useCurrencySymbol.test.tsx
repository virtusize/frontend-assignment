import { renderHook } from "@testing-library/react";
import { useCurrencySymbol } from "../../../src/lib/hooks/useCurrencySymbol";

describe("useCurrencySymbol", () => {
  it("returns correct symbols for known currencies", () => {
    const { result } = renderHook(() => useCurrencySymbol());

    expect(result.current.getSymbol("USD")).toBe("$");
    expect(result.current.getSymbol("INR")).toBe("₹");
    expect(result.current.getSymbol("CAD")).toBe("C$");
    expect(result.current.getSymbol("SGD")).toBe("S$");
    expect(result.current.getSymbol("Yen")).toBe("¥");
  });

  it("returns original code if unknown", () => {
    const { result } = renderHook(() => useCurrencySymbol());
    expect(result.current.getSymbol("ABC")).toBe("ABC");
  });
});
