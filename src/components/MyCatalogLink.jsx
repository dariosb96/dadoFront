// import React, { useState, useEffect } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import { useSelector, useDispatch } from "react-redux";
// import { getCategories } from "../Redux/actions/Products/get_categories";

// const MyCatalogLink = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const { categories } = useSelector((state) => state.categories);

//   const [selectedCategory, setSelectedCategory] = useState("");

// useEffect(() => {
//   if (user?.id) {
//     dispatch(getCategories(user.id)); 
//   }
// }, [dispatch, user]);

//   if (!user) {
//     return (
//       <p className="p-6 text-center text-gray-600">
//         Cargando datos de usuario...
//       </p>
//     );
//   }

//   const baseUrl = `${window.location.origin}/catalog/${user.id}`;
//   const catalogUrl = selectedCategory
//     ? `${baseUrl}?category=${selectedCategory}`
//     : baseUrl;

//   return (
//     <div className="bg-black bg-opacity-50 p-6 ">
//       {/* Botón cerrar */}
//       {onClose && (
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={onClose}
//             className="bg-gray-800 text-white font-bold w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-gray-700 transition"
//           >
//             ✕
//           </button>
//         </div>
//       )}

//       <div className="flex flex-col items-center">
//         <h1 className="text-2xl font-semibold mb-4 text-white">
//           Tu catálogo público
//         </h1>

//         {/* Selector de categorías */}
//         <label className="mb-2 text-white ">Elige qué compartir:</label>
//         <select
//           className="border p-2 rounded mb-4 border-purple-600"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="">Catálogo general</option>
//           {categories?.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         {/* Link dinámico */}
//         <p className="mb-2 text-gray-600 ">Copia y comparte este enlace:</p>
//         <a
//           href={catalogUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 underline mb-4 break-all text-center"
//         >
//           {catalogUrl}
//         </a>

//         <button
//           onClick={() => navigator.clipboard.writeText(catalogUrl)}
//           className="bg-purple-800 text-white px-4 py-2 full-rounded hover:bg-purple-700 transition mb-6"
//         >
//           Copiar enlace
//         </button>

//         {/* QR dinámico */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <QRCodeCanvas value={catalogUrl} size={200} />
//         </div>

//         <p className="mt-2 text-gray-800 text-sm text-center">
//           Escanea el QR para abrir el catálogo
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MyCatalogLink;


import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../Redux/actions/Products/get_categories";

const MyCatalogLink = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { categories } = useSelector((state) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [showBusinessName, setShowBusinessName] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

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

  const params = new URLSearchParams();
  if (selectedCategory) params.append("category", selectedCategory);
  if (showBusinessName) params.append("showBusiness", "1");
  if (showPhone) params.append("showPhone", "1");

  const catalogUrl = params.toString()
    ? `${baseUrl}?${params.toString()}`
    : baseUrl;

  return (
    <div className="bg-black bg-opacity-50 p-6 ">
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
        <h1 className="text-2xl font-semibold mb-4 text-white">
          Tu catálogo público
        </h1>

        {/* Selector de categorías */}
        <label className="mb-2 text-white">Elige qué compartir:</label>

        <select
          className="border p-2 rounded mb-4 border-purple-600"
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

        {/* Mostrar nombre de negocio */}
        <div className="flex items-center gap-2 text-white mb-2">
          <input
            type="checkbox"
            checked={showBusinessName}
            onChange={() => setShowBusinessName(!showBusinessName)}
          />
          <label>Mostrar nombre del negocio</label>
        </div>

        {/* Mostrar teléfono */}
        <div className="flex items-center gap-2 text-white mb-4">
          <input
            type="checkbox"
            checked={showPhone}
            onChange={() => setShowPhone(!showPhone)}
          />
          <label>Mostrar número de teléfono</label>
        </div>

        {/* Link dinámico */}
        <p className="mb-2 text-gray-600">Copia y comparte este enlace:</p>

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
