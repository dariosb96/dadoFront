import React, { useState, useEffect } from "react";

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: null, // nuevo campo
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        image: null, // no cargamos la imagen como File, solo el preview
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }

    onSave(product.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar producto</h2>
        <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full p-2 border rounded"
          />

          {/* Imagen */}
          <div>
            <label className="block text-sm mb-1">Imagen</label>
            {product.image && !formData.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="preview"
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <input type="file" name="image" onChange={handleChange} accept="image/*" />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
