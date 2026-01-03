const ProfitableProducts = ({ sales }) => {
  const products = sales
    .flatMap(s =>
      s.items.map(item => ({
        name: item.product.name,
        profit:
          Number(item.price) - Number(item.product.buyPrice),
        image: item.product.images?.[0]?.url,
      }))
    )
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 6);

  return (
    <section>
      <h2 className="text-white text-xl font-semibold mb-4">
        Productos más rentables
      </h2>

      <div className="grid md:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl p-3"
          >
            <img
              src={p.image}
              className="h-32 w-full object-cover rounded-xl"
            />
            <p className="text-white mt-2 truncate">{p.name}</p>
            <p className="text-green-400 text-sm">
              Ganancia: ${p.profit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfitableProducts;
