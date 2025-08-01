import { render, screen, fireEvent } from "@testing-library/react";
import PaginatedTable from "../../../src/components/shared/Table";

type MockData = {
  id: number;
  name: string;
};

const generateMockData = (count: number): MockData[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

const columns = [
  {
    label: "ID",
    render: (item: MockData) => item.id,
  },
  {
    label: "Name",
    render: (item: MockData) => item.name,
  },
];

describe("PaginatedTable", () => {
  it("renders headers correctly", () => {
    render(<PaginatedTable data={[]} columns={columns} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders the first page of data", () => {
    render(
      <PaginatedTable
        data={generateMockData(15)}
        columns={columns}
        itemsPerPage={10}
      />
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 10")).toBeInTheDocument();
    expect(screen.queryByText("Item 11")).not.toBeInTheDocument();
  });

  it("navigates to the next page", () => {
    render(
      <PaginatedTable
        data={generateMockData(15)}
        columns={columns}
        itemsPerPage={10}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("Item 11")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("navigates back to previous page", () => {
    render(
      <PaginatedTable
        data={generateMockData(15)}
        columns={columns}
        itemsPerPage={10}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /prev/i }));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 11")).not.toBeInTheDocument();
  });

  it("disables Prev on first page and Next on last page", () => {
    render(
      <PaginatedTable
        data={generateMockData(15)}
        columns={columns}
        itemsPerPage={10}
      />
    );

    const prevButton = screen.getByRole("button", { name: /prev/i });
    expect(prevButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("shows correct page number", () => {
    render(
      <PaginatedTable
        data={generateMockData(15)}
        columns={columns}
        itemsPerPage={10}
      />
    );
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });
});
