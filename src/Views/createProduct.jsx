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

  const { categories, loading } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    buyPrice: "",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [createAnother, setCreateAnother] = useState(false);

  useEffect(() => {
    dispatch(getCategories(token));
  }, [dispatch, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const newFiles = Array.from(files);

      // Evita duplicados por nombre
      const combinedFiles = [...product.images, ...newFiles].filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );

      setProduct((prev) => ({ ...prev, images: combinedFiles }));

      const combinedPreviews = combinedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(combinedPreviews);
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = product.images.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);

    setProduct((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
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
          images: [],
          price: "",
          stock: "",
          buyPrice: "",
          category: "",
        });
        setImagePreviews([]);
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

      <h2 className="text-2xl text-black font-semibold mb-4 mt-12">
        Crear nuevo producto
      </h2>

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6 space-y-4 md:space-y-0">
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

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="images"
            className="bg-purple-800 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition duration-300 text-center"
          >
            Seleccionar imágenes
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleChange}
            className="hidden"
          />
          <span className="text-gray-700 text-sm text-center">
            Agrega fotos del producto
          </span>

{imagePreviews.length > 0 && (
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3 mb-2">
    {imagePreviews.map((src, index) => (
      <div key={index} className="relative">
        <img
          src={src}
          alt={`preview-${index}`}
          className="w-full h-24 object-cover rounded-md border border-gray-300 shadow-sm"
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-700"
          title="Eliminar imagen"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

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
          className="w-full bg-purple-800 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
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
