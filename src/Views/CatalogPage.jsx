import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCatalogByUser } from "../Redux/actions/Products/catalog_actions";
import { useParams, useSearchParams } from "react-router-dom";

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const { catalog, loading, error, businessName } = useSelector(
    (state) => state.catalog
  );

  const [categoryName, setCategoryName] = useState("CATÁLOGO COMPLETO");
  const [currentIndexes, setCurrentIndexes] = useState({});

  useEffect(() => {
    if (userId) dispatch(fetchCatalogByUser(userId, category));
  }, [dispatch, userId, category]);

  useEffect(() => {
    if (catalog?.length && category) {
      const cat = catalog.find((p) => p.Category?.id === category);
      setCategoryName(cat?.Category?.name || "CATÁLOGO COMPLETO");
    } else {
      setCategoryName("CATÁLOGO COMPLETO");
    }
  }, [catalog, category]);

  const handleNext = (productId, imagesLength) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] ?? 0) + 1) % imagesLength,
    }));
  };

  const handlePrev = (productId, imagesLength) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] ?? 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  if (loading) return <p className="p-4 text-center">Cargando...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-1 text-black">
        {businessName || "Catálogo"}
      </h1>
      <h2 className="text-lg mb-4 text-gray-700">{categoryName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black">
        {catalog?.map((product) => {
          const images = product.images || [];
          const currentIndex = currentIndexes[product.id] ?? 0;

          return (
            <div
              key={product.id}
              className="border p-4 rounded shadow hover:shadow-lg transition bg-white"
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.Category?.name}</p>
              <p className="mt-2 font-bold">${product.price}</p>

              {images.length > 0 ? (
                <div className="mt-2 w-full flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={images[currentIndex].url}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="flex justify-between items-center w-full mt-2 px-4">
                      <button
                        onClick={() => handlePrev(product.id, images.length)}
                        className="text-gray-400 text-sm font-bold hover:text-gray-600 transition"
                      >
                        ‹
                      </button>
                      <span className="text-gray-500 text-xs">
                        {currentIndex + 1} / {images.length}
                      </span>
                      <button
                        onClick={() => handleNext(product.id, images.length)}
                        className="text-gray-400 text-sm font-bold hover:text-gray-600 transition"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center mt-2 rounded">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogPage;
