import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../../../src/components/shared/ProtectedRoute";
import { MemoryRouter } from "react-router-dom";

let isAuthenticatedMock = true;

jest.mock("../../../src/stores/useAuthStore", () => ({
  useAuthStore: () => ({
    isAuthenticated: isAuthenticatedMock,
  }),
}));

jest.mock("../../../src/components/shared/NavBar", () => () => (
  <div>Mock Navbar</div>
));

jest.mock("../../../src/components/shared/SideBar", () => () => (
  <div>Mock Sidebar</div>
));

describe("ProtectedRoute", () => {
  it("redirects to login if not authenticated", () => {
    isAuthenticatedMock = false;
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders layout and children if authenticated", () => {
    isAuthenticatedMock = true;
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.getByText("Mock Navbar")).toBeInTheDocument();
    expect(screen.getByText("Mock Sidebar")).toBeInTheDocument();
  });
});
