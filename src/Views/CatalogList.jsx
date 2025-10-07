import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCatalogs } from "../Redux/actions/Products/allcatalogs_actions";
import { selectCatalogsWithCategories } from "../Redux/actions/Products/catalogSelector";
import { useNavigate } from "react-router-dom";


export default function CatalogList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const catalogs = useSelector(selectCatalogsWithCategories);
  const loading = useSelector((state) => state.catalog.loading);
  const error = useSelector((state) => state.catalog.error);

  useEffect(() => {
    dispatch(getAllCatalogs());
  }, [dispatch]);

  if (loading) return <p className="text-purple-800 text-center mt-6">Cargando catálogos...</p>;
  if (error) return <p className="text-red-600 text-center mt-6">Error: {error}</p>;
  if (!catalogs || catalogs.length === 0) return <p className="text-gray-600 text-center mt-6">No hay catálogos disponibles</p>;

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {catalogs.map((c) => (
          <div
            key={c.id}
           onClick={() => navigate(`/catalog/${c.id}`)}

            className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-bold text-purple-800 mb-3">
              Nombre: {c.businessName}
            </h2>

            <p className="text-black font-semibold mb-2">Categorías:</p>
            <ul className="flex flex-wrap gap-2">
              {c.categories.map((cat) => (
                <li
                  key={cat.category}
                  className="bg-purple-800 text-white text-sm px-3 py-1 rounded-full"
                >
                  {cat.category}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
