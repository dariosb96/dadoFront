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

  const { categories } = useSelector((state) => state.categories);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    images: [],
    price: "",
    stock: "",
    buyPrice: "",
    variants: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [createAnother, setCreateAnother] = useState(false);
  const [variantPreviews, setVariantPreviews] = useState([]);

  useEffect(() => {
    dispatch(getCategories(token));
  }, [dispatch, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const newFiles = Array.from(files);
      const combinedFiles = [...product.images, ...newFiles].filter(
        (file, index, self) => index === self.findIndex((f) => f.name === file.name)
      );
      setProduct((prev) => ({ ...prev, images: combinedFiles }));
      setImagePreviews(combinedFiles.map((f) => URL.createObjectURL(f)));
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

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", size: "", stock: "", price: "", buyPrice: "", images: [] }],
    }));
    setVariantPreviews((prev) => [...prev, []]);
  };

  const removeVariant = (index) => {
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    const updatedPreviews = variantPreviews.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
    setVariantPreviews(updatedPreviews);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...product.variants];
    updated[index][field] = value;
    setProduct((prev) => ({ ...prev, variants: updated }));
  };

  const handleVariantImage = (index, files) => {
    const fileArray = Array.from(files);
    const updatedVariants = [...product.variants];
    updatedVariants[index].images = [...(updatedVariants[index].images || []), ...fileArray];
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));

    const updatedPreviews = [...variantPreviews];
    updatedPreviews[index] = [...(updatedPreviews[index] || []), ...fileArray.map((f) => URL.createObjectURL(f))];
    setVariantPreviews(updatedPreviews);
  };

  const handleRemoveVariantImage = (vIndex, imgIndex) => {
    const updatedVariants = [...product.variants];
    updatedVariants[vIndex].images = updatedVariants[vIndex].images.filter((_, i) => i !== imgIndex);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));

    const updatedPreviews = [...variantPreviews];
    updatedPreviews[vIndex] = updatedPreviews[vIndex].filter((_, i) => i !== imgIndex);
    setVariantPreviews(updatedPreviews);
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar campos obligatorios
  if (!product.name || !product.price || !product.stock || !product.buyPrice) {
    toast.error("Faltan campos obligatorios");
    return;
  }

  try {
    let categoryId = product.category;

    // Crear categoría nueva si aplica
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

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", Number(product.price));
    formData.append("buyPrice", Number(product.buyPrice));
    formData.append("stock", Number(product.stock));
    formData.append("categoryId", categoryId);

    // Imágenes principales
    product.images.forEach((file) => formData.append("images", file));

    // Variantes
    const variantsPayload = product.variants.map((v) => ({
      color: v.color || "",
      size: v.size || "",
      stock: v.stock ? Number(v.stock) : 0,
      price: v.price ? Number(v.price) : null, 
      buyPrice: v.buyPrice ? Number(v.buyPrice) : null, 
    }));
    formData.append("variants", JSON.stringify(variantsPayload));


    // Imágenes de variantes
    product.variants.forEach((v, index) => {
      if (v.images && v.images.length > 0) {
        v.images.forEach((file) => {
          formData.append(`variantImages_${index}`, file);
        });
      }
    });

    await dispatch(createProduct(formData, token));
    toast.success("Producto creado con éxito");

    if (createAnother) {
      setProduct({
        name: "",
        category: "",
        description: "",
        images: [],
        price: "",
        stock: "",
        buyPrice: "",
        variants: [],
      });
      setImagePreviews([]);
      setVariantPreviews([]);
    } else {
      setTimeout(() => navigate("/home"), 1200);
    }
  } catch (err) {
    console.error("Error al crear producto:", err);
    toast.error("Error al crear producto");
  }
};


  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-black shadow rounded relative overflow-x-hidden">
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

      <h2 className="text-2xl text-gray-400 font-semibold mb-4 mt-12">Crear nuevo producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* NOMBRE */}
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={product.name}
          onChange={handleChange}
          className="w-full text-white bg-gray-900 border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* CATEGORÍA */}
        {categories.length > 0 && !showNewCategoryInput ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6 space-y-4 md:space-y-0">
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="text-white bg-gray-900 border border-purple-500 rounded-md px-4 py-2 flex-grow"
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
              className="text-purple-600 text-sm font-semibold cursor-pointer hover:underline transition duration-300 whitespace-nowrap"
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
              className="w-full text-white bg-gray-800 border border-gray-300 rounded-lg px-4 py-2"
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

        {/* DESCRIPCIÓN */}
        <textarea
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleChange}
          className="w-full text-white bg-gray-900 border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* IMÁGENES PRINCIPALES */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="images"
            className="bg-purple-800 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer text-center"
          >
            Seleccionar imágenes
          </label>
          <input
            id="images"
            type="file"
            name="images"
            multiple
            onChange={handleChange}
            className="hidden"
            accept="image/*"
          />
          <span className="text-gray-500 text-sm text-center">Agrega fotos del producto</span>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3 mb-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img src={src} alt={`preview-${index}`} className="w-full h-24 object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    title="Eliminar imagen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CAMPOS NUMÉRICOS */}
        <input
          type="number"
          name="price"
          placeholder="Precio de venta"
          value={product.price}
          onChange={handleChange}
          className="w-full text-white bg-gray-900 border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="buyPrice"
          placeholder="Precio de compra"
          value={product.buyPrice}
          onChange={handleChange}
          className="w-full text-white bg-gray-900 border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          className="w-full text-white bg-gray-900 border border-gray-300 rounded-lg px-4 py-2"
        />

        {/* VARIANTES */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-black mb-2">Variantes</h3>

          {product.variants.map((variant, idx) => (
            <div key={idx} className="border p-3 mb-3 rounded bg-gray-50 relative">
             <div className="text-right ">
  <button
    type="button"
    onClick={() => removeVariant(idx)}
    className="mt-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
    title="Eliminar variante"
  >
    Eliminar
  </button>
</div>

              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Talla"
                value={variant.size}
                onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <input
              type="number"
              placeholder="Precio (opcional)"
              value={variant.price || ""}
              onChange={(e) => handleVariantChange(idx, "price", e.target.value ? Number(e.target.value) : "")}
              />
               <input
              type="number"
              placeholder="Precio de compra (opcional)"
              value={variant.buyPrice || ""}
              onChange={(e) => handleVariantChange(idx, "buyPrice", e.target.value ? Number(e.target.value) : "")}
              />

              <label className="block mb-1 font-semibold">Imagenes</label>
              <input
              type="file"
              multiple
              name="variantImages" // TODOS usan el mismo field name
                onChange={(e) => handleVariantImage(idx, e.target.files)}
                className="mb-2"
                accept="image/*"
              />

              {variantPreviews[idx]?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {variantPreviews[idx].map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt={`variant-${idx}-${i}`} className="w-20 h-20 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantImage(idx, i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                        title="Eliminar imagen variante"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            + Agregar variante
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-800 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 transition mt-4"
        >
          Crear producto
        </button>
      </form>

      <label className="mt-4 flex items-center text-gray-300">
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

