import React, { useState, useEffect } from "react";

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    buyPrice: "",
    description: "",
    newImages: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        buyPrice: product.buyPrice || "",
        description: product.description || "",
        newImages: [],
      });

      setExistingImages(product.images || []);
      setPreviewImages([]);
      setImagesToDelete([]);
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "newImages" && files.length > 0) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...newFiles],
      }));

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveExistingImage = (public_id) => {
    setImagesToDelete((prev) => [...prev, public_id]);
    setExistingImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  const handleRemoveNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("buyPrice", formData.buyPrice);
    data.append("description", formData.description);

    formData.newImages.forEach((file) => {
      data.append("images", file);
    });

    imagesToDelete.forEach((id) => {
      data.append("imagesToDelete", id);
    });

    onSave(product.id, data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
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
            name="buyPrice"
            value={formData.buyPrice}
            onChange={handleChange}
            placeholder="Precio de compra"
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

          {/* Imágenes existentes */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm mb-1">Imágenes actuales</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url}
                      alt={`img-${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.public_id)}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevas imágenes */}
          <div>
            <label className="block text-sm mb-1">Agregar nuevas imágenes</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="file"
                name="newImages"
                multiple
                onChange={handleChange}
                accept="image/*"
              />
              <span className="text-sm text-gray-600">Agregar más imágenes</span>
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
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
