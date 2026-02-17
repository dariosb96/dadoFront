import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCatalogs } from "../Redux/actions/Products/allcatalogs_actions";
import { selectCatalogsWithCategories } from "../Redux/actions/Products/catalogSelector";
import { Link, useNavigate } from "react-router-dom";



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
  if (!catalogs || catalogs.length === 0) return <p className="text-gray-400 text-3xl text-center mt-6">No hay catálogos disponibles</p>;

  return (
      
    <div className=" text-black bg-black bg-opacity-50 py-5 px-4 text-white">
     
      <span className="text-2xl font-semibold "> Catálogos públicos</span>
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3 lg:grid-cols-4 py-2 pt-5 sm:grid-cols-2">
        {catalogs.map((c) => (
          <div
            key={c.id}
           onClick={() => navigate(`/catalog/${c.id}`)}

            className="bg-gray-900 shadow-lg rounded-2xl p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <h2 className="text-l font-semibold text-gray-200 mb-3">
              Nombre: {c.businessName}
            </h2>

            <p className="text-sm text-gray-400 font-semibold mb-1">Categorías:</p>
            <ul className="flex flex-wrap gap-1">
              {c.categories.map((cat) => (
                <li
                  key={cat.category}
                  className="bg-purple-800 text-white text-sm px-2 py-1 rounded-full"
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
