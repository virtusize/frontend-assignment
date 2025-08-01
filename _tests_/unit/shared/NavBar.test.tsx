import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../../../src/components/shared/NavBar";
import { MemoryRouter } from "react-router-dom";

const logoutMock = jest.fn();
const navigateMock = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

jest.mock("../../../src/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    user: { username: "testuser" },
    logout: logoutMock,
  }),
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe("Navbar", () => {
  it("renders username", () => {
    renderWithRouter();
    expect(screen.getByText("Welcome testuser")).toBeInTheDocument();
  });

  it("calls logout and navigates on click", () => {
    renderWithRouter();
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/?mode=login", {
      replace: true,
    });
  });
});
