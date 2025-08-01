import { ReactNode, useState } from "react";
import Button from "./Button";

type Column<T> = {
  label: string | ReactNode;
  render: (item: T) => React.ReactNode;
};

type PaginatedTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  cypress?: string;
};

export default function PaginatedTable<T>({
  data,
  columns,
  itemsPerPage = 10,
  cypress,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = data.slice(start, end);

  return (
    <>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table
          className="min-w-full table-auto text-sm text-left"
          data-cy={cypress}
        >
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => (
              <tr key={idx} className="border-t">
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-2">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center p-4 gap-2">
        <Button
          className="px-3 py-1 border rounded hover:bg-gray-100"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          className="px-3 py-1 border rounded hover:bg-gray-100"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
}
