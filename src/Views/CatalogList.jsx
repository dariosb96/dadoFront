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
      
    <div className="text-black  bg-opacity-75 py-2 px-6 text-white rounded-xl">
     
      <span className="text-2xl font-semibold "> Catálogos públicos</span>
      <div className="max-w-4xl mx-auto grid gap-3 md:grid-cols-3 lg:grid-cols-4 py-2 pt-5 sm:grid-cols-2">
        {catalogs.map((c) => (
          <div
            key={c.id}
           onClick={() => navigate(`/catalog/${c.id}`)}

            className="bg-gray-900 shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold text-gray-200 mb-3">
               {c.businessName}
            </h2>

            <ul className="flex flex-wrap gap-1">
              {c.categories.map((cat) => (
                <li
                  key={cat.category}
                  className="text-purple-500 text-sm px-2 py-1 rounded-full"
                >
                 -{cat.category}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

  );
}
