import { ClientsStore } from "./types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useClientsStore = create<ClientsStore>()(
  persist(
    (set) => ({
      clients: [],
      loading: false,

      fetchClients: async () => {
        set({ loading: true });
        try {
          const res = await fetch("http://localhost:4090/clients");
          const data = await res.json();
          set({ clients: data });
        } catch (error) {
          console.error("Fetch clients failed:", error);
        } finally {
          set({ loading: false });
        }
      },

      addClient: async (client) => {
        try {
          const res = await fetch("http://localhost:4090/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(client),
          });
          if (!res.ok) throw new Error("Failed to add client");

          const newClient = await res.json();
          set((state) => ({ clients: [...state.clients, newClient] }));
          return newClient;
        } catch (err) {
          console.error("Add client error:", err);
          throw err;
        }
      },
      updateClient: async (id, updated) => {
        try {
          const res = await fetch(`http://localhost:4090/clients/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          });
          if (!res.ok) throw new Error("Failed to update client");

          const updatedClient = await res.json();
          set((state) => ({
            clients: state.clients.map((c) =>
              c.id === id ? updatedClient : c
            ),
          }));
        } catch (err) {
          console.error("Update client error:", err);
        }
      },

      deleteClient: async (id) => {
        try {
          await fetch(`http://localhost:4090/clients/${id}`, {
            method: "DELETE",
          });
          set((state) => ({
            clients: state.clients.filter((c) => c.id !== id),
          }));
        } catch (err) {
          console.error("Delete client error:", err);
        }
      },
    }),
    { name: "clients-storage" }
  )
);
