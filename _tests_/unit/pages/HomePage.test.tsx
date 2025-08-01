import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../../../src/routes/AppRoutes";

describe("AppRoutes", () => {
  it("renders HomePage by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /virtusize/i })
    ).toBeInTheDocument();
  });

  it("renders NotFound or fallback for unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/non-existent"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
