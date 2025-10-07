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

  useEffect(() => {
    if (userId) {
      dispatch(fetchCatalogByUser(userId, category));
    }
  }, [dispatch, userId, category]);

  useEffect(() => {
    if (catalog?.length && category) {
      
      const cat = catalog.find((p) => p.Category?.id === category);
      setCategoryName(cat?.Category?.name || "CATÁLOGO COMPLETO");
    } else {
      setCategoryName("CATÁLOGO COMPLETO");
    }
  }, [catalog, category]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-1 text-black">
        {businessName ? businessName : "Catálogo"}
      </h1>
      <h2 className="text-lg mb-4 text-gray-700">  {categoryName} </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black">
        {catalog?.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.Category?.name}</p>
            <p className="mt-2 font-bold">${product.price}</p>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPage;
