
//FALTA EL BUG DE LA IMAGEN!!!!!!!!!

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser } from "../Redux/actions/Auth/create_user";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Store,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ImagePlus,
} from "lucide-react";
import logo from "../assets/logo.png";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    Object.keys(user).forEach((key) => formData.append(key, user[key]));

    try {
      await dispatch(createUser(formData));
      navigate("/");
    } catch {
      setError("Error al crear la cuenta. Intente nuevamente.");
    }
  };

  const inputStyle =
    "flex-1 h-8 bg-gray-900 rounded-xl px-6 text-sm text-gray-500 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 ";

  const iconStyle = "w-5 h-5 text-gray-400";

  return (
<div className="bg-black flex justify-center px-4 pt-6 pb-6">

      {/* CARD */}
      <div
        className="w-full max-w-md sm:max-w-xl lg:max-w-4xl
        bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl
        px-6 lg:px-10 py-2 lg:py-8"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>

          <img src={logo} alt="logo" className="w-6 md:w-7 lg:w-8" />
        </div>

        {/* TITLE */}
        <h1 className="text-xl md:text-3xl font-semibold text-white text-center lg:text-left mb-8">
          Crear cuenta
        </h1>

        {error && (
          <p className="text-red-500 text-center lg:text-left mb-6">{error}</p>
        )}

        <div className="grid lg:grid-cols-2 gap-6 items-center">

          {/* AVATAR */}
          <div className="flex flex-col items-center lg:items-start">

            <label className="cursor-pointer text-center lg:text-left">

              <div className="w-28 h-28 lg:w-40 lg:h-40 rounded-full bg-gray-900 border border-gray-700 overflow-hidden flex items-center justify-center">

                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="text-gray-500" size={36} />
                )}

              </div>

              <p className="text-gray-400 text-sm mt-2">
                Agregar imagen
              </p>

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid gap-4">

            <div className="flex items-center gap-1">
              <User className={iconStyle} />
              <input name="name" placeholder="Nombre" value={user.name} onChange={handleChange} className={inputStyle} required />
            </div>

            <div className="flex items-center gap-1">
              <Store className={iconStyle} />
              <input name="businessName" placeholder="Negocio" value={user.businessName} onChange={handleChange} className={inputStyle} required />
            </div>

            <div className="flex items-center gap-1">
              <Mail className={iconStyle} />
              <input type="email" name="email" placeholder="Correo electrónico" value={user.email} onChange={handleChange} className={inputStyle} required />
            </div>

            <div className="flex items-center gap-1">
              <Phone className={iconStyle} />
              <input name="phone" placeholder="Celular" value={user.phone} onChange={handleChange} className={inputStyle} required />
            </div>

            <div className="flex items-center gap-1">
              <Lock className={iconStyle} />
              <input type="password" name="password" placeholder="Contraseña" value={user.password} onChange={handleChange} className={inputStyle} required />
            </div>

         

          </form> 
          
            
        </div> 
        <button
              type="submit"
              className="w-full h-11 bg-purple-700 hover:bg-purple-800 rounded-xl text-sm font-medium transition mt-6"
            >
              Crear cuenta
            </button>
      </div>
    </div>
  );
};

export default CreateUser;

//FALTA EL BUG DE LA IMAGEN!!!!!!!!!