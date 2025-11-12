import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Redux/actions/Auth/login";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png' ; 



const Login = () => {
  const [useremail, setUserEmail] = useState('');
  const [userpassword, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(state => state.auth.error);
  const loading = useSelector(state => state.auth.loading);
  const token = useSelector(state => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser({
      email: useremail,
      password: userpassword
    }));
  };
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);


  return (

     <div className="min-h-screen  flex flex-col overflow-hidden">
    {/* Logo arriba */}
    <div className="flex justify-center ">
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-auto object-contain"
      />
    </div>
      <div className="content max-w-md mx-auto p-6 bg-black bg-opacity-75 rounded-lg shadow-md">

       

        <h1 className="text-white text-2xl font-semibold mb-6 text-center">Iniciar sesión</h1>

        <div className="form-group space-y-4">
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={useremail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            <input
              type="password"
              placeholder="Password"
              value={userpassword}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 text-gray-400 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-800 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition duration-300"
            >
              {loading ? 'Logging in...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/create">
              <h2>Registrar</h2>
            </Link>
            <div className="mt-6 py-4">
              <Link to="/allcatalogs">
                <h2 className="text-red-700 font-semibold">
                  Ver catálogos públicos
                </h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
