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
    { icon: Package,     label: "Inventario",  sub: "Control total de stock en tiempo real"       },
    { icon: ShoppingBag, label: "Ventas",       sub: "Registra cada transacción con historial completo"    },
    { icon: TrendingUp,  label: "Estadísticas", sub: "Reportes de ganancias y perdidas"   },
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
            background: 'radial-gradient(ellipse 80% 70% at 55% 35%, #430c7a 0%, #12022b 45%, #000000 100%)'
          }}
        >

          {/* Orbs de luz */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-800/25 rounded-full blur-[120px] pointer-events-none" />
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
            <span className="text-purple-200/50 text-sm font-medium tracking-wider">DADDO</span>
          </div>

          {/* Copy principal */}
          <div className="relative z-10 -mt-8">

            <h2 className="font-syne text-white text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              Gestiona tu<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)' }}>
                negocio sin límites.
              </span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
              Inventario, ventas y estadísticas integrados en una sola plataforma diseñada para crecer contigo.
            </p>

            {/* Feature cards */}
            <div className="mt-8 flex flex-col gap-3">
              {features.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06] backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 ring-1 ring-purple-400/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-purple-300" />
                  </div>
                  <div>
                    <p className="text-white/80 text-left text-sm font-semibold">{label}</p>
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
        {/* PANEL DERECHO */}

        <div className="flex-1 flex items-center justify-center relative px-8">

          {/* glow de fondo */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12),transparent_60%)]" />

          {/* CARD GLASS */}

          <div
            className="
            relative
            w-full
            max-w-[380px]
            bg-white/[0.04]
            backdrop-blur-xl
            ring-1 ring-white/[0.08]
            rounded-2xl
            px-8
            py-10
            shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          "
          >
            <div className="anim-fadeup mb-8">
              <h1 className="font-syne text-white text-3xl font-bold">
                Bienvenido
              </h1>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 bg-red-950/60 ring-1 ring-red-900/50">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* EMAIL */}

              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-500">Correo</label>

                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    focused === "email"
                      ? "bg-purple-950/40 ring-1 ring-purple-600"
                      : "bg-zinc-900 ring-1 ring-zinc-800"
                  }`}
                >
                  <Mail size={15} className="text-zinc-500" />

                  <input
                    type="email"
                    value={useremail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    placeholder="tu@correo.com"
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="flex flex-col gap-2">
                <label className="text-xs text-zinc-500">Contraseña</label>

                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    focused === "password"
                      ? "bg-purple-950/40 ring-1 ring-purple-600"
                      : "bg-zinc-900 ring-1 ring-zinc-800"
                  }`}
                >
                  <Lock size={15} className="text-zinc-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={userpassword}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}

              <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Mantener sesión iniciada
              </label>

              {/* BOTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                group
                w-full
                flex
                items-center
                justify-center
                gap-2
                text-white
                font-semibold
                text-sm
                py-3.5
                rounded-xl
                transition-all
                duration-300
                hover:shadow-[0_10px_30px_rgba(124,58,237,0.6)]
                hover:brightness-110
                active:scale-[0.97]
              "
                style={{
                  background:
                    "linear-gradient(135deg,#6d28d9 0%,#7c3aed 40%,#9333ea 100%)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-[14px] h-[14px] border border-white/40 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-700 text-xs">o</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="text-center text-sm text-zinc-600">
              ¿Sin cuenta?{" "}
              <Link to="/create" className="text-purple-400 hover:text-purple-300">
                Crear una
              </Link>
            </div>

            <Link
              to="/allcatalogs"
              className="mt-4 flex justify-center items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400"
            >
              <BookOpen size={14} />
              Ver catálogos públicos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;