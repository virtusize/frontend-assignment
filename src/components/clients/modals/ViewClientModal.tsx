import { useEffect, useState } from "react";
import { useClientsStore } from "../../../stores/useClientStore";
import { formatDate } from "../../../lib/utils";
import fallbackImg from "../../../assets/fallback.jpg";

type Props = {
  id: string;
};

const ViewClientModal = ({ id }: Props) => {
  const { clients } = useClientsStore();
  const [client, setClient] = useState(() => clients.find((c) => c.id === id));

  useEffect(() => {
    if (!client) {
      fetch(`http://localhost:4090/clients/${id}`)
        .then((res) => res.json())
        .then(setClient)
        .catch(console.error);
    }
  }, [id]);

  if (!client) return null;

  return (
    <div className="max-w-xl w-full p-4 space-y-6" data-cy="client-view">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Client Profile
      </h2>

      <div className="flex items-center gap-4">
        <img
          src={client.picture}
          alt={client.name}
          className="w-24 h-24 rounded-full shadow object-cover border"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImg;
          }}
        />
        <div>
          <p className="text-lg font-semibold text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-600">{client.company}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
        <div>
          <span className="block text-gray-500">Age</span>
          <span>{client.age}</span>
        </div>
        <div>
          <span className="block text-gray-500">Gender</span>
          <span>{client.gender}</span>
        </div>
        <div>
          <span className="block text-gray-500">Subscription</span>
          <span>
            {client.currency} {client.subscriptionCost}
          </span>
        </div>
        <div>
          <span className="block text-gray-500">Registered On</span>
          <span>{formatDate(client.registered)}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;
