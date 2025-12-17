import React from "react";

const SellDetailModal = ({ isOpen, onClose, sell }) => {
  if (!isOpen || !sell) return null;

  // Calcular ganancia final
  const totalCompra = sell.products.reduce(
    (acc, prod) => acc + prod.buyPrice * prod.SellProduct.quantity,
    0
  );
  const totalVenta = parseFloat(sell.totalAmount);
  const ganancia = totalVenta - totalCompra;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-lg">
         <div className="mt-1 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-blue-500 text-white px-4 py-1 rounded-md"
          >
            Cerrar
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-purple-500">Detalles de la Venta</h2>

        <p><span className="font-semibold">Fecha:</span> {new Date(sell.creationDate).toLocaleDateString()}</p>
        <p><span className="font-semibold">Hora:</span> {new Date(sell.creationDate).toLocaleTimeString()}</p>
        <p><span className="font-semibold">Estado:</span> {sell.status}</p>
        <p><span className="font-semibold">Total:</span> ${sell.totalAmount}</p>

        {/* Productos vendidos */}
        <h3 className="mt-4 font-semibold">Artículos vendidos:</h3>
        <ul className="space-y-3 mt-2">
          {sell.products.map((prod) => (
            <li key={prod.id} className="flex items-center gap-3 border-b pb-2 text-purple-600">
              <img
                src={prod.images?.[0]?.url || "https://via.placeholder.com/50"}
                alt={prod.name}
                className="w-12 h-12 object-cover rounded-md border"
              />
              <div>
                <p className="font-medium">{prod.name}</p>
                <p className="text-sm text-gray-400">Cantidad: {prod.SellProduct.quantity}</p>
                <p className="text-sm text-gray-400">Costo compra: ${prod.buyPrice}</p>
                <p className="text-sm text-gray-400">Precio venta: ${prod.SellProduct.price}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Ganancia final */}
        <div className="mt-4 border-t pt-2">
          <p><span className="font-semibold">Costo total de compra:</span> ${totalCompra}</p>
          <p><span className="font-semibold">Costo total de venta:</span> ${totalVenta}</p>
          <p><span className="font-semibold">Ganancia final:</span> ${ganancia}</p>
        </div>

        {/* Botón cerrar */}
       
      </div>
    </div>
  );
};

export default SellDetailModal;
