import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../Redux/actions/Products/get_categories";
import { exportCatalogPDF } from "../Redux/actions/Products/export_pdf";

const MyCatalogLink = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { categories } = useSelector((state) => state.categories || {});

  const [tab, setTab] = React.useState("link");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [showBusinessOnLink, setShowBusinessOnLink] = React.useState(false);
  const [showPhoneOnLink, setShowPhoneOnLink] = React.useState(false);
  const [includeBusinessName, setIncludeBusinessName] = React.useState(true);
  const [includeOwnerName, setIncludeOwnerName] = React.useState(true);
  const [includePhone, setIncludePhone] = React.useState(true);

  useEffect(() => {
    if (user?.id) dispatch(getCategories(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) {
    return <div className="p-6 text-center text-gray-400">Cargando datos...</div>;
  }

  const baseUrl = `${window.location.origin}/catalog/${user.id}`;
  const linkParams = new URLSearchParams();
  if (selectedCategory) linkParams.append("category", selectedCategory);
  if (showBusinessOnLink) linkParams.append("showBusiness", "1");
  if (showPhoneOnLink) linkParams.append("showPhone", "1");
  const catalogUrl = linkParams.toString() ? `${baseUrl}?${linkParams.toString()}` : baseUrl;

  const handleDownloadPDF = () => {
    dispatch(
      exportCatalogPDF(user.id, {
        includeBusinessName,
        includeOwnerName,
        includePhone,
        selectedCategories: selectedCategory ? [selectedCategory] : [],
      })
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
         <div
        /* Contenedor del modal: force LTR y anula transform */
        dir="ltr"
        className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800 overflow-hidden max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ transform: "none" }} // anula transform de animaciones
      >
        {/* BOTÓN CERRAR: absolute + estilo inline que fuerza right y deja left 'auto' */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="absolute top-3 z-50 flex items-center justify-center w-7 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Cerrar"
          style={{ right: "0.75rem", left: "auto" }} // <- fuerza a la derecha
        > 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
            <path fill="currentColor" d="M6.225 4.811a1 1 0 10-1.414 1.414L10.586 12l-5.775 5.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.811z"/>
          </svg>
        </button>


        <div className="p-6 border-b border-gray-800 text-center">
          <h3 className="text-white text-xl font-semibold tracking-wide">Tu catálogo público</h3>
        </div>

        <div className="flex gap-2 px-4 pt-4">
          <button
            type="button"
            onClick={() => setTab("link")}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              tab === "link" ? "bg-purple-700 text-white shadow" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
          >
            Enlace público
          </button>
          <button
            type="button"
            onClick={() => setTab("pdf")}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              tab === "pdf" ? "bg-purple-700 text-white shadow" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
          >
            Descargar PDF
          </button>
        </div>

        <div className="px-6 py-6 overflow-auto max-h-[calc(85vh-140px)] space-y-6">
          <div>
            <label className="block text-sm text-gray-400 pb-2">Filtrar por categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-900 text-white border border-purple-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Catálogo general</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {tab === "link" && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    checked={showBusinessOnLink}
                    onChange={() => setShowBusinessOnLink(!showBusinessOnLink)}
                    className="w-4 h-4"
                  />
                  Mostrar nombre del negocio
                </label>
                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    checked={showPhoneOnLink}
                    onChange={() => setShowPhoneOnLink(!showPhoneOnLink)}
                    className="w-4 h-4"
                  />
                  Mostrar teléfono
                </label>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Enlace público:</p>
                <a
                  href={catalogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-400 underline break-words hover:text-blue-300"
                >
                  {catalogUrl}
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(catalogUrl)}
                  className="mt-3 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 shadow"
                >
                  Copiar enlace
                </button>
              </div>

              <div className="bg-white p-4 rounded-lg text-center w-fit mx-auto shadow">
                <QRCodeCanvas value={catalogUrl} size={160} />
                <p className="text-sm text-gray-700 mt-2">Escanea para abrir el catálogo</p>
              </div>
            </div>
          )}

          {tab === "pdf" && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeBusinessName}
                    onChange={() => setIncludeBusinessName(!includeBusinessName)}
                    className="w-4 h-4"
                  />
                  Incluir nombre del negocio
                </label>
                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    checked={includeOwnerName}
                    onChange={() => setIncludeOwnerName(!includeOwnerName)}
                    className="w-4 h-4"
                  />
                  Incluir nombre del propietario
                </label>
                <label className="flex items-center gap-3 text-gray-300">
                  <input
                    type="checkbox"
                    checked={includePhone}
                    onChange={() => setIncludePhone(!includePhone)}
                    className="w-4 h-4"
                  />
                  Incluir teléfono
                </label>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full bg-purple-700 text-white px-5 py-3 rounded-xl hover:bg-purple-600 shadow-lg text-lg font-medium transition-all"
              >
                Descargar PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCatalogLink;
