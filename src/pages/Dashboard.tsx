import { useClientsStore } from "../stores/useClientStore";
import PaginatedTable from "../components/shared/Table";
import { useEffect, useState } from "react";
import { useCurrencySymbol } from "../lib/hooks/useCurrencySymbol";
import Button from "../components/shared/Button";
import { useModalStore } from "../stores/useModalStore";
import { Client } from "../stores/types";
import { MODALIDS } from "../lib/constants";

export default function Dashboard() {
  const { clients, fetchClients } = useClientsStore();
  const { getSymbol } = useCurrencySymbol();
  const { open } = useModalStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.company.toLowerCase().includes(term)
    );
  });
  const columns = [
    { label: "Name", render: (c: Client) => c.name },
    { label: "Company", render: (c: Client) => c.company },
    {
      label: "Subscription",
      render: (c: Client) => `${getSymbol(c.currency)} ${c.subscriptionCost}`,
    },
    { label: "Age", render: (c: Client) => c.age },
    {
      label: <div className="text-center">Actions</div>,
      render: (c: Client) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="outline"
            className="text-blue-600 hover:underline"
            onClick={() => open(MODALIDS.VIEWCLIENT, { id: c.id })}
            data-cy="view-btn"
          >
            View
          </Button>
          <Button
            className="text-blue-600 hover:underline"
            onClick={() =>
              open(MODALIDS.EDITCLIENT, { mode: "edit", initialData: c })
            }
            data-cy="edit-btn"
          >
            Edit
          </Button>

          <Button
            className="bg-red-500 hover:underline"
            onClick={() => open(MODALIDS.CONFIRMDELETE, { id: c.id })}
            data-cy="delete-btn"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or company"
          data-cy="search-input"
          className="border p-2 rounded w-full max-w-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          type="button"
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => open("add-client")}
        >
          + Add Client
        </Button>
      </div>

      <PaginatedTable
        data={filteredClients}
        columns={columns}
        itemsPerPage={10}
        cypress="client-table"
      />
    </div>
  );
}
