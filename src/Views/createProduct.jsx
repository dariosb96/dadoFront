import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createProduct } from "../Redux/actions/Products/create_product";
import { createCategory } from "../Redux/actions/Products/create_category";
import { getCategories } from "../Redux/actions/Products/get_categories";
const Create_Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { categories, loading, error } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
    price: "",
    stock: "",
    buyPrice: "",
  });

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [createAnother, setCreateAnother] = useState(false);

  useEffect(() => {
    dispatch(getCategories(token));
  }, [dispatch, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct({
      ...product,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let categoryId = product.category;

      if (newCategory) {
        const created = await dispatch(createCategory(newCategory, token));
        categoryId = created.id;
        dispatch(getCategories(token));
        setNewCategory("");
        setShowNewCategoryInput(false);
      }

      if (!categoryId) {
        toast.error("Debe seleccionar o crear una categoría");
        return;
      }

      const productToSend = {
        ...product,
        categoryId,
      };

      await dispatch(createProduct(productToSend, token));
      toast.success("Producto creado con éxito");

      if (createAnother) {
        setProduct({
          name: "",
          description: "",
          image: null,
          price: "",
          stock: "",
          buyPrice: "",
          category: "",
        });
      } else {
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (error) {
      toast.error("Error al crear producto");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white shadow rounded relative overflow-x-hidden">
      {/* Botón de Inicio */}
      <Link to="/" aria-label="Volver al inicio">
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            className="bg-purple-800 hover:bg-gray-500 text-white font-medium px-3 py-1 rounded-md text-sm transition duration-600"
          >
            ← Inicio
          </button>
        </div>
      </Link>

      <h2 className="text-2xl text-black font-semibold mb-4 mt-12">Crear nuevo producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={product.name}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />

        {categories.length > 0 && !showNewCategoryInput ? (
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6 space-y-4 md:space-y-0">
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="bg-gray-100 text-black border border-purple-500 rounded-md px-4 py-2 flex-grow"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <span
              onClick={() => setShowNewCategoryInput(true)}
              className="text-purple-800 text-sm font-semibold cursor-pointer hover:underline transition duration-300 whitespace-nowrap"
            >
              Crear categoría
            </span>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 w-full max-w-md">
            <input
              type="text"
              name="newCategory"
              placeholder="Nombre de nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
            />

            {categories.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategory("");
                }}
                className="bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />

        <div className="flex items-center space-x-4">
          <label
            htmlFor="image"
            className="bg-purple-800 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition duration-300"
          >
            Seleccionar imágenes
          </label>
          <span className="text-gray-700 text-sm">Agregar fotos de producto</span>
          <input
            type="file"
            id="image"
            name="image"
            multiple
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <input
          type="number"
          name="price"
          placeholder="Precio de venta"
          value={product.price}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />

        <input
          type="number"
          name="buyPrice"
          placeholder="Precio de compra"
          value={product.buyPrice}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
        />

        <button
          type="submit"
          className="bg-purple-800 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Crear producto
        </button>
      </form>

      <label className="mt-4 flex items-center text-black">
        <input
          type="checkbox"
          checked={createAnother}
          onChange={() => setCreateAnother(!createAnother)}
          className="mr-2"
        />
        Crear otro producto después de este
      </label>
    </div>
  );
};

export default Create_Product;
