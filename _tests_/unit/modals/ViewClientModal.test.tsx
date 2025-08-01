import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ViewClientModal from "../../../src/components/clients/modals/ViewClientModal";
import { useClientsStore } from "../../../src/stores/useClientStore";
import fallbackImg from "../../../src/assets/fallback.jpg";
import { formatDate } from "../../../src/lib/utils";

jest.mock("../../../src/stores/useClientStore", () => ({
  useClientsStore: jest.fn(),
}));

global.fetch = jest.fn();

const mockClient = {
  id: "123",
  name: "John Doe",
  company: "Example Corp",
  age: 30,
  gender: "male",
  picture: "https://example.com/image.jpg",
  currency: "USD",
  subscriptionCost: "99.99",
  registered: "2025-08-01T09:45:23.626 -09:00",
};

describe("ViewClientModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders client from store", () => {
    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      clients: [mockClient],
    });

    render(<ViewClientModal id="123" />);
    expect(screen.getByText("Client Profile")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Example Corp")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("fetches client from API if not in store", async () => {
    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      clients: [],
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockClient),
    });

    render(<ViewClientModal id="123" />);

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );
  });

  it("renders null if client is not found and fetch fails", async () => {
    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      clients: [],
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));

    const { container } = render(<ViewClientModal id="999" />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("shows fallback image if client picture fails to load", async () => {
    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      clients: [mockClient],
    });

    render(<ViewClientModal id="123" />);
    const img = screen.getByRole("img") as HTMLImageElement;

    fireEvent.error(img);

    await waitFor(() => {
      expect(img.src).toContain(fallbackImg);
    });
  });
  it("displays formatted registration time", () => {
    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      clients: [mockClient],
    });

    render(<ViewClientModal id="123" />);

    const formatted = formatDate(mockClient.registered);
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });
});
