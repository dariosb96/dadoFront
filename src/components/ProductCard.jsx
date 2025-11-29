import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Carrusel compacto y responsivo
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-20 sm:h-24 lg:h-28 bg-gray-200 flex items-center justify-center rounded-md">
        <span className="text-gray-500 text-xs">Sin imagen</span>
      </div>
    );
  }

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-20 sm:h-24 lg:h-28 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={`imagen-${currentIndex}`}
          className="max-w-full max-h-full object-contain transition-all duration-500"
        />
      </div>

      {images.length > 1 && (
        <div className="flex justify-center items-center gap-4 mt-1">
          <button
            type="button"
            onClick={prevImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-1 rounded-md transition"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-1 rounded-md transition"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// Card responsiva
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
<div className="border p-2 sm:p-3 rounded-md shadow bg-white hover:shadow-md transition-all text-black flex flex-col gap-1 min-w-[150px] sm:min-w-[180px] lg:min-w-[220px]">
  <h2 className="text-[10px] sm:text-sm lg:text-base font-bold text-purple-800 truncate">
    {product.name}
  </h2>
  <p className="text-[8px] sm:text-xs lg:text-sm text-gray-700 truncate">
    {product.Category?.name || "Sin categoría"}
  </p>
  <p className="text-[8px] sm:text-xs lg:text-sm text-gray-700">
    Venta: ${product.price}
  </p>
  <p className="text-[8px] sm:text-xs lg:text-sm text-gray-700">
    Compra: ${product.buyPrice}
  </p>
  <p className="text-[8px] sm:text-xs lg:text-sm text-gray-700">
    Stock: {product.stock}
  </p>
      {!showVariants ? (
        <>
          <ImageCarousel images={product.images} />

          {product.variants?.length > 0 && (
            <div className="mt-1">
              <h3 className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-medium">
                Variantes:
              </h3>
              <div className="flex flex-wrap gap-1">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantClick(variant)}
                    className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-[10px] sm:text-xs lg:text-sm hover:bg-purple-300 transition"
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
          <h3 className="text-purple-700 font-semibold text-xs sm:text-sm">
            Variante: {selectedVariant?.color || "N/A"}
          </h3>
          <p className="text-[10px] sm:text-xs">Stock: {selectedVariant?.stock ?? "N/A"}</p>
          <ImageCarousel images={selectedVariant?.images} />
          <button
            onClick={handleBackToProduct}
            className="mt-1 text-[10px] sm:text-xs text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </>
      )}

      <div className="mt-2 flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-[10px] sm:text-xs lg:text-sm hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-600 text-white px-2 py-1 rounded text-[10px] sm:text-xs lg:text-sm hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
