import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🔹 Carrusel con flechas debajo
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-56 bg-gray-200 flex flex-col items-center justify-center rounded-lg">
        <span className="text-gray-500">Sin imagen</span>
      </div>
    );
  }

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full flex flex-col items-center">
      {/* Imagen */}
      <div className="w-full h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={`imagen-${currentIndex}`}
          className="max-w-full max-h-full object-contain transition-all duration-500"
          style={{ width: "auto", height: "100%", display: "block" }}
        />
      </div>

      {/* 🔹 Flechas debajo de la imagen */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-6 mt-2">
          <button
            type="button"
            onClick={prevImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

// 🔹 Card del producto
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
    <div className="border p-4 rounded-xl shadow bg-white hover:shadow-lg transition-all font-semibold text-black flex flex-col gap-3 min-w-0">
      <h2 className="text-lg font-bold text-purple-800">{product.name}</h2>
      <p className="text-sm text-gray-700">
        Categoría: {product.Category?.name || "Sin categoría"}
      </p>
      <p>Precio de venta: ${product.price}</p>
      <p>Precio de compra: ${product.buyPrice}</p>
      <p>Piezas disponibles: {product.stock}</p>

      {!showVariants ? (
        <>
          <ImageCarousel images={product.images} />

          {product.variants?.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm text-gray-600 font-medium mb-1">
                Variantes disponibles:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantClick(variant)}
                    className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-300 transition"
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
          <h3 className="text-purple-700 font-semibold text-md">
            Variante: {selectedVariant?.color || "N/A"}
          </h3>
          <p>Stock: {selectedVariant?.stock ?? "N/A"}</p>
          <ImageCarousel images={selectedVariant?.images} />
          <button
            onClick={handleBackToProduct}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            ← Volver al producto
          </button>
        </>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Modificar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
