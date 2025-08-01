import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../../../src/components/auth/forms/RegisterForm";

describe("RegisterForm", () => {
  const noop = () => {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<RegisterForm onSuccess={noop} />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });

  it("shows error if passwords do not match", async () => {
    render(<RegisterForm onSuccess={noop} />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "kervy" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "xyz123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("shows error if password is too short", async () => {
    render(<RegisterForm onSuccess={noop} />);

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "kervy" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "12" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least/i)
      ).toBeInTheDocument();
    });
  });
});
