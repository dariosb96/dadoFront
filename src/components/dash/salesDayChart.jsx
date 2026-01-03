import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesByDayChart = ({ data }) => (
  <div className="bg-gray-900 rounded-2xl p-4 h-80">
    <h2 className="text-white text-lg font-semibold mb-3">
      Ventas por día
    </h2>

    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesByDayChart;
