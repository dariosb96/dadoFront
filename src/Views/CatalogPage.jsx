import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCatalogByUser } from "../Redux/actions/Products/catalog_actions";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/logo-black.png";

// Normalizar imágenes
const normalizeImages = (images) => {
  if (!images) return [];
  if (!Array.isArray(images)) return [];
  return images
    .map((it) => {
      if (!it) return null;
      if (typeof it === "string") return { url: it };
      if (typeof it === "object") {
        return { url: it.url || it.path || it.secure_url || it.src || it.image || null };
      }
      return null;
    })
    .filter((i) => i && !!i.url);
};

// Carrusel de imágenes
const ImageCarousel = ({ images = [], fixedHeight = 200, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgs = normalizeImages(images);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!imgs.length) {
    return (
      <div
        className="w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ height: fixedHeight }}
      >
        <span className="text-gray-500">Sin imagen</span>
      </div>
    );
  }

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          height: fixedHeight,
          width: "100%",
          position: "relative",
        }}
      >
        <img
          src={imgs[currentIndex].url}
          alt={`imagen-${currentIndex}`}
          onClick={() => onImageClick?.(imgs[currentIndex].url)}
          className="transition-all duration-300 cursor-pointer"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {imgs.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
            onClick={prevImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded transition"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs text-white px-2 py-0.5 rounded bg-black/40">
            {currentIndex + 1} / {imgs.length}
          </span>

          <button
            onClick={nextImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// Tarjeta de producto
const CatalogProductCard = ({ product, openModal }) => {
  const [showVariant, setShowVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const productImages = normalizeImages(product?.images);
  const variants = Array.isArray(product?.variants) ? product.variants : [];

  const handleVariantClick = (variant) => {
    const vImages = normalizeImages(variant?.images);
    const finalImages = vImages.length ? vImages : productImages;
    setSelectedVariant({ ...variant, _images: finalImages });
    setShowVariant(true);
  };

  const handleBack = () => {
    setSelectedVariant(null);
    setShowVariant(false);
  };

  const active = showVariant ? selectedVariant : product;

  return (
    <div className="border p-4 rounded-xl shadow bg-black bg-opacity-75 hover:shadow-lg transition-all text-black flex flex-col gap-3 border-purple-800">
      
      <h2 className="text-lg font-bold text-purple-400 break-words">
        {active?.name}
      </h2>
      <p className="text-gray-200 font-semibold">${active?.price}</p>
      <p className="text-sm text-gray-500">
        Piezas disponibles: {active?.stock}
      </p>

      {/* Carrusel */}
      <ImageCarousel
        images={active?._images ?? productImages}
        fixedHeight={180}
        onImageClick={(url) => openModal(url)}
      />

      {/* Variantes */}
      {!showVariant ? (
        variants.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm text-gray-400 mb-2">Variantes:</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantClick(variant)}
                  className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm font-medium hover:bg-purple-200 transition"
                >
                  {variant.color || variant.size || "Variante"}
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        <button
          onClick={handleBack}
          className="bg-purple-700 mt-3 text-sm text-white hover:underline"
        >
          ← Volver al producto
        </button>
      )}
    </div>
  );
};

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const showBusiness = searchParams.get("showBusiness") === "1";
  const showPhone = searchParams.get("showPhone") === "1";

  const { catalog, loading, error, businessName, phone } = useSelector(
    (state) => state.catalog
  );

  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (userId) dispatch(fetchCatalogByUser(userId, category));
  }, [dispatch, userId, category]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (loading)
    return <p className="p-4 text-center text-gray-600">Cargando catálogo...</p>;
  if (error)
    return <p className="p-4 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen text-black">
      
      {/* Logo */}
      <div className="w-full bg-white bg-opacity-50 rounded-full flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-10 h-auto object-contain p-1" />
      </div>

      {/* Mostrar nombre de negocio */}
      {showBusiness && (
        <h1 className="text-white text-3xl font-bold italic text-center mt-2 mb-2 drop-shadow-md">
          {businessName || "Catálogo"}
        </h1>
      )}

      {/* Mostrar número de teléfono */}
      {showPhone && phone && (
        <p className="text-center text-gray-300 text-lg mb-4">
          📞 {phone}
        </p>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 rounded-xl shadow-lg">
        {catalog?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {catalog.map((product) => (
              <CatalogProductCard
                key={product.id}
                product={product}
                openModal={(url) => setModalImage(url)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay productos.</p>
        )}
      </div>

      {/* Modal de imagen */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-10 right-0 text-white text-xl font-bold"
            >
              ✕
            </button>

            <img
              src={modalImage}
              alt="Vista ampliada"
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
