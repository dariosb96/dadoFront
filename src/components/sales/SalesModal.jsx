import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { getUserSells } from "../../Redux/actions/Sells/getUserSells";

export default function VentasModal({ view, onClose }) {
  const dispatch = useDispatch();
  const { sells, loading, error } = useSelector((state) => state.sells);
  const token = localStorage.getItem("token");

  // Si abres "Ver Ventas", pedimos los datos
  useEffect(() => {
    if (view === "ver") {
      dispatch(getUserSells(token));
    }
  }, [view, dispatch, token]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 p-6 relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Render dinámico */}
        {view === "ver" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">
              Lista de Ventas
            </h2>
            {loading && <p className="text-gray-600">Cargando ventas...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {sells?.length > 0 ? (
                sells.map((sell) => (
                  <li
                    key={sell.id}
                    className="border p-3 rounded-md bg-purple-50 shadow-sm"
                  >
                    <p>
                      <span className="font-semibold">ID:</span> {sell.id}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span>{" "}
                      {sell.status}
                    </p>
                    <p>
                      <span className="font-semibold">Fecha:</span>{" "}
                      {new Date(sell.creationDate).toLocaleDateString()}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No hay ventas registradas.</p>
              )}
            </ul>
          </div>
        )}

        {view === "crear" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">
              Crear Venta
            </h2>
            <p>Aquí irá el formulario de creación de venta.</p>
          </div>
        )}

        {view === "concretar" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">
              Concretar Venta
            </h2>
            <p>Aquí irá la lógica para confirmar una venta.</p>
          </div>
        )}
      </div>
    </div>
  );
}
