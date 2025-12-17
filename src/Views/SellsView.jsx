
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSells } from "../Redux/actions/Sells/getUserSells";
import ConfirmSellModal from "../components/sales/confirmModal";
import SellDetailModal from "../components/sales/SellDetail";
import { confirmSell } from "../Redux/actions/Sells/confirmSell";
import { deleteSell } from "../Redux/actions/Sells/deleteSell";

const View_Sells = () => {
  const dispatch = useDispatch();
  const { sells, loading, error } = useSelector((state) => state.sells);
  const token = localStorage.getItem("token");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSell, setSelectedSell] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sellToDelete, setSellToDelete] = useState(null);

  // Estado para detalles
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [sellDetails, setSellDetails] = useState(null);

  useEffect(() => {
    dispatch(getUserSells(token));
  }, [dispatch, token]);

  const handleModify = (sellId) => {
    setSelectedSell(sellId);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedSell) {
      try {
        await dispatch(confirmSell(selectedSell, token));
        dispatch(getUserSells(token));
        alert("Venta concretada con éxito");
      } catch (err) {
        alert(
          "Error al concretar venta " +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setModalOpen(false);
        setSelectedSell(null);
      }
    }
  };

  const handleDeleteClick = (sellId) => {
    setSellToDelete(sellId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (sellToDelete) {
      try {
        await dispatch(deleteSell(sellToDelete));
        dispatch(getUserSells(token));
        alert("Venta eliminada con éxito");
      } catch (err) {
        alert(
          "Error al eliminar venta " +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setDeleteModalOpen(false);
        setSellToDelete(null);
      }
    }
  };

  const handleViewDetails = (sell) => {
    setSellDetails(sell);
    setDetailsModalOpen(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-black bg-opacity-75 shadow rounded text-white">
      {/* Botones de navegación */}
      <div className="grid grid-cols-2 mb-4">
        <div className="justify-self-start">
          <Link to="/" aria-label="Volver al inicio">
            <button
              type="button"
              className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
            >
              ← Inicio
            </button>
          </Link>
        </div>

        <div className="justify-self-end">
          <Link to="/createSell" aria-label="Crear venta">
            <button
              type="button"
              className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
            >
              + Crear venta
            </button>
          </Link>
        </div>
      </div>

      <h2 className="text-xl text-white font-semibold mb-4 mt-5">Todas las Ventas</h2>

      {/* Estado de carga o error */}
      {loading && <p>Cargando ventas...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Listado de ventas */}
      {!loading && sells && sells.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sells.map((sell) => (
            <li
              key={sell.id}
              className="border p-2 rounded-lg shadow bg-purple-100 text-black text-sm"
            >
              <p><span className="font-semibold">Fecha:</span> {new Date(sell.creationDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Estado:</span> {sell.status}</p>
              <p><span className="font-semibold">Total:</span> ${sell.totalAmount}</p>

              {/* Mini imágenes de productos */}
              <div className="flex gap-2 mt-2">
                {sell.products.map((prod) => {
                  const img = prod.images?.[0]?.url || "https://via.placeholder.com/50";
                  return (
                    <img
                      key={prod.id}
                      src={img}
                      alt={prod.name}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  );
                })}
              </div>

              {/* Botones */}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDetails(sell)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1 rounded-md text-xs transition duration-300"
                >
                  Ver detalles
                </button>

                {sell.status === "pendiente" && (
                  <button
                    onClick={() => handleModify(sell.id)}
                    className="bg-purple-800 hover:bg-purple-600 text-white font-medium px-3 py-1 rounded-md text-xs transition duration-300"
                  >
                    Finalizar
                  </button>
                )}

                <button
                  onClick={() => handleDeleteClick(sell.id)}
                  className="bg-red-600 hover:bg-red-500 text-white font-medium px-3 py-1 rounded-md text-xs transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No hay ventas registradas.</p>
      )}

      {/* Modales existentes */}
      <ConfirmSellModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title="¿Concretar esta venta?"
        message="Esta acción marcará la venta como finalizada."
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

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

      {/* Modal de detalles */}
      <SellDetailModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        sell={sellDetails}
      />
    </div>
  );
};

export default View_Sells;
