const KpiCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-900 rounded-2xl p-4 shadow hover:shadow-lg transition">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    {subtitle && (
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    )}
  </div>
);

export default KpiCard;
