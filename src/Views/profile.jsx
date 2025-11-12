import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <p>Cargando usuario...</p>;

  // Formatear fecha a formato legible
  const joinedDate = new Date(user.createdAt).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
     <div className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-black bg-opacity-75 shadow rounded text-black">
    <div className="flex justify-between items-center mb-4">
      <Link to="/" aria-label="Volver al inicio">
        <button
          type="button"
          className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
        >
          ← Inicio
        </button>
      </Link>
    </div>
      <div className="bg-black p-8 rounded-xl shadow-lg w-full max-w-sm text-left">
        {/* Imagen */}
        <div className="flex justify-center mb-6">
          <img
            src={user.image || "/default-user.png"}
            alt="Perfil"
            className="w-32 h-32 rounded-full object-cover border-2 border-purple-800"
          />
        </div>

        {/* Datos */}
        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">Nombre:</span> {user.name}
        </p>
        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">Negocio:</span> {user.businessName}
        </p>
        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">Correo:</span> {user.email}
        </p>
        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">Telefono:</span> {user.phone}
        </p>
        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">Rol:</span> {user.role}
        </p>
        <p className="text-gray-400 mb-4">
          <span className="font-semibold text-white">Miembro desde:</span> {joinedDate}
        </p>

        {/* Botón editar */}
        <div className="text-center">
          <Link to="/p">
            <button className="mt-2 bg-purple-800 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md transition duration-300">
              Editar Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
