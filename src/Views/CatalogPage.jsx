import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCatalogByUser } from "../Redux/actions/Products/catalog_actions";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/logo-black.png";

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

const ImageCarousel = ({ images = [], fixedHeight = 200 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgs = normalizeImages(images);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!imgs.length) {
    return (
      <div
        className="w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ height: fixedHeight, minHeight: fixedHeight, maxHeight: fixedHeight }}
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
        className="w-full rounded-lg overflow-hidden flex items-center justify-center "
        style={{
          height: fixedHeight,
          minHeight: fixedHeight,
          maxHeight: fixedHeight,
          width: "100%",
          position: "relative",
        }}
      >
        <img
          src={imgs[currentIndex].url}
          alt={`imagen-${currentIndex}`}
          className="transition-all duration-300"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {imgs.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
          type="button"
            onClick={prevImage}
            className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-white px-2 py-0.5 rounded bg-black/40">
            {currentIndex + 1} / {imgs.length}
          </span>
          <button
            onClick={nextImage}
        className="bg-purple-800 hover:bg-purple-600 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const CatalogProductCard = ({ product }) => {
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
    <div className="border p-4 rounded-xl shadow bg-gray-900 hover:shadow-lg transition-all font-medium text-black flex flex-col gap-3 min-w-0">
      <h2 className="text-lg font-bold text-purple-400 break-words">
        {active?.name || product.name}
      </h2>
      <p className="text-sm text-gray-200">
        Categoría: {product.Category?.name || "Sin categoría"}
      </p>
      <p className="text-gray-200 font-semibold">Precio: ${active?.price ?? product.price}</p>
      <p className="text-sm text-gray-500">Piezas disponibles: {active?.stock ?? product.stock}</p>

      <ImageCarousel images={active?._images ?? productImages} fixedHeight={180} />

      {!showVariant ? (
        variants.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Variantes:</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id ?? variant.uid ?? Math.random()}
                  onClick={() => handleVariantClick(variant)}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition"
                >
                  {variant.color
                    ? variant.color
                    : variant.size
                    ? `T:${variant.size}`
                    : "Variante"}
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

  const { catalog, loading, error, businessName } = useSelector((state) => state.catalog);
  const [categoryName, setCategoryName] = useState("Catálogo completo");

  useEffect(() => {
    if (userId) dispatch(fetchCatalogByUser(userId, category));
  }, [dispatch, userId, category]);

  useEffect(() => {
    if (catalog?.length && category) {
      const cat = catalog.find((p) => p.Category?.id === category);
      setCategoryName(cat?.Category?.name || "Catálogo completo");
    } else {
      setCategoryName("Catálogo completo");
    }
  }, [catalog, category]);

  if (loading) return <p className="p-4 text-center text-gray-600">Cargando catálogo...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen text-black ">
      <div className="w-full bg-white bg-opacity-50 rounded-full flex justify-center items-center">
        <img src={logo} alt="Logo" className="w-10 h-auto object-contain p-1" />
      </div>

      <h1 className="text-white text-3xl font-bold italic text-center mt-2 mb-4 drop-shadow-md">
        {businessName || "Catálogo"}
      </h1>

      <div className="max-w-7xl mx-auto px-4 py-6 rounded-xl shadow-lg">
        {catalog?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {catalog.map((product) => (
              <CatalogProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay productos.</p>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
