import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCatalogByUser } from "../Redux/actions/Products/catalog_actions";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/logo-black.png";

/* ---------------- NORMALIZE IMAGES ---------------- */
const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((it) => {
      if (typeof it === "string") return { url: it };
      if (typeof it === "object")
        return { url: it.url || it.secure_url || it.src || null };
      return null;
    })
    .filter((i) => i?.url);
};

/* ---------------- IMAGE CAROUSEL ---------------- */
const ImageCarousel = ({ images = [], fixedHeight = 200, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgs = normalizeImages(images);

  useEffect(() => setCurrentIndex(0), [images]);

  if (!imgs.length) {
    return (
      <div
        className="bg-gray-100 flex items-center justify-center rounded-xl"
        style={{ height: fixedHeight }}
      >
        <span className="text-gray-400 text-sm">Sin imagen</span>
      </div>
    );
  }

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? imgs.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === imgs.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      <div
        className="relative rounded-xl overflow-hidden bg-gray-900"
        style={{ height: fixedHeight }}
      >
        <img
          src={imgs[currentIndex].url}
          alt=""
          onClick={() => onImageClick?.(imgs[currentIndex].url)}
          className="w-full h-full object-contain cursor-pointer"
        />
      </div>

      {imgs.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-2">
          <button
            onClick={prev}
            className="p-1 rounded-full bg-gray-900 hover:bg-gray-300 transition"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs text-gray-300">
            {currentIndex + 1}/{imgs.length}
          </span>

          <button
            onClick={next}
            className="p-1 rounded-full bg-gray-900 hover:bg-gray-300 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- PRODUCT CARD ---------------- */
const CatalogProductCard = ({ product, openModal }) => {
  const [showVariant, setShowVariant] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const productImages = normalizeImages(product?.images);
  const variants = product?.variants || [];

  const active = showVariant ? selectedVariant : product;

  const handleVariantClick = (variant) => {
    const vImages = normalizeImages(variant?.images);
    setSelectedVariant({
      ...variant,
      _images: vImages.length ? vImages : productImages,
    });
    setShowVariant(true);
  };

  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-2xl shadow-sm hover:shadow-lg transition p-3 flex flex-col justify-between">
      
      <ImageCarousel
        images={active?._images ?? productImages}
        fixedHeight={160}
        onImageClick={openModal}
      />

      <div className="mt-3 space-y-1">
        <h2 className="font-sants text-gray-300 text-sm line-clamp-2">
          {active?.name}
        </h2>

        <p className="text-lg font-sants text-indigo-400">
          ${active?.price}
        </p>

        <p className="text-xs text-gray-400">
          Stock: {active?.stock}
        </p>
      </div>

      {!showVariant && variants.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVariantClick(v)}
              className="text-xs px-2 py-1 border rounded-full hover:bg-indigo-50"
            >
              {v.color || v.size || "Variante"}
            </button>
          ))}
        </div>
      )}

      {showVariant && (
        <button
          onClick={() => setShowVariant(false)}
          className="text-xs text-indigo-600 mt-2"
        >
          ← Volver
        </button>
      )}
    </div>
  );
};

/* ---------------- PAGE ---------------- */
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
  }, [userId, category]);

  if (loading)
    return <p className="text-center mt-10">Cargando catálogo...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      <div className="flex bg-white flex-col items-center py-1 gap-2 bg-opacity-25">
        <img src={logo} className="w-12" />

        {showBusiness && (
          <h1 className="text-2xl font-bold text-gray-800">
            {businessName}
          </h1>
        )}

        {showPhone && phone && (
          <p className="text-gray-500">{phone}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-3 pb-10">

        <div
          className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-3
        "
        >
          {catalog?.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              openModal={(url) => setModalImage(url)}
            />
          ))}
        </div>
      </div>

      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
        >
          <img
            src={modalImage}
            className="max-h-[90vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
