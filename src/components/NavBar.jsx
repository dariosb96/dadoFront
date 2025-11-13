import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import LogOutButton from "./logOut";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [ventasOpen, setVentasOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);

  const productosRef = useRef(null); // desktop
  const ventasRef = useRef(null); // desktop
  const productosMobileRef = useRef(null); // mobile
  const ventasMobileRef = useRef(null); // mobile

  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen((s) => !s);

  useEffect(() => {
    // Usamos 'click' para que el orden de ejecución no haga que se cierre antes del onClick del botón
    const handleClickOutside = (event) => {
      const target = event.target;

      // si el click está dentro de cualquiera de estos contenedores, no cerrar
      if (
        (productosRef.current && productosRef.current.contains(target)) ||
        (ventasRef.current && ventasRef.current.contains(target)) ||
        (productosMobileRef.current && productosMobileRef.current.contains(target)) ||
        (ventasMobileRef.current && ventasMobileRef.current.contains(target))
      ) {
        return;
      }

      // fuera de los dropdowns -> cerrar ambos dropdowns
      setProductosOpen(false);
      setVentasOpen(false);
    };

    document.addEventListener("click", handleClickOutside, true); // capture phase por si acaso
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between h-12 items-center">
          {/* Nombre o inicio */}
          <div className="text-2xl font-bold">{user?.name || user?.email || "Inicio"}</div>

          {/* Logo centrado */}
          <div className="flex-1 flex justify-center">
            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>

          {/* Menu Desktop */}
          <div className="hidden text-purple-700  md:flex items-center h-full space-x-6">
            <Link to="/" className=" text-white hover:text-purple-600">
              Inicio
            </Link>

            {/* Productos Desktop */}
            <div className="relative" ref={productosRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProductosOpen((s) => !s);
                }}
                className="flex text-white bg-black items-center space-x-1 hover:text-purple-600"
              >
                <span>Productos</span>
                <ChevronDown size={16} />
              </button>

              {productosOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-black  bg-opacity-50 rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/products"
                    className="block  text-white px-4 py-2 hover:bg-gray-900 hover:text-purple-600"
                    onClick={() => setProductosOpen(false)}
                  >
                    Ver Productos
                  </Link>
                  <Link
                    to="/createProd"
                    className="block  text-white px-4 py-2 hover:bg-gray-900 hover:text-purple-600"
                    onClick={() => setProductosOpen(false)}
                  >
                    Crear Producto
                  </Link>
                </div>
              )}
            </div>

            {/* Ventas Desktop */}
            <div className="relative" ref={ventasRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVentasOpen((s) => !s);
                }}
                className="flex text-white items-center space-x-1 hover:text-purple-600 bg-black"
              >
                <span>Ventas</span>
                <ChevronDown size={16} />
              </button>

              {ventasOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-black bg-opacity-50  rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/sells"
                    className="block  text-white px-4 py-2 hover:bg-gray-900 hover:text-purple-600"
                    onClick={() => setVentasOpen(false)}
                  >
                    Ver Ventas
                  </Link>
                  <Link
                    to="/createSell"
                    className="block  text-white px-4 py-2 hover:bg-gray-900 hover:text-purple-600"
                    onClick={() => setVentasOpen(false)}
                  >
                    Crear Venta
                  </Link>
                </div>
              )}
            </div>

            <Link to="/profile" className="block  text-white px-4 py-2  hover:text-purple-600">
              Perfil
            </Link>
            <Link to="/dash" className="block  text-white px-4 py-2  hover:text-purple-600">
              Dashboard
            </Link>
            <LogOutButton />
          </div>

          {/* Botón hamburguesa móvil */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="focus:outline-none bg-black p-1 rounded text-purple-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Móvil */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-50 text-white">
          <Link
            to="/"
            className="text-white block px-4 py-2 hover:bg-purple-600"
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>

          {/* Productos móvil */}
          <div ref={productosMobileRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProductosOpen((s) => !s);
              }}
              className="w-full bg-black text-left px-4 py-2 flex items-center justify-between hover:bg-gray-900 hover:text-purple-600"
            >
              <span>Productos</span>
              <ChevronDown size={16} />
            </button>

            {productosOpen && (
              <div className="bg-black  bg-opacity-50 z-40">
                <Link
                  to="/products"
                  className="text-gray-500 block px-6 py-2 hover:bg-gray-900"
                  onClick={() => {
                    setIsOpen(false);
                    setProductosOpen(false);
                  }}
                >
                  Ver Productos
                </Link>
                <Link
                  to="/createProd"
                  className="text-gray-500 block px-6 py-2 bg-black bg-opacity-50 hover:bg-gray-900"
                  onClick={() => {
                    setIsOpen(false);
                    setProductosOpen(false);
                  }}
                >
                  Crear Producto
                </Link>
              </div>
            )}
          </div>

          {/* Ventas móvil */}
          <div ref={ventasMobileRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVentasOpen((s) => !s);
              }}
              className="w-full text-left px-4 py-2 flex items-center justify-between bg-black hover:bg-gray-00 hover:text-purple-600"
            >
              <span>Ventas</span>
              <ChevronDown size={16} />
            </button>

            {ventasOpen && (
              <div className="bg-black z-40">
                <Link
                  to="/sells"
                  className="text-gray-500 block px-6 py-2 hover:bg-purple-600"
                  onClick={() => {
                    setIsOpen(false);
                    setVentasOpen(false);
                  }}
                >
                  Ver Ventas
                </Link>
                <Link
                  to="/createSell"
                  className="text-gray-500 block px-6 py-2 hover:bg-purple-600"
                  onClick={() => {
                    setIsOpen(false);
                    setVentasOpen(false);
                  }}
                >
                  Crear Venta
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/dash"
            className="text-gray-400 block px-4 py-2 hover:bg-purple-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="text-gray-400 block px-4 py-2 hover:bg-purple-600"
            onClick={() => setIsOpen(false)}
          >
            Perfil
          </Link>

          <div className="px-4 py-2">
            <LogOutButton />
          </div>
        </div>
      )}
    </nav>
  );
}
