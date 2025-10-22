import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../Redux/actions/Auth/create_user";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png' ; 

const Create_user = () => {
  const [user, setUser] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null); // Imagen opcional
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear FormData para enviar usuario + imagen
    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });
    if (image) formData.append("image", image);

    dispatch(createUser(formData));

    alert("Usuario creado con éxito");
    setUser({
      name: "",
      businessName: "",
      email: "",
      password: "",
    });
    setImage(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
    {/* Logo arriba */}
    <div className="flex justify-center mt-6">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-auto object-contain"
      />
    </div>
   <div className="content max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    
      <div className="bg-white top-10 relative">
        <Link to="/" aria-label="Volver al inicio">
          <div className="absolute top-4 left-4 z-10">
            <button
              type="button"
              className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
            >
              ← Inicio
            </button>
          </div>
        </Link>

        {/* Contenedor del formulario */}
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <h2 className="text-black text-2xl font-semibold">
              Crear Usuario
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-700 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <input
              type="text"
              name="businessName"
              placeholder="Nombre de Negocio"
              value={user.businessName}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-700  focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-700  focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={user.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-700 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            {/* Input de imagen */}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2 bg-white"
            />

            <button
              type="submit"
              className="w-full bg-purple-800 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Crear usuario
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Create_user;