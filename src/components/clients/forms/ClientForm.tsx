import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientsStore } from "../../../stores/useClientStore";
import { AddClientData, addClientSchema } from "../../../schemas/clientSchema";
import Button from "../../shared/Button";
import { CURRENCYOPTIONS } from "../../../lib/constants";
import { toast } from "sonner";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { useState } from "react";
import fallbackImg from "../../../assets/fallback.jpg";

type AddClientFormProps = {
  initialData?: AddClientData;
  mode?: "add" | "edit";
  onSuccess: () => void;
};

const AddClientForm = ({
  onSuccess,
  initialData,
  mode = "add",
}: AddClientFormProps) => {
  const { addClient, updateClient } = useClientsStore();
  const [imageBase64, setImageBase64] = useState<string | null>(
    initialData?.picture ?? null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addClientSchema),
    defaultValues: initialData,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const MAX_FILE_SIZE = 100 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      alert("Image is too large. Please upload one under 100 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: AddClientData) => {
    try {
      const now = new Date();
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const utcDate = fromZonedTime(now, userTimeZone);

      const registeredDate = formatInTimeZone(
        utcDate,
        "Etc/GMT+9",
        "yyyy-MM-dd'T'HH:mm:ss.SSS XXX"
      );

      const clientPayload = {
        ...data,
        subscriptionCost: parseFloat(data.subscriptionCost.toString()).toFixed(
          2
        ),
        picture: imageBase64 ?? "http://placehold.it/32x32",
      };

      if (mode === "edit" && initialData?.id) {
        await updateClient(initialData.id, clientPayload);
        toast.success("Client updated successfully");
      } else {
        await addClient({
          ...clientPayload,
          id: Date.now().toString(),
          registered: registeredDate,
        });
        toast.success("Client added successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Save client failed:", error);
      toast.error("Failed to save client. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Client" : "Add New Client"}
      </h2>

      <input
        type="text"
        {...register("name")}
        placeholder="Name"
        className="w-full border p-2 rounded"
      />
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}

      <input
        type="text"
        {...register("company")}
        placeholder="Company"
        className="w-full border p-2 rounded"
      />
      {errors.company && (
        <p className="text-red-600">{errors.company.message}</p>
      )}

      <input
        type="number"
        {...register("age")}
        placeholder="Age"
        className="w-full border p-2 rounded"
      />
      {errors.age && <p className="text-red-600">{errors.age.message}</p>}
      <div className="relative w-full">
        <select
          role="combobox"
          aria-label="Gender"
          {...register("gender")}
          className="w-full border p-2 pr-10 rounded appearance-none bg-white"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-600">
          ▼
        </div>
      </div>
      {errors.gender && <p className="text-red-600">{errors.gender.message}</p>}
      <div className="relative w-full">
        <select
          role="combobox"
          aria-label="Currency"
          {...register("currency")}
          className="w-full border p-2 pr-10 rounded appearance-none bg-white"
        >
          <option value="" disabled>
            Select Currency
          </option>
          {CURRENCYOPTIONS.map(({ code, symbol }) => (
            <option key={code} value={code}>
              {code} - {symbol}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-600">
          ▼
        </div>
      </div>
      {errors.currency && (
        <p className="text-red-600">{errors.currency.message}</p>
      )}
      <input
        type="number"
        step="0.01"
        {...register("subscriptionCost")}
        placeholder="Subscription Cost"
        className="w-full border p-2 rounded"
      />
      {errors.subscriptionCost && (
        <p className="text-red-600">{errors.subscriptionCost.message}</p>
      )}

      <div className="space-y-2">
        <label
          htmlFor="client-photo"
          className="block text-sm font-medium text-gray-700"
        >
          Client Photo
        </label>

        <div className="flex items-center gap-4">
          <input
            id="client-photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-md file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
          />

          {imageBase64 && (
            <img
              src={imageBase64}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImg;
              }}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-full border border-gray-300 shadow-sm"
            />
          )}
        </div>

        {imageBase64 && (
          <p className="text-xs text-gray-500 italic">
            Image preview. This will be saved with the client.
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {mode === "edit" ? "Update Client" : "Add Client"}
      </Button>
    </form>
  );
};

export default AddClientForm;
