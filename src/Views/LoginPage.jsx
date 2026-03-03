import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../Redux/actions/Auth/login";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, TrendingUp, Package, ShoppingBag } from "lucide-react";
import logo from '../assets/logo.png';

const Login = () => {
  const [useremail, setUserEmail] = useState('');
  const [userpassword, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');

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

  useEffect(() => {
    if (token && !error) {
      navigateRef.current('/home');
    }
  }, [token, error]);

  const features = [
    { icon: Package,     label: "Inventario",  sub: "Control total de stock"       },
    { icon: ShoppingBag, label: "Ventas",       sub: "Registra cada transacción"    },
    { icon: TrendingUp,  label: "Estadísticas", sub: "Analiza tu rendimiento"       },
  ];

  return (
    <>
      {/* Google Font — Syne para headlines, DM Sans para cuerpo */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .font-syne   { font-family: 'Syne', sans-serif; }
        .font-dm     { font-family: 'DM Sans', sans-serif; }

        /* Entrada suave del panel del formulario */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .anim-fadeup { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-delay-1 { animation-delay: 0.05s; }
        .anim-delay-2 { animation-delay: 0.12s; }
        .anim-delay-3 { animation-delay: 0.19s; }
        .anim-delay-4 { animation-delay: 0.26s; }
        .anim-delay-5 { animation-delay: 0.33s; }

        /* Input nativo — quitar fondo amarillo de autocompletado */
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #18181b inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff;
        }
      `}</style>

      <div className="font-dm min-h-screen bg-zinc-950 flex flex-col lg:flex-row overflow-hidden">

        {/* ════════════════════════════════════════
            PANEL IZQUIERDO — branding / features
        ════════════════════════════════════════ */}
        <div
          className="hidden lg:flex w-[46%] xl:w-[48%] relative flex-col justify-between p-12 xl:p-16 overflow-hidden flex-shrink-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 55% 35%, #3b0764 0%, #12022b 45%, #09090b 100%)'
          }}
        >
          {/* Textura de ruido */}
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px',
            }}
          />

          {/* Orbs de luz */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700/25 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-900/30 rounded-full blur-[90px] pointer-events-none" />

          {/* Líneas decorativas diagonales */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                style={{ top: `${10 + i * 16}%`, left: '-10%', right: '-10%', transform: `rotate(-8deg)` }}
              />
            ))}
          </div>

          {/* Logo + nombre */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 ring-1 ring-purple-400/20 flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-4.5 h-4.5 object-contain" />
            </div>
            <span className="text-purple-200/50 text-sm font-medium tracking-wider">Mi Negocio</span>
          </div>

          {/* Copy principal */}
          <div className="relative z-10 -mt-8">
            <p className="text-purple-400/70 text-[11px] font-semibold tracking-[0.22em] uppercase mb-5">
              Panel de gestión
            </p>
            <h2 className="font-syne text-white text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              Gestiona tu<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)' }}>
                negocio sin límites.
              </span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
              Inventario, ventas y analítica integrados en una sola plataforma diseñada para crecer contigo.
            </p>

            {/* Feature cards */}
            <div className="mt-8 flex flex-col gap-3">
              {features.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 ring-1 ring-purple-400/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-semibold">{label}</p>
                    <p className="text-zinc-600 text-[11px] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="relative z-10 text-zinc-800 text-xs">© 2025 · Todos los derechos reservados</p>
        </div>

        {/* ════════════════════════════════════════
            PANEL DERECHO — formulario
        ════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-zinc-950">

          {/* Header mobile */}
          <div className="lg:hidden flex items-center justify-between px-6 pt-10 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 ring-1 ring-purple-500/20 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-4 h-4 object-contain" />
              </div>
              <span className="text-zinc-500 text-sm font-medium">Mi Negocio</span>
            </div>
            <Link to="/allcatalogs" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              <BookOpen size={12} />
              Catálogos
            </Link>
          </div>

          {/* Contenido centrado */}
          <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 lg:py-0">
            <div className="w-full max-w-[360px]">

              {/* Header del form */}
              <div className="anim-fadeup mb-8">
                <h1 className="font-syne text-white text-[1.75rem] sm:text-3xl font-bold tracking-tight leading-none">
                  Bienvenido
                </h1>
                <p className="text-zinc-600 text-sm mt-2 font-light">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="anim-fadeup flex items-start gap-3 rounded-xl px-4 py-3 mb-5 bg-red-950/60 ring-1 ring-red-900/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <p className="text-red-400 text-sm leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Email */}
                <div className="anim-fadeup anim-delay-1 flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-medium tracking-wide">
                    Correo electrónico
                  </label>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                    focused === 'email'
                      ? 'bg-purple-950/50 ring-1 ring-purple-600/50 shadow-lg shadow-purple-950/30'
                      : 'bg-zinc-900 ring-1 ring-zinc-800 hover:ring-zinc-700 hover:bg-zinc-900/80'
                  }`}>
                    <Mail size={15} className={`flex-shrink-0 transition-colors duration-200 ${focused === 'email' ? 'text-purple-400' : 'text-zinc-600'}`} />
                    <input
                      type="email"
                      placeholder="tu@correo.com"
                      value={useremail}
                      autoComplete="email"
                      onChange={(e) => setUserEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      className="flex-1 bg-transparent text-sm text-white placeholder-zinc-700 outline-none min-w-0"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="anim-fadeup anim-delay-2 flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-medium tracking-wide">
                    Contraseña
                  </label>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                    focused === 'password'
                      ? 'bg-purple-950/50 ring-1 ring-purple-600/50 shadow-lg shadow-purple-950/30'
                      : 'bg-zinc-900 ring-1 ring-zinc-800 hover:ring-zinc-700 hover:bg-zinc-900/80'
                  }`}>
                    <Lock size={15} className={`flex-shrink-0 transition-colors duration-200 ${focused === 'password' ? 'text-purple-400' : 'text-zinc-600'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={userpassword}
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      className="flex-1 bg-transparent text-sm text-white placeholder-zinc-700 outline-none min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-600 hover:text-zinc-300 transition-colors border-none bg-transparent cursor-pointer p-0 flex-shrink-0"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="anim-fadeup anim-delay-3">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      role="checkbox"
                      aria-checked={rememberMe}
                      className={`w-[18px] h-[18px] rounded-md flex items-center justify-center transition-all flex-shrink-0 ring-1 ${
                        rememberMe
                          ? 'bg-purple-600 ring-purple-600 shadow-md shadow-purple-900/40'
                          : 'bg-zinc-900 ring-zinc-700 group-hover:ring-zinc-500'
                      }`}
                    >
                      {rememberMe && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-none stroke-white" strokeWidth="2.2">
                          <polyline points="1,4 4,7 9,1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors select-none">
                      Mantener sesión iniciada
                    </span>
                  </label>
                </div>

                {/* Botón submit */}
                <div className="anim-fadeup anim-delay-4 mt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-200 cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                    style={{
                      background: loading
                        ? 'linear-gradient(135deg, #6d28d9, #7c3aed)'
                        : 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                      boxShadow: '0 4px 24px rgba(124,58,237,0.35), 0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-[14px] h-[14px] border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Divider */}
              <div className="anim-fadeup anim-delay-5 flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-zinc-700 text-xs font-medium">o</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Links */}
              <div className="anim-fadeup anim-delay-5 flex flex-col items-center gap-3">
                <p className="text-zinc-600 text-sm">
                  ¿Sin cuenta?{" "}
                  <Link to="/create" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Crear una gratis
                  </Link>
                </p>
                <Link
                  to="/allcatalogs"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-500 transition-colors py-1"
                >
                  <BookOpen size={11} />
                  Ver catálogos públicos
                </Link>
              </div>

            </div>
          </div>

          {/* Footer mobile */}
          <div className="lg:hidden text-center pb-8">
            <p className="text-zinc-800 text-xs">© 2025 · Todos los derechos reservados</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;