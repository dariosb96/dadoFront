import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories } from "../Redux/actions/Products/get_categories";
import { createSell } from "../Redux/actions/Sells/createSell";
import { getFilteredProducts } from "../Redux/actions/Products/get_filteredProducts";

const Create_Sell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.filteredProducts);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sellProducts, setSellProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getCategories(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(getFilteredProducts({ category: selectedCategory }));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    if (search.length > 2) {
      dispatch(getFilteredProducts({ search }));
    }
  }, [dispatch, search]);

  // Función para agregar productos
  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error("Selecciona un producto válido");
      return;
    }

    if (quantity <= 0) {
      toast.error("Cantidad debe ser mayor a 0");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);

    if (!product) {
      toast.error("Producto no encontrado");
      return;
    }

    const existing = sellProducts.find((p) => p.ProductId === selectedProduct);
    const totalQuantity = existing ? existing.quantity + quantity : quantity;

    if (totalQuantity > product.stock) {
      toast.error(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    if (existing) {
      setSellProducts(
        sellProducts.map((p) =>
          p.ProductId === selectedProduct
            ? { ...p, quantity: totalQuantity }
            : p
        )
      );
    } else {
      setSellProducts([...sellProducts, { ProductId: selectedProduct, quantity }]);
    }

    setSelectedProduct("");
    setQuantity(1);
    toast.success(`Producto agregado: ${product.name} x${quantity}`);
  };

  // Eliminar producto
  const handleRemoveProduct = (id) => {
    setSellProducts(sellProducts.filter((p) => p.ProductId !== id));
    const product = products.find((p) => p.id === id);
    if (product) toast.info(`Producto eliminado: ${product.name}`);
  };

  // Enviar venta
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sellProducts.length === 0) {
      setMessage("Debes agregar al menos un producto a la venta");
      setMessageType("error");
      return;
    }

    try {
      await dispatch(createSell(sellProducts, token));
      setMessage("Venta registrada con éxito");
      setMessageType("success");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      setMessage(error?.response?.data?.error || "Error al registrar venta");
      setMessageType("error");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow rounded relative overflow-x-hidden sm:p-6">
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center font-medium ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <Link to="/" aria-label="Volver al inicio">
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            className="bg-purple-800 hover:bg-purple-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-300"
          >
            ← Inicio
          </button>
        </div>
      </Link>

      <h2 className="text-2xl text-black font-semibold mb-6 mt-12 text-center sm:text-left">
        Crear nueva venta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Seleccionar categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-gray-100 border text-black border-purple-500 rounded-md px-4 py-2"
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de producto y cantidad */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="flex-grow bg-gray-100 border border-purple-500 rounded-md px-4 py-2 text-gray-800"
          >
            <option value="">  Selecciona un producto </option>
            {Array.isArray(products) &&
              products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (Stock: {prod.stock})
                </option>
              ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
          />

          <button
            type="button"
            onClick={handleAddProduct}
            className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Agregar
          </button>
        </div>

        {/* Productos seleccionados */}
        {sellProducts.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Productos seleccionados</h3>
            <ul className="space-y-2">
              {sellProducts.map((p) => {
                const prod = products.find((prod) => prod.id === p.ProductId);
                return (
                  <li
                    key={p.ProductId}
                    className="flex justify-between text-black items-center bg-white p-2 rounded shadow"
                  >
                    <span>
                      {prod ? prod.name : "Producto"} --- Cantidad: {p.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p.ProductId)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
        >
          Registrar venta
        </button>
      </form>
    </div>
  );
};

export default Create_Sell;
