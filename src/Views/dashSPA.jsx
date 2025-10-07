import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../Redux/actions/Dash/getDash";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DashboardSPA() {
  const dispatch = useDispatch();
  const { salesByDay, salesByMonth, topProducts, salesByUser, loading, error } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // ✅ Formateamos datos según back
  const formattedSalesByDay = (salesByDay || []).map((s) => ({
    day: s.day,
    total: Number(s.totalSales) || 0,
  }));

  const formattedSalesByMonth = (salesByMonth || []).map((s) => ({
    month: s.month || "Sin mes",
    total: Number(s.totalSales) || 0,
  }));

  const formattedTopProducts = (topProducts || []).map((p) => ({
    name: p.Product?.name || "Desconocido",
    totalSold: Number(p.totalSold) || 0,
  }));

  const formattedSalesByUser = (salesByUser || []).map((u) => ({
    user: u["Sell.User.name"] || "Desconocido",
    totalSales: Number(u.totalSales) || 0,
  }));

  // ✅ Calculamos resumen en frontend
  const summary = {
    todaySales: formattedSalesByDay.reduce((acc, s) => acc + s.total, 0),
    monthSales: formattedSalesByMonth.reduce((acc, s) => acc + s.total, 0),
    totalProducts: formattedTopProducts.length,
    totalUsers: formattedSalesByUser.length,
  };

  console.log("formattedSalesByDay:", formattedSalesByDay);
  console.log("formattedSalesByMonth:", formattedSalesByMonth);
  console.log("formattedTopProducts:", formattedTopProducts);
  console.log("formattedSalesByUser:", formattedSalesByUser);
  console.log("calculated summary:", summary);

  if (loading) return <p>Cargando dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

return (
  <div className="p-6 bg-gray-100 min-h-screen">
    {/* Botón de inicio (arriba del form) */}
   <div className="mb-4 flex justify-start">
  <Link to="/" aria-label="Volver al inicio">
    <button
      type="button"
      className="bg-purple-800 hover:bg-purple-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-300"
    >
      ← Inicio
    </button>
  </Link>
</div>



    {/* Título */}
    <h1 className="text-3xl font-bold mb-6 text-black">
      Panel de Administración
    </h1>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Ventas Hoy</h2>
          <p className="text-xl font-bold text-black">{summary.todaySales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Ventas del Mes</h2>
          <p className="text-xl font-bold text-black">{summary.monthSales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Usuarios Totales</h2>
          <p className="text-xl font-bold text-black">{summary.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Productos Totales</h2>
          <p className="text-xl font-bold text-black">{summary.totalProducts}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ventas por Día */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4 text-black">Ventas por Día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedSalesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Mes */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4 text-black">Ventas por Mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedSalesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Productos Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedTopProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Usuario */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Ventas por Usuario</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedSalesByUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="user" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#d88484" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
