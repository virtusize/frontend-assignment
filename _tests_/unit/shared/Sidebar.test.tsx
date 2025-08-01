import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Sidebar from "../../../src/components/shared/SideBar";

const renderWithPath = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<Sidebar />} />
      </Routes>
    </MemoryRouter>
  );

describe("Sidebar", () => {
  it("highlights Dashboard link when on /dashboard", () => {
    renderWithPath("/dashboard");
    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toHaveClass("bg-gray-300");
  });

  it("renders link/s", () => {
    renderWithPath("/somewhere-else");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
