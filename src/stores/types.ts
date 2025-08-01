import { UserResponse } from "../components/auth/types";

export type AuthState = {
  isAuthenticated: boolean;
  user: UserResponse | null;
  login: (user: AuthState["user"]) => void;
  logout: () => void;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  subscriptionCost: string;
  currency: string;
  age: number;
  gender: string;
  picture: string;
  registered: string;
};

export interface ClientsStore {
  clients: Client[];
  loading: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  updateClient: (id: string, updated: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}
type ModalId = "add-client" | "edit-client" | "delete-client" | string;

export type ModalStore = {
  modalId: ModalId | null;
  props: Record<string, any>;
  open: (id: string, props?: Record<string, any>) => void;
  close: () => void;
  setModalId: (id: string | null, props?: Record<string, any>) => void;
  isOpen: (id: string) => boolean;
};
