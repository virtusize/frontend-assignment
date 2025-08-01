import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../../../src/components/shared/Modal";

describe("Modal component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Test Content</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders children and close button when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Test Modal</div>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "×" })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Test Modal</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole("button", { name: "×" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
