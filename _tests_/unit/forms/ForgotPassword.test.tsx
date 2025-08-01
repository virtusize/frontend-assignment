import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordForm from "../../../src/components/auth/forms/ForgotPasswordForm";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form inputs", () => {
    render(<ForgotPasswordForm onSuccess={jest.fn()} />);
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<ForgotPasswordForm onSuccess={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    });
  });

  it("shows error when user is not found", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ForgotPasswordForm onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "nonexistent" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("User not found.");
    });
  });

  it("opens modal when user is found", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "1", username: "testuser" }],
    });

    render(<ForgotPasswordForm onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "testuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
    });
  });
});
