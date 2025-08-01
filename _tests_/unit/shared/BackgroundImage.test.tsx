import { render, screen } from "@testing-library/react";
import BackgroundImage from "../../../src/components/shared/BackgroundImage";

describe("BackgroundImage", () => {
  it("renders with background image style", () => {
    render(<BackgroundImage src="/test.jpg" alt="Test image" />);
    const bgDiv = screen.getByRole("img", { name: "Test image" });
    expect(bgDiv).toHaveStyle({
      backgroundImage: "url(/test.jpg)",
    });
    expect(bgDiv).toHaveClass(
      "bg-cover",
      "bg-center",
      "blur-sm",
      "brightness-50"
    );
  });

  it("renders alt text for accessibility", () => {
    render(<BackgroundImage src="/test.jpg" alt="Accessible image" />);
    expect(
      screen.getByRole("img", { name: "Accessible image" })
    ).toBeInTheDocument();
  });

  it("renders children inside overlay container", () => {
    render(
      <BackgroundImage src="/test.jpg">
        <div>Child Content</div>
      </BackgroundImage>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});
