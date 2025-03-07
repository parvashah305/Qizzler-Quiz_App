import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 relative text-white">
        <button onClick={onClose} className="absolute top-3 right-3 text-white text-xl">
          <FiX />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;