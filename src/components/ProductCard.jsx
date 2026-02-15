import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🔹 Carrusel
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-900 flex items-center justify-center rounded-md">
        <span className="text-gray-500 text-xs">Sin imagen</span>
      </div>
    );
  }

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full">
      <div className="w-full h-32 bg-gray-900 rounded-md overflow-hidden">
        <img
          src={images[currentIndex].url}
          alt={`imagen-${currentIndex}`}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-3 mt-1">
          <button
            onClick={prevImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-1 rounded-md"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-1 rounded-md"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// 🔹 Card
const ProductCard = ({ product, onEdit, onDelete }) => {
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setShowVariants(true);
  };

  const handleBackToProduct = () => {
    setSelectedVariant(null);
    setShowVariants(false);
  };

  return (
    <div className="bg-gray-900 p-3 rounded-md shadow hover:shadow-md transition flex flex-col h-full min-w-[150px] sm:min-w-[180px] lg:min-w-[220px]">

      {/* 🔹 CONTENIDO FLEXIBLE */}
      <div className="flex flex-col flex-1 gap-2">

        {!showVariants ? (
          <>
            <ImageCarousel images={product.images} />

            {product.variants?.length > 0 && (
              <div>
                <h3 className="text-xs text-gray-400 mb-1">Variantes</h3>
                <div className="flex flex-wrap gap-1">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantClick(variant)}
                      className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs hover:bg-purple-300"
                    >
                      {variant.color || "Variante"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <ImageCarousel images={selectedVariant?.images} />

            <h3 className="text-sm text-white font-semibold">
              {selectedVariant?.color || "Variante"}
            </h3>

            <p className="text-xs text-gray-400">
              Stock: {selectedVariant?.stock ?? "N/A"}
            </p>

            <button
              onClick={handleBackToProduct}
              className="text-xs text-blue-400 hover:underline w-fit"
            >
              ← Volver
            </button>
          </>
        )}

        {/* 🔹 INFO PRODUCTO */}
        <h2 className="text-sm font-semibold text-white line-clamp-2">
          {product.name}
        </h2>

        <p className="text-xs text-gray-300 truncate">
          {product.Category?.name || "Sin categoría"}
        </p>

        <p className="text-xs text-gray-400">Venta: ${product.price}</p>
        <p className="text-xs text-gray-400">Compra: ${product.buyPrice}</p>
        <p className="text-xs text-gray-400">Stock: {product.stock}</p>

      </div>

      {/* 🔹 ACCIONES SIEMPRE ABAJO */}
      <div className="mt-auto pt-2 flex justify-between gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-xs"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
