import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyCatalogLink from "../components/MyCatalogLink";

const Home = () => {

  const user = useSelector((state) => state.auth.user);

  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    
    <div className="min-h-screen bg-gray-50 flex flex-col">
         
     <h1 className="text-black p-8">{user.businessName} </h1>
      {/* Dashboard con tres cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4 pb-8"> 
       
        <Link
          to="/products"
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition min-h-[180px]"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center text-black">PRODUCTOS</h2>
          <p className="text-purple-900 text-center text-sm md:text-base">Administra todos tus productos.</p>
        </Link>

        <Link
          to="/sells"
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition min-h-[180px]"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center text-black">VENTAS</h2>
          <p className="text-purple-900 text-center text-sm md:text-base">Visualiza y gestiona tus ventas.</p>
        </Link>

        <Link
          to="/dash"
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition min-h-[180px]"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-center text-black">ESTADÍSTICAS</h2>
          <p className="text-purple-900 text-center text-sm md:text-base">Consulta tus métricas y reportes.</p>
        </Link>
      </div>
      {/* Botón para abrir catálogo público al final */}
<div className="flex justify-center px-4 mt-8 mb-12">
  <button
    onClick={() => setCatalogOpen(true)}
    className="bg-purple-900 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-md transition text-lg"
  >
    Catálogo Público
  </button>
</div>

      {/* Overlay del catálogo sin scroll */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            {/* Encabezado con botón de cerrar */}
            <div className="flex justify-end p-4 border-b">
              <button
                onClick={() => setCatalogOpen(false)}
                className="text-white bg-red-700 hover:bg-red-500 px-3 py-1 rounded-md text-sm font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Contenido fijo sin scroll */}
            <div className="p-6">
              <MyCatalogLink />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
