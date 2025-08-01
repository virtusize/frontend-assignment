import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../../../src/components/auth/forms";
import { useAuthStore as mockUseAuthStore } from "../../../src/stores/useAuthStore";

jest.mock("../../../src/stores/useAuthStore");

describe("LoginForm", () => {
  const mockLogin = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    (mockUseAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    jest.clearAllMocks();
  });

  it("renders username and password inputs", () => {
    render(<LoginForm onSuccess={jest.fn()} />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
  it("submits successfully with valid credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          username: "testuser",
          password: "password123",
        },
      ],
    }) as jest.Mock;

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: 1,
        username: "testuser",
        password: "password123",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("shows error message on invalid credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as jest.Mock;

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid username or password/i)
      ).toBeInTheDocument();
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("shows validation error for short password", async () => {
    (global.fetch as jest.Mock | undefined) = undefined;

    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 4 characters")
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
