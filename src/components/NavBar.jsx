import { useState } from "react";
import { useSelector } from "react-redux";
import { LogOut, Menu, X, ChevronDown } from "lucide-react";
import LogOutButton from "./logOut";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [ventasOpen, setVentasOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-purple-900 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between h-12 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">
            {user?.name || user?.email || "Inicio"}
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center h-full space-x-6">
            <a href="/" className="text-white hover:text-purple-300">
              Inicio
            </a>

            {/* Dropdown Productos */}
            <div className="relative">
              <button
                onClick={() => setProductosOpen(!productosOpen)}
                className="flex items-center space-x-1 text-white hover:text-purple-300 bg-purple-900"
              >
                <span>Productos</span>
                <ChevronDown size={16} />
              </button>

              {productosOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-purple-900 rounded-md shadow-lg py-2 z-50">
                  <a
                    href="/products"
                    className="block px-4 py-2 hover:bg-purple-700 text-white"
                  >
                    Ver Productos
                  </a>
                  <a
                    href="/createProd"
                    className="block px-4 py-2 hover:bg-purple-700 text-white"
                  >
                    Crear Producto
                  </a>
                </div>
              )}
            </div>

            {/* Dropdown Ventas */}
            <div className="relative">
              <button
                onClick={() => setVentasOpen(!ventasOpen)}
                className="flex items-center space-x-1 text-white hover:text-purple-300 bg-purple-900"
              >
                <span>Ventas</span>
                <ChevronDown size={16} />
              </button>

              {ventasOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-purple-900 rounded-md shadow-lg py-2 z-50">
                  <a
                    href="/sells"
                    className="block px-4 py-2 hover:bg-purple-700 text-white"
                  >
                    Ver Ventas
                  </a>
                  <a
                    href="/createSell"
                    className="block px-4 py-2 hover:bg-purple-700 text-white"
                  >
                    Crear Venta
                  </a>
                </div>
              )}
            </div>

            <a href="/dash" className="text-white hover:text-purple-300">
              Dashboard
            </a>
            <LogOutButton />
          </div>

          {/* Botón hamburguesa (solo móvil) */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none bg-purple-800 p-1 rounded"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu móvil */}
      {isOpen && (
        <div className="md:hidden bg-purple-800 text-white">
          <a
            href="/"
            className="block px-4 py-2 hover:bg-purple-600 text-white"
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </a>

          {/* Dropdown Productos en móvil */}
          <div>
            <button
              onClick={() => setProductosOpen(!productosOpen)}
              className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-purple-800 bg-purple-800 text-white"
            >
              <span>Productos</span>
              <ChevronDown size={16} />
            </button>
            {productosOpen && (
              <div className="bg-purple-700">
                <a
                  href="/products"
                  className="block px-6 py-2 hover:bg-purple-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Ver Productos
                </a>
                <a
                  href="/createProd"
                  className="block px-6 py-2 hover:bg-purple-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Crear Producto
                </a>
              </div>
            )}
          </div>

          {/* Dropdown Ventas en móvil */}
          <div>
            <button
              onClick={() => setVentasOpen(!ventasOpen)}
              className="w-full text-left px-4 py-2 flex items-center justify-between hover:bg-purple-800 bg-purple-800 text-white"
            >
              <span>Ventas</span>
              <ChevronDown size={16} />
            </button>
            {ventasOpen && (
              <div className="bg-purple-700">
                <a
                  href="/sells"
                  className="block px-6 py-2 hover:bg-purple-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Ver Ventas
                </a>
                <a
                  href="/createSell"
                  className="block px-6 py-2 hover:bg-purple-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Crear Venta
                </a>
              </div>
            )}
          </div>

          <a
            href="/dash"
            className="block px-4 py-2 hover:bg-purple-600 text-white"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </a>

          <LogOutButton />
        </div>
      )}
    </nav>
  );
}

