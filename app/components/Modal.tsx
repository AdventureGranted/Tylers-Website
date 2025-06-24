import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-xs relative">
        {children}
        <button
          onClick={onClose}
          className="mt-6 bg-gray-400 text-gray-900 font-bold py-2 px-6 rounded-full shadow hover:scale-105 hover:bg-yellow-300 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
