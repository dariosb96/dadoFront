
import React, { useEffect, useRef, useState } from "react";


const uidFallback = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  // --- form state ---
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    color: "",
    buyPrice: "",
    description: "",
    newImages: [],
  });

  const [previewImages, setPreviewImages] = useState([]); // URLs for new main images
  const [existingImages, setExistingImages] = useState([]); // main images from backend
  const [imagesToDelete, setImagesToDelete] = useState([]);


  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);
 const createdObjectUrlsRef = useRef(new Set());

  const initializedForProductRef = useRef(null);

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      createdObjectUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      initializedForProductRef.current = null;
      return;
    }

    const productId = product?.id ?? null;
    if (initializedForProductRef.current === productId) {
      return;
    }
    initializedForProductRef.current = productId;

    setForm({
      name: product?.name ?? "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      color: product?.color?? "",
      buyPrice: product?.buyPrice ?? "",
      description: product?.description ?? "",
      newImages: [],
    });


    previewImages.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
      createdObjectUrlsRef.current.delete(u);
    });
    setPreviewImages([]);
    setImagesToDelete([]);
    setExistingImages(product?.images ? deepClone(product.images) : []);

    // initialize variants — deep clone images so no shared references
    const initVariants = (product?.variants || []).map((v) => ({
      uid: v.id ? String(v.id) : uidFallback(),
      id: v.id ?? null,
      color: v.color ?? "",
      size: v.size ?? "",
      stock: v.stock ?? 0,
      price: v.price ?? "",
      buyPrice: v.buyPrice ?? "",
      existingImages: v.images ? deepClone(v.images) : [], // each img: {id, public_id?, url}
      newImages: [], // File[]
      previewUrls: [], // object URLs mapping to newImages order
      removedExistingImageIds: [], // ids to delete on save
    }));
    setVariants(initVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id]);

  const updateFormField = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const updateVariantByUid = (uid, updater) => {
    setVariants((prev) => prev.map((v) => (v.uid === uid ? updater(v) : v)));
  };


  const handleMainImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = files.map((f) => {
      const u = URL.createObjectURL(f);
      createdObjectUrlsRef.current.add(u);
      return u;
    });
    setForm((p) => ({ ...p, newImages: [...(p.newImages || []), ...files] }));
    setPreviewImages((p) => [...p, ...urls]);

    e.target.value = "";
  };

  const removeNewMainImage = (index) => {
    setForm((p) => {
      const arr = [...(p.newImages || [])];
      if (index < 0 || index >= arr.length) return p;
      arr.splice(index, 1);
      return { ...p, newImages: arr };
    });

    setPreviewImages((p) => {
      const arr = [...p];
      const [removed] = arr.splice(index, 1);
      if (removed) {
        try {
          URL.revokeObjectURL(removed);
        } catch (e) {}
        createdObjectUrlsRef.current.delete(removed);
      }
      return arr;
    });
  };

  const removeExistingMainImage = (imageIdOrPublicId) => {
    setImagesToDelete((p) => [...p, imageIdOrPublicId]);
    setExistingImages((p) =>
      p.filter((img) => img.id !== imageIdOrPublicId && img.public_id !== imageIdOrPublicId)
    );
  };


  const addVariant = () => {
    const v = {
      uid: uidFallback(),
      id: undefined,
      color: "",
      size: "",
      stock: 0,
      price: "",
      buyPrice: "",
      existingImages: [],
      newImages: [],
      previewUrls: [],
      removedExistingImageIds: [],
    };
    setVariants((prev) => [...prev, v]);
  };

const removeVariantByUid = (uid) => {
  setVariants((prev) => {
    const target = prev.find((p) => p.uid === uid);

    if (target && target.id) {
      setRemovedVariantIds((prevIds) => {
        if (prevIds.includes(target.id)) return prevIds;
        return [...prevIds, target.id];
      });
    }

    if (target?.previewUrls?.length) {
      target.previewUrls.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) {}
        createdObjectUrlsRef.current.delete(u);
      });
    }

    return prev.filter((p) => p.uid !== uid);
  });
};


  const handleVariantFieldChange = (uid, field, value) => {
    updateVariantByUid(uid, (v) => ({ ...v, [field]: value }));
  };

  const handleVariantImagesChange = (uid, fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    const urls = files.map((f) => {
      const u = URL.createObjectURL(f);
      createdObjectUrlsRef.current.add(u);
      return u;
    });

    updateVariantByUid(uid, (v) => ({
      ...v,
      newImages: [...(v.newImages || []), ...files],
      previewUrls: [...(v.previewUrls || []), ...urls],
    }));

    // Note: caller should clear input value if desired. We'll not mutate the DOM here.
  };

  const removeVariantNewImage = (uid, newIndex) => {
    updateVariantByUid(uid, (v) => {
      const newImgs = [...(v.newImages || [])];
      const newPrevs = [...(v.previewUrls || [])];
      if (newIndex < 0 || newIndex >= newImgs.length) return v;
      const [removedUrl] = newPrevs.splice(newIndex, 1);
      newImgs.splice(newIndex, 1);
      if (removedUrl) {
        try {
          URL.revokeObjectURL(removedUrl);
        } catch (e) {}
        createdObjectUrlsRef.current.delete(removedUrl);
      }
      return { ...v, newImages: newImgs, previewUrls: newPrevs };
    });
  };

  const removeVariantExistingImage = (uid, imageIdOrPublicId) => {
    updateVariantByUid(uid, (v) => ({
      ...v,
      existingImages: (v.existingImages || []).filter(
        (img) => img.id !== imageIdOrPublicId && img.public_id !== imageIdOrPublicId
      ),
      removedExistingImageIds: [...(v.removedExistingImageIds || []), imageIdOrPublicId],
    }));
  };

  const getVariantPreviewsCombined = (v) => {
    const existingUrls = (v.existingImages || []).map((img) => img.url);
    const news = v.previewUrls || [];
    return { combined: [...existingUrls, ...news], existingCount: existingUrls.length };
  };

  // --- submit ---
const handleSubmit = (e) => {
  e.preventDefault();
  const data = new FormData();

  // --- producto principal ---
  data.append("name", form.name);
  data.append("price", form.price);
  data.append("stock", String(form.stock ?? ""));
  data.append("color", String(form.color ?? ""));
  data.append("buyPrice", form.buyPrice ?? "");
  data.append("description", form.description ?? "");
  (form.newImages || []).forEach(f => data.append("images", f));
  (imagesToDelete || []).forEach(id => data.append("imagesToDelete", id));

  // --- variantes ---
  const variantsPayload = variants.map(v => ({
    uid: v.uid,
    id: v.id || null,
    color: v.color || "",
    size: v.size || null,
    stock: v.stock ?? 0,
    price: v.price === "" ? null : v.price,
    buyPrice: v.buyPrice === "" ? null : v.buyPrice,
    removedImageIds: v.removedExistingImageIds || [],
    toRemove: v.toRemove || false, // marcar variantes a eliminar
  }));

  data.append("variants", JSON.stringify(variantsPayload));

  variants.forEach(v => {
    if (v.newImages && v.newImages.length > 0) {
      v.newImages.forEach(f => data.append(`variantImages_${v.uid}`, f));
    }
  });

  if (removedVariantIds.length) {
    data.append("removedVariantIds", JSON.stringify(removedVariantIds));
  }

for (let [key, value] of data.entries()) {

}
  onSave(product?.id, data);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
      <div className="flex items-center justify-center min-h-full">
        <div className="bg-black  rounded-lg w-full max-w-4xl max-h-[90vh] p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Editar producto</h2>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* PRODUCT FIELDS */}
            <div className="grid grid-cols-1 gap-3">
              <input type="text" name="name" value={form.name} onChange={(e) => updateFormField("name", e.target.value)} placeholder="Nombre" className="w-full p-2 border rounded" />
              <input type="text" name="color" value={form.color} onChange={(e) => updateFormField("color", e.target.value)} placeholder="color" className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <input type="number" name="price" value={form.price} onChange={(e) => updateFormField("price", e.target.value)} placeholder="Precio" className="w-1/3 p-2 border rounded" />
                <input type="number" name="buyPrice" value={form.buyPrice} onChange={(e) => updateFormField("buyPrice", e.target.value)} placeholder="Precio de compra" className="w-1/3 p-2 border rounded" />
                <input type="number" name="stock" value={form.stock} onChange={(e) => updateFormField("stock", e.target.value)} placeholder="Stock" className="w-1/3 p-2 border rounded" />
              </div>
              <textarea name="description" value={form.description} onChange={(e) => updateFormField("description", e.target.value)} placeholder="Descripción" className="w-full p-2 border rounded" />
            </div>

            {/* MAIN IMAGES */}
            <div>
              <label className="block text-sm mb-1">Imágenes actuales</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingImages.map((img) => (
                  <div key={img.id || img.public_id} className="relative">
                    <img src={img.url} alt="existing" className="w-full h-28 object-cover rounded" />
                    <button type="button" onClick={() => removeExistingMainImage(img.id || img.public_id)} className="absolute top-1.5 right-1.5 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">X</button>
                  </div>
                ))}
              </div>

              <label className="block text-sm mb-1">Agregar nuevas imágenes principales</label>
              <input key={"main-file-input-" + (product?.id ?? "new")} type="file" multiple name="newImages" onChange={handleMainImagesChange} accept="image/*" />
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previewImages.map((src, i) => (
                    <div key={src + "_" + i} className="relative">
                      <img src={src} alt={`preview-${i}`} className="w-full h-28 object-cover rounded" />
                      <button type="button" onClick={() => removeNewMainImage(i)} className="absolute top-1.5 right-1.5 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VARIANTS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variantes</h3>
                <button type="button" onClick={addVariant} className="bg-blue-600 text-white px-3 py-1 rounded">+ Agregar variante</button>
              </div>

              <div className="space-y-3">
                {variants.map((vv) => {
                  const { combined, existingCount } = getVariantPreviewsCombined(vv);
                  return (
                    <div key={vv.uid} className="border p-3 rounded bg-gray-50 relative">
                      <button type="button" onClick={() => removeVariantByUid(vv.uid)} className="absolute top-2 right-2 text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-xs">Eliminar</button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                        <input type="text" placeholder="Color" value={vv.color} onChange={(e) => handleVariantFieldChange(vv.uid, "color", e.target.value)} className="p-2 border rounded" />
                        <input type="text" placeholder="Talla" value={vv.size || ""} onChange={(e) => handleVariantFieldChange(vv.uid, "size", e.target.value)} className="p-2 border rounded" />
                        <input type="number" placeholder="Stock" value={vv.stock} onChange={(e) => handleVariantFieldChange(vv.uid, "stock", e.target.value)} className="p-2 border rounded" />
                        <input type="number" placeholder="Precio (opcional)" value={vv.price || ""} onChange={(e) => handleVariantFieldChange(vv.uid, "price", e.target.value)} className="p-2 border rounded" />
                        <input type="number" placeholder="Precio de compra (opcional)" value={vv.buyPrice || ""} onChange={(e) => handleVariantFieldChange(vv.uid, "buyPrice", e.target.value)} className="p-2 border rounded" />
                      </div>

                      {/* file input for variant (note unique key so DOM resets if uid changes) */}
                      <input key={"variant-file-" + vv.uid} type="file" multiple onChange={(e) => handleVariantImagesChange(vv.uid, e.target.files)} accept="image/*" />

                      {combined.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {combined.map((src, i) => {
                            const isExisting = i < existingCount;
                            return (
                              <div key={src + "_" + i} className="relative">
                                <img src={src} alt={`vprev-${i}`} className="w-20 h-20 object-cover rounded" />
                                {isExisting ? (
                                  <button type="button" onClick={() => removeVariantExistingImage(vv.uid, vv.existingImages[i]?.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs">X</button>
                                ) : (
                                  <button type="button" onClick={() => removeVariantNewImage(vv.uid, i - existingCount)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs">X</button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">Cancelar</button>
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
