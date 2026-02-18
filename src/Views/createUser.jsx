import React, { useState, useRef } from "react";
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
  X,
} from "lucide-react";
import logo from "../assets/logo.png";

const CreateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setImageFile(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await dispatch(createUser(formData));
      navigate("/");
    } catch {
      setError("Error al crear la cuenta. Intente nuevamente.");
    }
  };

  const inputStyle =
    "flex-1 h-9 bg-gray-900 rounded-xl px-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600";

  const iconStyle = "w-5 h-5 text-gray-400";

  return (
    <div className="bg-black min-h-screen flex justify-center px-4 py-8">
      <div className="w-full max-w-md sm:max-w-xl lg:max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl px-6 lg:px-10 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>

          <img src={logo} alt="logo" className="w-6 lg:w-10" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-white text-center lg:text-left mb-6">
          Crear cuenta
        </h1>

        {error && (
          <p className="text-red-500 text-center lg:text-left mb-6">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-2 gap-10 items-start"
        >

          {/* AVATAR */}
          <div className="flex flex-col items-center lg:items-start">

           <div
  className={`relative transition-all duration-300
  ${preview
      ? "w-24 h-24 lg:w-32 lg:h-32"
      : "w-28 h-28 lg:w-40 lg:h-40"
  }`}
>


              {/* IMAGEN */}
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-full h-full rounded-full bg-gray-900 border border-gray-700 overflow-hidden cursor-pointer"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePlus className="text-gray-500" size={36} />
                  </div>
                )}
              </div>

              {/* BOTÓN X */}
              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4
                             bg-red-600 hover:bg-red-700 text-white
                             rounded-full p-1 shadow-lg z-30"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <p className="text-gray-400 text-sm mt-3 text-center lg:text-left">
              Agregar imagen
            </p>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* CAMPOS */}
          <div className="grid gap-4">

            <div className="flex items-center gap-2">
              <User className={iconStyle} />
              <input
                name="name"
                placeholder="Nombre"
                value={user.name}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Store className={iconStyle} />
              <input
                name="businessName"
                placeholder="Negocio"
                value={user.businessName}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Mail className={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={user.email}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Phone className={iconStyle} />
              <input
                name="phone"
                placeholder="Celular"
                value={user.phone}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Lock className={iconStyle} />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={user.password}
                onChange={handleChange}
                className={inputStyle}
                required
              />
            </div>

          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="lg:col-span-2 w-full h-11 bg-purple-700 hover:bg-purple-800 rounded-xl text-sm font-medium transition mt-2"
          >
            Crear cuenta
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateUser;
