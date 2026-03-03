import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyCatalogLink from "../components/MyCatalogLink";
import Navbar from "../components/NavBar";
import {
  Package, ShoppingCart, BarChart3,
  ArrowUpRight, Store, TrendingUp, Box,
  ChevronRight, X
} from "lucide-react";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const modules = [
    {
      title: "Productos",
      description: "Gestiona tu inventario, precios y variantes desde un solo lugar.",
      icon: Package,
      accent: "#9333ea",
      accentBg: "rgba(147,51,234,0.08)",
      accentRing: "rgba(147,51,234,0.2)",
      to: "/products",
      stat: "Inventario",
    },
    {
      title: "Ventas",
      description: "Registra transacciones y lleva el control de tu flujo comercial.",
      icon: ShoppingCart,
      accent: "#a855f7",
      accentBg: "rgba(168,85,247,0.08)",
      accentRing: "rgba(168,85,247,0.2)",
      to: "/sells",
      stat: "Transacciones",
    },
    {
      title: "Estadísticas",
      description: "Analiza el rendimiento de tu negocio con métricas en tiempo real.",
      icon: BarChart3,
      accent: "#7c3aed",
      accentBg: "rgba(124,58,237,0.08)",
      accentRing: "rgba(124,58,237,0.2)",
      to: "/dash",
      stat: "Analítica",
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .home-root { font-family: 'Inter', sans-serif; }
        .module-card {
          position: relative;
          background: #0f0f0f;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          min-height: 180px;
        }
        .module-card:hover {
          border-color: rgba(147,51,234,0.35);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(124,58,237,0.12);
        }
        .module-card:hover .card-arrow { opacity: 1; transform: translate(1px,-1px); }
        .card-arrow { opacity: 0; transition: opacity 0.2s, transform 0.2s; color: #a78bfa; }
        .stat-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
          border-radius: 999px; padding: 2px 10px;
          font-size: 11px; color: #a78bfa; font-weight: 500;
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .fade-in { animation: fadeIn 0.4s ease both; }
        .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s}
      `}</style>

      <div className="home-root min-h-screen flex flex-col" style={{ background: '#080808' }}>
        <Navbar />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16">

          {/* ── HEADER ── */}
          <header className="fade-in mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p style={{ fontSize: 12, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
                {greeting}
              </p>
              <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {user?.businessName || "Mi negocio"}
              </h1>
              <p style={{ fontSize: 13, color: '#4b5563', marginTop: 6 }}>
                Panel de administración
              </p>
            </div>

            {/* CTA catálogo */}
            <button
              onClick={() => setCatalogOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg,#7c3aed,#9333ea)',
                border: 'none', borderRadius: 12, padding: '10px 18px',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Store size={14} />
              Ver catálogo
            </button>
          </header>

          {/* ── MÓDULOS ── */}
          <div style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          }}>
            {modules.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`module-card fade-in d${i + 1}`}
                  style={{ textDecoration: 'none' }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: item.accentBg,
                      border: `1px solid ${item.accentRing}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} style={{ color: item.accent }} />
                    </div>
                    <ArrowUpRight size={16} className="card-arrow" />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f3f4f6', margin: 0 }}>
                        {item.title}
                      </h2>
                      <span className="stat-pill">
                        <TrendingUp size={9} />
                        {item.stat}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontSize: 11, color: '#374151', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Abrir módulo
                    </span>
                    <ChevronRight size={14} style={{ color: '#374151' }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── BANNER INFERIOR ── */}
          <div className="fade-in" style={{
            marginTop: 24,
            borderRadius: 16,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.12)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Box size={15} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#d1d5db', fontWeight: 500, margin: 0 }}>
                  Tu tienda en línea
                </p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>
                  Comparte tu catálogo público con tus clientes
                </p>
              </div>
            </div>
            <button
              onClick={() => setCatalogOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10, padding: '8px 16px',
                color: '#c4b5fd', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              Ver catálogo <ArrowUpRight size={12} />
            </button>
          </div>

        </main>

        {/* ── MODAL CATÁLOGO ── */}
        {catalogOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}>
            <div style={{
              width: '100%', maxWidth: 480,
              background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}>
              {/* Header modal */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Store size={14} style={{ color: '#a78bfa' }} />
                  </div>
                  <span style={{ fontSize: 14, color: '#e5e7eb', fontWeight: 500 }}>
                    Catálogo público
                  </span>
                </div>
                <button
                  onClick={() => setCatalogOpen(false)}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#9ca3af', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <MyCatalogLink onClose={() => setCatalogOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;