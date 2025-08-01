import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NewPasswordForm } from "../../../src/components/auth/forms";

describe("NewPasswordForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the password input and buttons", () => {
    render(<NewPasswordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    render(<NewPasswordForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText(/new password/i);
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least/i)
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits valid password", async () => {
    render(<NewPasswordForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "validPass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("validPass123");
    });
  });

  it("calls onCancel and resets when cancel is clicked", () => {
    render(<NewPasswordForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const input = screen.getByPlaceholderText(/new password/i);
    fireEvent.change(input, { target: { value: "anything" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe("");
  });
});
