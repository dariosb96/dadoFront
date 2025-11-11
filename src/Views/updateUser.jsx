import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../Redux/actions/Auth/update_user";
import { Link, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);
  const userId = authUser?.id;

  const [user, setUser] = useState({
    name: "",
    businessName: "",
    email: "",
    phone : "",
    password: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); 
  const [loading, setLoading] = useState(false);


useEffect(() => {
  if (authUser) {
    setUser({
      name: authUser.name || "",
      businessName: authUser.businessName || "",
      email: authUser.email || "",
      phone: authUser.phone || "",
      password: "",
    });

    setPreview(authUser.image ? authUser.image : "/default-user.png");
  }
}, [authUser]);


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!userId) {
    alert("No se encontró el usuario. Vuelve a iniciar sesión.");
    return;
  }

  const formData = new FormData();

const fields = ["name", "businessName", "phone", "email"];
fields.forEach((field) => {
  if (user[field] !== authUser[field]) {
    formData.append(field, user[field]);
  }
});

if (user.password?.trim()) formData.append("password", user.password);

image 
  ? formData.append("image", image) 
  : !image && preview === "" && formData.append("removeImage", "true");

  try {
    setLoading(true);
    await dispatch(updateUser(userId, formData));
    alert("Usuario actualizado con éxito");
    navigate("/");
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    alert("Error actualizando usuario: " + (err.message || "Desconocido"));
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="h-screen bg-white top-10 relative">
        <Link to="/" aria-label="Volver al inicio">
          <div className="absolute top-4 left-4 z-10">
            <button className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600">
              ← Inicio
            </button>
          </div>
        </Link>

        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <h2 className="text-black text-2xl font-semibold">
              Actualizar Usuario
            </h2>

            {/* Inputs principales */}
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
              type="text"
              name="phone"
              placeholder="Telefono celular"
              value={user.phone}
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

            {/* Sección de imagen */}
            <div className="relative mt-4 flex flex-col items-center">
              {preview ? (
                <div className="relative">
                  <img 
                    src={preview}
                    alt="Imagen de usuario"
                    className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-2">
                  No hay imagen seleccionada
                </p>
              )}

              <label
                htmlFor="image"
                className="mt-3 bg-purple-800 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-gray-500 transition duration-300"
              >
                {preview ? "Reemplazar imagen" : "Agregar imagen"}
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              className="w-full bg-purple-800 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition duration-300 mt-4"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Usuario"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
