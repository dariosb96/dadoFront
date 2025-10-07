import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSells } from "../Redux/actions/Sells/getUserSells";
import ConfirmSellModal from "../components/sales/confirmModal";
import { confirmSell } from "../Redux/actions/Sells/confirmSell";
import { deleteSell } from "../Redux/actions/Sells/deleteSell";


const View_Sells = () => {
  const dispatch = useDispatch();
  const { sells, loading, error } = useSelector((state) => state.sells);
  const token = localStorage.getItem("token");

  // Estado para confirmar venta
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSell, setSelectedSell] = useState(null);

  // Estado para eliminar venta
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sellToDelete, setSellToDelete] = useState(null);

  useEffect(() => {
    dispatch(getUserSells(token));
  }, [dispatch, token]);

  // Confirmar venta
  const handleModify = (sellId) => {
    setSelectedSell(sellId);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedSell) {
      try {
        await dispatch(confirmSell(selectedSell, token));
        alert("Venta concretada con éxito ");
      } catch (err) {
        alert(
          "Error al concretar venta " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setModalOpen(false);
        setSelectedSell(null);
      }
    }
  };

  // Eliminar venta
  const handleDeleteClick = (sellId) => {
    setSellToDelete(sellId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (sellToDelete) {
      try {
        await dispatch(deleteSell(sellToDelete));
        alert("Venta eliminada con éxito ");
      } catch (err) {
        alert(
          "Error al eliminar venta" +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setDeleteModalOpen(false);
        setSellToDelete(null);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow rounded relative overflow-x-hidden text-black">
      {/* Botón volver */}
      <Link to="/" aria-label="Volver al inicio">
        <div className="absolute top-4 left-4 z-10">
          <button className="bg-purple-800 hover:bg-purple-600 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-300">
            ← Inicio
          </button>
        </div>
      </Link>

      <h2 className="text-2xl font-semibold mb-4 mt-12">Todas las Ventas</h2>

      {loading && <p>Cargando ventas...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {sells?.length > 0 ? (
        <ul className="space-y-4">
          {sells.map((sell) => (
            <li
              key={sell.id}
              className="border p-4 rounded-md shadow-sm bg-purple-50 text-black"
            >
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(sell.creationDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Estado:</span> {sell.status}
              </p>
              <p>
                <span className="font-semibold">Total:</span> ${sell.totalAmount}
              </p>

              {/* Productos */}
              <div className="mt-2">
                <span className="font-semibold">Productos:</span>
                <ul className="ml-4 list-disc">
                  {sell.Products.map((prod) => (
                    <li key={prod.id}>
                      {prod.name} - Cantidad: {prod.SellProduct.quantity} - Precio: $
                      {prod.SellProduct.price}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones */}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleModify(sell.id)}
                  className="bg-purple-800 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-md transition duration-300"
                >
                  Marcar como finalizada
                </button>
                <button
                  onClick={() => handleDeleteClick(sell.id)}
                  className="bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 rounded-md transition duration-300"
                >
                  Eliminar venta
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay ventas registradas.</p>
      )}

      {/* Modal Confirmar venta */}
      <ConfirmSellModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title="¿Concretar esta venta?"
        message="Esta acción marcará la venta como finalizada."
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

      {/* Modal Eliminar venta */}
      <ConfirmSellModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar esta venta?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmColor="bg-red-600 hover:bg-red-500"
      />
    </div>
  );
};

export default View_Sells;
