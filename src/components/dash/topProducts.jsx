const TopProductsGrid = ({ products }) => {
  return (
    <section>
      <h2 className="text-white text-xl font-semibold mb-4">
        Productos más vendidos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl p-3 hover:shadow-lg transition"
          >
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="h-40 w-full object-cover rounded-xl"
              />
            ) : (
              <div className="h-40 bg-black rounded-xl flex items-center justify-center text-gray-500">
                Sin imagen
              </div>
            )}

            <p className="text-white font-semibold mt-3 truncate">
              {p.name}
            </p>
            <p className="text-gray-400 text-sm">
              Vendidos: <span className="text-white">{p.totalSold}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopProductsGrid;
