import { render, screen } from "@testing-library/react";
import Button from "../../../src/components/shared/Button";
import userEvent from "@testing-library/user-event";

describe("Button component", () => {
  it("renders with children", () => {
    render(<Button>Click Me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("applies variant styles correctly", () => {
    const { rerender } = render(<Button variant="filled">Filled</Button>);
    expect(screen.getByText("Filled").className).toMatch(/bg-blue-600/);

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline").className).toMatch(/border-gray-300/);

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText("Ghost").className).toMatch(/text-blue-600/);
  });

  it("disables the button when `disabled` is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
  it("disables and shows spinner when `loading` is true", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();

    const spinner = btn.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner?.getAttribute("class")).toMatch(/animate-spin/);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button").className).toMatch(/custom-class/);
  });

  it("fires onClick event", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});
