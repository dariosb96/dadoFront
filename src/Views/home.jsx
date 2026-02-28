import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyCatalogLink from "../components/MyCatalogLink";
import Navbar from "../components/NavBar";
import { Package, ShoppingCart, BarChart3 } from "lucide-react";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const modules = [
    {
      title: "Productos",
      description: "Gestión de inventario y catálogo",
      icon: Package,
      to: "/products",
    },
    {
      title: "Ventas",
      description: "Transacciones y control comercial",
      icon: ShoppingCart,
      to: "/sells",
    },
    {
      title: "Estadísticas",
      description: "Analítica y rendimiento",
      icon: BarChart3,
      to: "/dash",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 pt-10">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {user?.businessName}
          </h1>
        </header>

        {/* GRID */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {modules.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={index}
                to={item.to}
                className="
                  group
                  rounded-2xl
                  p-[1px]
                  bg-gradient-to-b from-gray-800 to-gray-900
                  hover:from-purple-700/40 hover:to-gray-900
                  transition
                "
              >
                <div
                  className="
                    h-full
                    rounded-2xl
                    bg-[#0b0b0b]
                    p-6
                    flex flex-col justify-between
                    min-h-[170px]
                  "
                >
                  <div className="flex items-start justify-between">

                    <div className="w-10 h-10 rounded-lg bg-[#111] border border-gray-800 flex items-center justify-center">
                      <Icon size={18} className="text-purple-500" />
                    </div>

                    <span className="text-gray-700 group-hover:text-gray-400 transition text-sm">
                      →
                    </span>

                  </div>

                  <div>
                    <h2 className="mt-6 text-lg font-semibold">
                      {item.title}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}

        </section>

      </main>

      {/* CTA BOTTOM */}
      <div className="pb-16 pt-10 flex justify-center">
        <button
          onClick={() => setCatalogOpen(true)}
          className="
            bg-purple-700 hover:bg-purple-600
            px-8 py-3
            rounded-xl
            font-medium
            text-sm
            transition
            shadow-lg shadow-purple-900/30
          "
        >
          Ver catálogo público
        </button>
      </div>

      {/* MODAL */}
      {catalogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-[#070707] border border-gray-800 rounded-xl shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <span className="text-sm text-gray-400">
                Catálogo público
              </span>

              <button
                onClick={() => setCatalogOpen(false)}
                className="text-gray-600 hover:text-white transition text-sm"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6">
              <MyCatalogLink onClose={() => setCatalogOpen(false)} />
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Home;
