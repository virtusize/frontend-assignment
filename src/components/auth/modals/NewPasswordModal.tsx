import { NewPasswordForm } from "../forms";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

const NewPasswordModal = ({ isOpen, onClose, onSubmit }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Enter New Password</h2>
        <NewPasswordForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};

export default NewPasswordModal;
