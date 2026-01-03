import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchDashboardData } from "../Redux/actions/Dash/getDash";

import KpiCard from "../components/dash/kpiCard";
import SalesByUserTable from "../components/dash/salesUserChart";
import SalesByDayChart from "../components/dash/salesDayChart";
import ProfitableProducts from "../components/dash/profitableProducts";
import TopProductsGrid from "../components/dash/topProducts";

const DashboardSPA = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    salesByDay,
    topProducts,
    salesByUser: userSales,
    loading,
  } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-white text-center mt-10">
        Cargando dashboard...
      </p>
    );

  const totalRevenue = userSales.reduce(
    (acc, s) => acc + Number(s.totalAmount || 0),
    0
  );

  const totalProductsSold = userSales.reduce(
    (acc, s) => acc + Number(s.numberOfProducts || 0),
    0
  );

  return (
    <div className="min-h-screen bg-black bg-opacity-75 p-5 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg
                     bg-purple-700 hover:bg-gray-700 text-white transition"
        >
         
         ← Inicio
        </button>

        <h1 className="text-xl font-semibold text-white">
          Dashboard
        </h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Ingresos totales" value={`$${totalRevenue}`} />
        <KpiCard title="Ventas realizadas" value={userSales.length} />
        <KpiCard title="Productos vendidos" value={totalProductsSold} />
      </div>

      <SalesByDayChart data={salesByDay} />

      <TopProductsGrid products={topProducts} />

      <div className="grid md:grid-cols-2 gap-6">
        <SalesByUserTable sales={userSales} />
        <ProfitableProducts sales={userSales} />
      </div>
    </div>
  );
};

export default DashboardSPA;
