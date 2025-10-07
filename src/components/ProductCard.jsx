import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded  shadow  bg-white font-bold hover:shadow-lg transition text-shadow-white">
      <h2 className="text-lg text-purple-800 font-bold"> Nombre: {product.name}</h2>
      <p className="text-sm text-black font-semibold">Categoria: {product.Category?.name}</p>
      <p className="mt-2 font-semibold"> Precio de venta: ${product.price}</p>
      <p className="mt-2 font-semibold"> Precio de compra: ${product.buyPrice}</p>
      <p className="mt-2 font-semibold"> Piezas disponibles: ${product.stock}</p>
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover mt-2 rounded"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center mt-2 rounded">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}

      {/* Botones */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Modificar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
