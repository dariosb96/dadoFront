// ConfirmSellModal.jsx
import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "",
  confirmText = "Sí",
  cancelText = "No",
  confirmColor = "bg-purple-800 hover:bg-purple-600", // color por defecto
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 text-black">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {message && <p className="text-gray-700 mb-4">{message}</p>}

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-md transition duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmColor} text-white font-medium px-4 py-2 rounded-md transition duration-300`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;