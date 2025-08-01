import { render, screen } from "@testing-library/react";
import App from "../../src/App";

jest.mock("sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

jest.mock("../../src/providers/ModalProvider", () => () => (
  <div data-testid="modal-provider" />
));

jest.mock("../../src/routes/AppRoutes", () => () => (
  <div data-testid="app-routes">Mocked Routes</div>
));

describe("App", () => {
  it("renders Toaster, ModalProvider, and AppRoutes", () => {
    render(<App />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("modal-provider")).toBeInTheDocument();
    expect(screen.getByTestId("app-routes")).toHaveTextContent("Mocked Routes");
  });
});
