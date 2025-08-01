import { act } from "react";
import { useClientsStore } from "../../../src/stores/useClientStore";

describe("useClientsStore", () => {
  beforeEach(() => {
    useClientsStore.setState({ clients: [], loading: false });
    global.fetch = jest.fn();
  });

  it("initializes with empty clients", () => {
    const state = useClientsStore.getState();
    expect(state.clients).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it("fetches clients and updates state", async () => {
    const mockData = [
      {
        id: "6",
        gender: "male",
        name: "Barron Bowen",
        company: "EBIDCO",
        age: 38,
        picture: "http://placehold.it/32x32",
        registered: "2019-10-18T07:26:00 -09:00",
        currency: "SGD",
        subscriptionCost: "500.00",
      },
      {
        id: "1753893243211",
        name: "test",
        company: "tttt",
        age: 44,
        gender: "male",
        currency: "GBP",
        subscriptionCost: "500.00",
        picture: "http://placehold.it/32x32",
        registered: "2025-07-30T16:34:03.211 -09:00",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await act(async () => {
      await useClientsStore.getState().fetchClients();
    });

    const state = useClientsStore.getState();
    expect(state.clients).toEqual(mockData);
    expect(state.loading).toBe(false);
  });

  it("adds a new client via addClient()", async () => {
    const mockClient = {
      id: "999",
      name: "Added Client",
      company: "AddCorp",
      currency: "USD",
      subscriptionCost: "500",
      age: 25,
      gender: "female",
      picture: "http://placehold.it/32x32",
      registered: "2021-05-31T02:24:00 -09:00",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockClient,
    });

    await act(async () => {
      await useClientsStore.getState().addClient(mockClient);
    });

    const state = useClientsStore.getState();
    expect(state.clients).toContainEqual(mockClient);
  });

  it("updates a client via updateClient()", async () => {
    const original = {
      id: "1",
      name: "Alice",
      company: "OldCo",
      currency: "USD",
      subscriptionCost: "500",
      age: 25,
      gender: "female",
      picture: "http://placehold.it/32x32",
      registered: "2021-05-31T02:24:00 -09:00",
    };
    useClientsStore.setState({ clients: [original] });

    const updated = { name: "Alice Updated", company: "NewCo" };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...original, ...updated }),
    });

    await act(async () => {
      await useClientsStore.getState().updateClient("1", updated);
    });

    const state = useClientsStore.getState();
    expect(state.clients[0]).toEqual({ ...original, ...updated });
  });

  it("deletes a client via deleteClient()", async () => {
    const existingClient = {
      id: "1",
      name: "ToDelete",
      company: "Test",
      currency: "USD",
      subscriptionCost: "500",
      age: 25,
      gender: "female",
      picture: "http://placehold.it/32x32",
      registered: "2021-05-31T02:24:00 -09:00",
    };

    useClientsStore.setState({ clients: [existingClient] });

    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await act(async () => {
      await useClientsStore.getState().deleteClient("1");
    });

    const state = useClientsStore.getState();
    expect(state.clients).toEqual([]);
  });
});
