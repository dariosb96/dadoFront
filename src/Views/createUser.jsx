import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../Redux/actions/Auth/create_user";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Create_user = () => {
  const [user, setUser] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // 🔹 Para mostrar la vista previa

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });
    if (image) formData.append("image", image);

    try {
      await dispatch(createUser(formData));
      alert("Usuario creado con éxito");
      setUser({
        name: "",
        businessName: "",
        email: "",
        phone: "",
        password: "",
      });
      setImage(null);
      setPreview(null);
      navigate("/");
    } catch (error) {
      console.error("Error creando usuario:", error);
      alert("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Logo arriba */}
      <div className="flex justify-center ">
        <img src={logo} alt="Logo" className="w-32 h-auto object-contain" />
      </div>

      <div className="content max-w-md mx-auto p-6 bg-black bg-opacity-50 rounded-lg shadow-md mt-4 relative">
        {/* Botón volver */}
        <Link to="/" aria-label="Volver al inicio">
          <div className="absolute top-4 left-4 z-10">
            <button
              type="button"
              className="bg-purple-800 hover:bg-gray-600 text-white font-medium px-3 py-1 rounded-md text-sm transition"
            >
              ← Inicio
            </button>
          </div>
        </Link>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <h2 className="text-white text-2xl font-semibold text-center">
            Crear Usuario
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={user.name}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-400 "
          />
          <input
            type="text"
            name="businessName"
            placeholder="Nombre de negocio"
            value={user.businessName}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={user.email}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-400"
          />
          <input
            type="text"
            name="phone"
            placeholder="Celular"
            value={user.phone}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={user.password}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-400"
          />

          {/* Subir imagen */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Imagen de perfil (opcional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-purple-600 rounded-lg p-2"
            />

            {/* Vista previa */}
            {preview && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-800 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Crear usuario
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create_user;
