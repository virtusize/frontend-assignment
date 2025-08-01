import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmDeleteModal from "../../../src/components/clients/modals/ConfirmDeleteModal";
import { useClientsStore } from "../../../src/stores/useClientStore";
import { toast } from "sonner";

jest.mock("../../../src/stores/useClientStore", () => ({
  useClientsStore: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ConfirmDeleteModal", () => {
  const mockDeleteClient = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useClientsStore as unknown as jest.Mock).mockReturnValue({
      deleteClient: mockDeleteClient,
    });
  });

  it("renders modal text", () => {
    render(<ConfirmDeleteModal clientId="123" onSuccess={mockOnSuccess} />);
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this client?")
    ).toBeInTheDocument();
  });

  it("calls onSuccess when cancel is clicked", () => {
    render(<ConfirmDeleteModal clientId="123" onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("calls deleteClient and shows success toast on confirm delete", async () => {
    mockDeleteClient.mockResolvedValueOnce(undefined);

    render(<ConfirmDeleteModal clientId="123" onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockDeleteClient).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith("Client deleted");
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("shows error toast if deleteClient fails", async () => {
    mockDeleteClient.mockRejectedValueOnce(new Error("Fail"));

    render(<ConfirmDeleteModal clientId="123" onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockDeleteClient).toHaveBeenCalledWith("123");
      expect(toast.error).toHaveBeenCalledWith("Failed to delete client");
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
