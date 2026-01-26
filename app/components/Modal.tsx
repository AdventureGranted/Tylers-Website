import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative max-w-xs rounded-2xl bg-gray-600 p-8 text-center shadow-xl">
        {children}
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-gray-400 px-6 py-2 font-bold text-gray-900 shadow transition-colors duration-200 hover:scale-105 hover:bg-yellow-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
