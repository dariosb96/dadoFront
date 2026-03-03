import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Redux/actions/Auth/login";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';

// Pon esto fuera del componente, al inicio del archivo

const Login = () => {
  const [useremail, setUserEmail] = useState('');
  const [userpassword, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  const error = useSelector(state => state.auth.error);
  const loading = useSelector(state => state.auth.loading);
  const token = useSelector(state => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email: useremail, password: userpassword }, rememberMe));
  };

  // navigateRef evita que navigate sea dependencia del effect
  // El effect solo corre cuando token cambia — nunca por re-renders del componente
useEffect(() => {
  if (token && !error) {
    navigate('/home');
  }
}, [token, error]);
console.log('RENDER - token:', token, '| error:', error, '| loading:', loading, '| stack:', new Error().stack.split('\n')[2]);
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex justify-center">
        <img src={logo} alt="Logo" className="w-12 h-auto object-contain" />
      </div>

      <div className="content max-w-md mx-auto p-6 bg-black bg-opacity-75 rounded-lg shadow-md">
        <h1 className="text-white text-xl font-semibold mb-6 py-2 text-center">Iniciar sesión</h1>

        <div className="form-group space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={useremail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-gray-900 border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={userpassword}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            <div className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-purple-600"
              />
              <label htmlFor="rememberMe" className="text-xs cursor-pointer">
                Mantener sesión iniciada
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-800 hover:bg-gray-500 text-white font-semibold py-1 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/create">
              <h2 className="pb-10">Registrar</h2>
            </Link>
            <div className="mt-1 py-1">
              <Link to="/allcatalogs">
                <h2 className="text-gray-500 font-semibold">➜ Ver catálogos públicos</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;