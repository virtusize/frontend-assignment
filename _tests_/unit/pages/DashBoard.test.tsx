import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../../../src/pages/Dashboard";

let useClientsStoreMock: jest.Mock;

jest.mock("../../../src/stores/useClientStore", () => ({
  get useClientsStore() {
    return useClientsStoreMock;
  },
}));

jest.mock("../../../src/lib/hooks/useCurrencySymbol", () => ({
  useCurrencySymbol: () => ({
    getSymbol: (currency: string) => (currency === "USD" ? "$" : "€"),
  }),
}));

const openMock = jest.fn();
jest.mock("../../../src/stores/useModalStore", () => ({
  useModalStore: () => ({
    open: openMock,
  }),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    useClientsStoreMock = jest.fn().mockReturnValue({
      clients: [
        {
          name: "Alice",
          company: "Acme Inc",
          currency: "USD",
          subscriptionCost: 29.99,
          age: 30,
        },
        {
          name: "Bob",
          company: "Beta LLC",
          currency: "EUR",
          subscriptionCost: 19.99,
          age: 40,
        },
      ],
      fetchClients: jest.fn(),
    });
  });

  it("renders search input and add client button", () => {
    render(<Dashboard />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /\+ add client/i })
    ).toBeInTheDocument();
  });

  it("renders clients in table", () => {
    render(<Dashboard />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Acme Inc")).toBeInTheDocument();
    expect(screen.getByText("$ 29.99")).toBeInTheDocument();
  });

  it("calls open with modal id when add button is clicked", () => {
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: /\+ add client/i }));
    expect(openMock).toHaveBeenCalledWith("add-client");
  });

  it("calls fetchClients on mount", () => {
    const mockFetch = jest.fn();
    useClientsStoreMock.mockReturnValueOnce({
      clients: [],
      fetchClients: mockFetch,
    });

    render(<Dashboard />);
    expect(mockFetch).toHaveBeenCalled();
  });
});
