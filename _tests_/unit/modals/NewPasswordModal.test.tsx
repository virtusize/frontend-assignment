import { render, screen } from "@testing-library/react";
import NewPasswordModal from "../../../src/components/auth/modals/NewPasswordModal";

describe("NewPasswordModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders when isOpen is true", () => {
    render(
      <NewPasswordModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <NewPasswordModal
        isOpen={false}
        onSubmit={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
