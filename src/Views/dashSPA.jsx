import React, { useEffect, useState } from "react";
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
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, salesByDay, salesByMonth, topProducts, salesByUser, error } =
    useSelector((state) => state.dashboard);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleFilter = () => {
    if (!startDate || !endDate) return alert("Selecciona ambas fechas");
    dispatch(fetchDashboardData(startDate, endDate));
  };

  const formattedSalesByDay = (salesByDay || []).map((d) => ({
    date: d.day ? format(parseISO(d.day), "dd MMM", { locale: es }) : "N/D",
    totalSales: Number(d.totalSales) || 0,
  }));

  const formattedSalesByMonth = (salesByMonth || []).map((d) => ({
    month: d.month || "N/D",
    totalSales: Number(d.totalSales) || 0,
  }));

  const formattedTopProducts = (topProducts || []).map((p) => ({
    name: p.product?.name || "Sin nombre",
    totalSold: Number(p.totalSold) || 0,
    image: p.product?.images?.[0]?.url || null, 
  }));

  const formattedSalesByUser = (salesByUser || []).map((u) => ({
    name: u["Sell.User.name"] || "Usuario desconocido",
    totalSales: Number(u.totalSales) || 0,
  }));

  if (loading) return <p className="text-center mt-8">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (

      
    <div className="p-6 space-y-10 ">
      <Link to ="/">
      <button className="bg-purple-800 text-white"> Inicio
        </button></Link> 
      <h1 className="text-3xl  text-black font-bold mb-4">Dashboard de Ventas</h1>

      {/* === FILTRO DE FECHAS === */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-black text-sm font-medium">Desde:</label>
          <input
            type="date"
            className="border rounded-lg px-2 py-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-black text-sm font-medium">Hasta:</label>
          <input
            type="date"
            className="border rounded-lg px-2 py-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      {/* === GRÁFICO: Ventas por Día === */}
      <section>
        <h2 className="text-xl text-black font-semibold mb-2">Ventas por Día</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedSalesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* === GRÁFICO: Productos más vendidos === */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Productos más vendidos {startDate && endDate && `(${startDate} → ${endDate})`}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {formattedTopProducts.map((p, i) => (
            <div key={i} className="bg-white shadow rounded-2xl p-3 hover:shadow-lg transition">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-40 black rounded-xl flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}

              <h4 className="mt-3 font-semibold text-lg">{p.name}</h4>
              <p className="text-black text-sm">Vendidos: {p.totalSold}</p>
            </div>
          ))}
        </div>
      </section>
    </div>

  );
};

export default Dashboard;
