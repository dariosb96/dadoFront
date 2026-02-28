
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
  const ImageBox = ({ src, onRemove, small }) => (
  <div className={`relative ${small ? "w-16 h-16" : "w-full h-24"}`}>
    <img
      src={src}
      className="w-full h-full object-cover rounded-md"
      alt=""
    />

    <button
      type="button"
      onClick={onRemove}
      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
    >
      ✕
    </button>
  </div>
);

return (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-zinc-900 w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 bg-zinc-900 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-white">Editar producto</h2>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-6"
        encType="multipart/form-data"
      >
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            value={form.name}
            onChange={(e) => updateFormField("name", e.target.value)}
            placeholder="Nombre"
            className="input"
          />

          <input
            type="text"
            value={form.color}
            onChange={(e) => updateFormField("color", e.target.value)}
            placeholder="Color"
            className="input"
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) => updateFormField("price", e.target.value)}
            placeholder="Precio"
            className="input"
          />

          <input
            type="number"
            value={form.buyPrice}
            onChange={(e) => updateFormField("buyPrice", e.target.value)}
            placeholder="Compra"
            className="input"
          />

          <input
            type="number"
            value={form.stock}
            onChange={(e) => updateFormField("stock", e.target.value)}
            placeholder="Stock"
            className="input"
          />

          <textarea
            value={form.description}
            onChange={(e) => updateFormField("description", e.target.value)}
            placeholder="Descripción"
            className="input md:col-span-2"
          />
        </div>

        {/* IMÁGENES PRINCIPALES */}
        <div>
          <p className="label">Imágenes</p>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {existingImages.map((img) => (
              <ImageBox
                key={img.id}
                src={img.url}
                onRemove={() =>
                  removeExistingMainImage(img.id || img.public_id)
                }
              />
            ))}

            {previewImages.map((src, i) => (
              <ImageBox
                key={src}
                src={src}
                onRemove={() => removeNewMainImage(i)}
              />
            ))}
          </div>

          <input
            type="file"
            multiple
            onChange={handleMainImagesChange}
            className="mt-3 text-sm text-white"
            accept="image/*"
          />
        </div>

        {/* VARIANTES */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold">Variantes</h3>

            <button
              type="button"
              onClick={addVariant}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((vv) => {
              const { combined, existingCount } =
                getVariantPreviewsCombined(vv);

              return (
                <div
                  key={vv.uid}
                  className="bg-zinc-800 p-4 rounded-lg space-y-3 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeVariantByUid(vv.uid)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <input
                      placeholder="Color"
                      value={vv.color}
                      onChange={(e) =>
                        handleVariantFieldChange(
                          vv.uid,
                          "color",
                          e.target.value
                        )
                      }
                      className="input"
                    />

                    <input
                      placeholder="Talla"
                      value={vv.size || ""}
                      onChange={(e) =>
                        handleVariantFieldChange(
                          vv.uid,
                          "size",
                          e.target.value
                        )
                      }
                      className="input"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={vv.stock}
                      onChange={(e) =>
                        handleVariantFieldChange(
                          vv.uid,
                          "stock",
                          e.target.value
                        )
                      }
                      className="input"
                    />

                    <input
                      type="number"
                      placeholder="Precio"
                      value={vv.price || ""}
                      onChange={(e) =>
                        handleVariantFieldChange(
                          vv.uid,
                          "price",
                          e.target.value
                        )
                      }
                      className="input"
                    />

                    <input
                      type="number"
                      placeholder="Compra"
                      value={vv.buyPrice || ""}
                      onChange={(e) =>
                        handleVariantFieldChange(
                          vv.uid,
                          "buyPrice",
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </div>

                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleVariantImagesChange(vv.uid, e.target.files)
                    }
                    className="text-sm text-white"
                  />

                  <div className="flex flex-wrap gap-2">
                    {combined.map((src, i) => {
                      const isExisting = i < existingCount;

                      return (
                        <ImageBox
                          key={src + i}
                          src={src}
                          onRemove={() =>
                            isExisting
                              ? removeVariantExistingImage(
                                  vv.uid,
                                  vv.existingImages[i]?.id
                                )
                              : removeVariantNewImage(
                                  vv.uid,
                                  i - existingCount
                                )
                          }
                          small
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </form>

      {/* FOOTER */}
      <div className="border-t border-zinc-700 p-4 flex justify-end gap-3 bg-zinc-900 sticky bottom-0">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
);
};

export default EditProductModal;
