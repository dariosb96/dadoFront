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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSell, setSelectedSell] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sellToDelete, setSellToDelete] = useState(null);

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
          "Error al eliminar venta " +
            (err.response?.data?.error || err.message)
        );
      } finally {
        setDeleteModalOpen(false);
        setSellToDelete(null);
      }
    }
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

      <h2 className="text-2xl  text-white font-semibold mb-4 mt-5">Todas las Ventas</h2>

      {/* Estado de carga o error */}
      {loading && <p>Cargando ventas...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Listado de ventas */}
      {!loading && sells && sells.length > 0 ? (
        <ul className="space-y-4">
          {sells.map((sell) => (
            <li
              key={sell.id}
              className="border p-4 rounded-md shadow-sm bg-purple-50 text-white"
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
<div className="mt-4">
  <h3 className="font-semibold text-lg mb-2">Productos:</h3>

  {Array.isArray(sell.products) && sell.products.length > 0 ? (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sell.products.map((prod) => {
        const mainImage =
          prod.images?.[0]?.url ||
          prod.variants?.[0]?.images?.[0]?.url ||
          "https://via.placeholder.com/150x150?text=Sin+Imagen";

        return (
          <div
            key={prod.id}
            className="bg-white border border-purple-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* Imagen principal */}
            <div className="relative w-full h-40 bg-gray-100">
              <img
                src={mainImage}
                alt={prod.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info del producto */}
            <div className="p-3 text-black">
              <p className="font-semibold text-purple-800">{prod.name}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {prod.description || "Sin descripción"}
              </p>

              <div className="mt-2 text-sm">
                <p>
                  <span className="font-medium text-black">Cantidad:</span>{" "}
                  {prod.SellProduct?.quantity ?? 0}
                </p>
                <p>
                  <span className="font-medium text-black ">Precio:</span > $
                  {prod.SellProduct?.price ?? 0}
                </p>
              </div>

              {/* Variantes */}
              {Array.isArray(prod.variants) && prod.variants.length > 0 && (
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <p className="font-medium text-gray-700 mb-1">Variantes:</p>
                  <div className="flex flex-wrap gap-3">
                    {prod.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="bg-purple-50 border border-purple-200 rounded-xl p-2 flex flex-col items-center w-[100px]"
                      >
                        <span className="text-xs capitalize text-gray-800">
                          {variant.color || "Sin color"}
                        </span>
                        {variant.size && (
                          <span className="text-xs text-gray-500">
                            {variant.size}
                          </span>
                        )}
                        {/* Miniaturas de imágenes */}
                        {variant.images?.length > 0 ? (
                          <div className="flex gap-1 mt-1">
                            {variant.images.slice(0, 2).map((img) => (
                              <img
                                key={img.id}
                                src={img.url}
                                alt="Variante"
                                className="w-8 h-8 object-cover rounded-md border"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-md mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="ml-4 text-gray-500 italic">Sin productos asociados</p>
  )}
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
        !loading && <p>No hay ventas registradas.</p>
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
