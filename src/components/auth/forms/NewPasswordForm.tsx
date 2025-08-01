import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newPasswordSchema,
  NewPasswordSchema,
} from "../../../schemas/authSchema";
import Button from "../../shared/Button";

type Props = {
  onSubmit: (password: string) => void;
  onCancel?: () => void;
};

const NewPasswordForm = ({ onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  const internalSubmit = (data: NewPasswordSchema) => {
    onSubmit(data.password.trim());
    reset();
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="space-y-3">
      <input
        type="password"
        {...register("password")}
        className="w-full p-2 border rounded"
        placeholder="New password"
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          className="px-4 py-2 text-sm bg-gray-200 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default NewPasswordForm;
