import { format } from "date-fns";
import { es } from "date-fns/locale";

const SalesByUserTable = ({ sales }) => {
return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <h2 className="text-white text-xl font-semibold mb-4">
        Historial de ventas
      </h2>

      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="pb-2">Fecha</th>
            <th className="pb-2">Productos</th>
            <th className="pb-2">Total</th>
            <th className="pb-2">Estado</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => (
            <tr
              key={s.id}
              className="border-b border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="py-2 text-white">
                {format(new Date(s.creationDate), "dd MMM yyyy", {
                  locale: es,
                })}
              </td>

              <td className="py-2 text-gray-300">
                {s.numberOfProducts}
              </td>

              <td className="py-2 text-green-400 font-semibold">
                ${s.totalAmount}
              </td>

              <td className="py-2">
                <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-300">
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default SalesByUserTable;
