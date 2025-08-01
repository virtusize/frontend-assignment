import Button from "./Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-2 rounded shadow max-w-md w-full relative">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-[15px] text-gray-500 hover:text-black text-xl"
        >
          ×
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
