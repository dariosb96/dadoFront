import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../Redux/actions/Products/get_categories";

const MyCatalogLink = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { categories } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState("");

useEffect(() => {
  if (user?.id) {
    dispatch(getCategories(user.id)); 
  }
}, [dispatch, user]);

  if (!user) {
    return (
      <p className="p-6 text-center text-gray-600">
        Cargando datos de usuario...
      </p>
    );
  }

  const baseUrl = `${window.location.origin}/catalog/${user.id}`;
  const catalogUrl = selectedCategory
    ? `${baseUrl}?category=${selectedCategory}`
    : baseUrl;

  return (
    <div className="bg-gray-50 p-6">
      {/* Botón cerrar */}
      {onClose && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white font-bold w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Tu catálogo público
        </h1>

        {/* Selector de categorías */}
        <label className="mb-2 text-black">Elige qué compartir:</label>
        <select
          className="border p-2 rounded mb-4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Catálogo general</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Link dinámico */}
        <p className="mb-2 text-black">Copia y comparte este enlace:</p>
        <a
          href={catalogUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mb-4 break-all text-center"
        >
          {catalogUrl}
        </a>

        <button
          onClick={() => navigator.clipboard.writeText(catalogUrl)}
          className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-6"
        >
          Copiar enlace
        </button>

        {/* QR dinámico */}
        <div className="bg-white p-4 rounded-lg shadow">
          <QRCodeCanvas value={catalogUrl} size={200} />
        </div>

        <p className="mt-2 text-gray-800 text-sm text-center">
          Escanea el QR para abrir el catálogo
        </p>
      </div>
    </div>
  );
};

export default MyCatalogLink;
