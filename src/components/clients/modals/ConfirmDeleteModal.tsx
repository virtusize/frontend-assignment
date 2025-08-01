import { useClientsStore } from "../../../stores/useClientStore";

import { toast } from "sonner";
import Button from "../../shared/Button";

type Props = {
  clientId: string;
  onSuccess: () => void;
};

const ConfirmDeleteModal = ({ clientId, onSuccess }: Props) => {
  const { deleteClient } = useClientsStore();

  const handleDelete = async () => {
    try {
      await deleteClient(clientId);
      toast.success("Client deleted");
      onSuccess();
    } catch (err) {
      toast.error("Failed to delete client");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this client?
      </p>
      <div className="flex justify-end gap-2">
        <Button
          variant="filled"
          className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 "
          onClick={onSuccess}
        >
          <span className="text-gray-900">Cancel</span>
        </Button>
        <Button
          className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
