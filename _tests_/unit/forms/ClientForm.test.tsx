import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useClientsStore } from "../../../src/stores/useClientStore";
import AddClientForm from "../../../src/components/clients/forms/ClientForm";

jest.mock("../../../src/stores/useClientStore");

const mockAddClient = jest.fn();
const mockUpdateClient = jest.fn();

beforeEach(() => {
  (useClientsStore as unknown as jest.Mock).mockReturnValue({
    addClient: mockAddClient,
    updateClient: mockUpdateClient,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AddClientForm (add mode)", () => {
  it("submits new client with required fields", async () => {
    const onSuccess = jest.fn();

    render(<AddClientForm mode="add" onSuccess={onSuccess} />);

    fireEvent.input(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText("Company"), {
      target: { value: "ACME Corp" },
    });
    fireEvent.input(screen.getByPlaceholderText("Age"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Gender" }), {
      target: { value: "male" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Currency" }), {
      target: { value: "USD" },
    });
    fireEvent.input(screen.getByPlaceholderText("Subscription Cost"), {
      target: { value: "49.99" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add client/i }));

    await waitFor(() => {
      expect(mockAddClient).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe("AddClientForm (edit mode)", () => {
  const initialData = {
    id: "123",
    name: "Jane Smith",
    company: "Globex",
    age: 35,
    gender: "female" as "male" | "female",
    currency: "EUR",
    subscriptionCost: 99.99,
    picture: "data:image/png;base64,abc123",
  };

  it("renders initial data and submits update", async () => {
    const onSuccess = jest.fn();

    render(
      <AddClientForm
        mode="edit"
        initialData={initialData}
        onSuccess={onSuccess}
      />
    );

    expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Globex")).toBeInTheDocument();

    fireEvent.input(screen.getByPlaceholderText("Name"), {
      target: { value: "Jane Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update client/i }));

    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalledWith(
        "123",
        expect.objectContaining({ name: "Jane Updated" })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

describe("AddClientForm image handling", () => {
  const initialData = {
    id: "123",
    name: "Jane Smith",
    company: "Globex",
    age: 35,
    gender: "female" as "male" | "female",
    currency: "EUR",
    subscriptionCost: 99.99,
    picture: "data:image/png;base64,abc123",
  };
  it("displays preview when base64 image is uploaded", async () => {
    render(<AddClientForm mode="add" onSuccess={() => {}} />);

    const file = new File(["dummy"], "test.png", { type: "image/png" });

    const input = screen.getByLabelText("Client Photo");
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
  });

  it("uses fallback image on error", async () => {
    render(
      <AddClientForm
        mode="edit"
        onSuccess={() => {}}
        initialData={{ ...initialData }}
      />
    );

    const img = screen.getByAltText("Preview") as HTMLImageElement;

    fireEvent.error(img);

    await waitFor(() => {
      expect(img.src).toContain("test-file-stub");
    });
  });
});
