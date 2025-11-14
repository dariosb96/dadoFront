import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { requestPasswordReset } from "../Redux/actions/Auth/requestPassword";
import { verifyResetToken } from "../Redux/actions/Auth/verify_resetToken";


const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);

  // Validar token al cargar la página
  useEffect(() => {
    const checkToken = async () => {
      const valid = await dispatch(verifyResetToken(token));
      if (!valid) {
        toast.error("Enlace no válido o expirado");
        navigate("/login");
      } else {
        setLoading(false);
      }
    };
    checkToken();
  }, [token, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    if (newPassword !== confirm) {
      return toast.error("Las contraseñas no coinciden");
    }

    dispatch(requestPasswordReset(token, newPassword));
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Verificando enlace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nueva contraseña */}
          <div>
            <label className="block text-gray-700 mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="Ingresa tu nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="Repite tu contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
