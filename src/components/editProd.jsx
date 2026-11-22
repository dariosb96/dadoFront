
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const uidFallback = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));

const inputCls =
  "w-full bg-transparent border border-zinc-700 hover:border-zinc-500 focus:border-zinc-300 text-white text-sm rounded-lg px-3 py-2 outline-none transition-colors placeholder-zinc-600";

// COMPONENTES AUXILIARES FUERA DEL MODAL

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
      {label}
    </label>
    {children}
  </div>
);

const AddVariantButton = ({ onAdd }) => (
  <button
    type="button"
    onClick={onAdd}
    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 border border-purple-500 rounded-lg px-4 py-3 transition-colors cursor-pointer"
  >
    <span className="text-lg leading-none">+</span>
    Agregar otra variante
  </button>
);

const ImageThumb = ({ src, onRemove, small }) => (
  <div
    className={`group relative flex-shrink-0 rounded-lg overflow-hidden ${
      small ? "w-16 h-16" : "w-full h-28"
    }`}
  >
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

    <button
      type="button"
      onClick={onRemove}
      className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center bg-black/70 hover:bg-red-600 text-white rounded-full text-[10px] border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
    >
      ✕
    </button>
  </div>
);

// ESTILOS DEL MODAL

const injectModalStyles = () => {
  if (document.getElementById("modal-fix-styles")) return;

  const style = document.createElement("style");
  style.id = "modal-fix-styles";
  style.textContent = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background-color: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .modal-box {
      width: 100%;
      max-width: 56rem;
      display: flex;
      flex-direction: column;
      max-height: 82vh;
      max-height: 82dvh;
      overflow: hidden;
    }

    .modal-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    @media (max-width: 640px) {
      .modal-overlay {
        padding: 0;
        align-items: flex-end;
      }

      .modal-box {
        max-height: 93vh;
        max-height: 93dvh;
        max-width: 100%;
        border-radius: 1.25rem 1.25rem 0 0 !important;
      }

      .modal-header-r {
        border-radius: 1.25rem 1.25rem 0 0 !important;
      }

      .modal-footer-safe {
        padding-bottom: max(1.25rem, env(safe-area-inset-bottom)) !important;
      }
    }
  `;

  document.head.appendChild(style);
};

// MODAL PRINCIPAL

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    color: "",
    buyPrice: "",
    description: "",
    newImages: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);

  const createdObjectUrlsRef = useRef(new Set());
  const initializedForProductRef = useRef(null);

  useEffect(() => {
    injectModalStyles();
  }, []);

  // BLOQUEAR SCROLL DEL BODY

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // LIMPIAR URLS DE IMÁGENES

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      });

      createdObjectUrlsRef.current.clear();
    };
  }, []);

  // INICIALIZAR PRODUCTO

  useEffect(() => {
    if (!isOpen) {
      initializedForProductRef.current = null;
      return;
    }

    const productId = product?.id ?? null;

    if (initializedForProductRef.current === productId) return;

    initializedForProductRef.current = productId;

    setForm({
      name: product?.name ?? "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      color: product?.color ?? "",
      buyPrice: product?.buyPrice ?? "",
      description: product?.description ?? "",
      newImages: [],
    });

    previewImages.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}

      createdObjectUrlsRef.current.delete(url);
    });

    setPreviewImages([]);
    setImagesToDelete([]);
    setRemovedVariantIds([]);

    setExistingImages(
      product?.images ? deepClone(product.images) : []
    );

    setVariants(
      (product?.variants || []).map((v) => ({
        uid: v.id ? String(v.id) : uidFallback(),
        id: v.id ?? null,
        color: v.color ?? "",
        size: v.size ?? "",
        stock: v.stock ?? 0,
        price: v.price ?? "",
        buyPrice: v.buyPrice ?? "",
        existingImages: v.images ? deepClone(v.images) : [],
        newImages: [],
        previewUrls: [],
        removedExistingImageIds: [],
      }))
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id]);

  // ACTUALIZAR CAMPOS PRINCIPALES

  const updateFormField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ACTUALIZAR VARIANTES

  const updateVariantByUid = (uid, updater) => {
    setVariants((prev) =>
      prev.map((v) => (v.uid === uid ? updater(v) : v))
    );
  };

  // IMÁGENES PRINCIPALES

  const handleMainImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const urls = files.map((file) => {
      const url = URL.createObjectURL(file);
      createdObjectUrlsRef.current.add(url);
      return url;
    });

    setForm((prev) => ({
      ...prev,
      newImages: [...(prev.newImages || []), ...files],
    }));

    setPreviewImages((prev) => [...prev, ...urls]);

    e.target.value = "";
  };

  const removeNewMainImage = (index) => {
    setForm((prev) => {
      const arr = [...(prev.newImages || [])];
      arr.splice(index, 1);

      return {
        ...prev,
        newImages: arr,
      };
    });

    setPreviewImages((prev) => {
      const arr = [...prev];
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

  const removeExistingMainImage = (id) => {
    setImagesToDelete((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );

    setExistingImages((prev) =>
      prev.filter(
        (img) => img.id !== id && img.public_id !== id
      )
    );
  };

  // VARIANTES

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        uid: uidFallback(),
        id: null,
        color: "",
        size: "",
        stock: 0,
        price: "",
        buyPrice: "",
        existingImages: [],
        newImages: [],
        previewUrls: [],
        removedExistingImageIds: [],
      },
    ]);
  };

  const removeVariantByUid = (uid) => {
    setVariants((prev) => {
      const target = prev.find((v) => v.uid === uid);

      if (target?.id) {
        setRemovedVariantIds((removed) =>
          removed.includes(target.id)
            ? removed
            : [...removed, target.id]
        );
      }

      if (target?.previewUrls) {
        target.previewUrls.forEach((url) => {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}

          createdObjectUrlsRef.current.delete(url);
        });
      }

      return prev.filter((v) => v.uid !== uid);
    });
  };

  const handleVariantImagesChange = (uid, fileList) => {
    const files = Array.from(fileList || []);

    if (!files.length) return;

    const urls = files.map((file) => {
      const url = URL.createObjectURL(file);
      createdObjectUrlsRef.current.add(url);
      return url;
    });

    updateVariantByUid(uid, (v) => ({
      ...v,
      newImages: [...(v.newImages || []), ...files],
      previewUrls: [...(v.previewUrls || []), ...urls],
    }));
  };

  const removeVariantNewImage = (uid, index) => {
    updateVariantByUid(uid, (v) => {
      const images = [...(v.newImages || [])];
      const previews = [...(v.previewUrls || [])];

      if (index < 0 || index >= images.length) return v;

      const [removed] = previews.splice(index, 1);
      images.splice(index, 1);

      if (removed) {
        try {
          URL.revokeObjectURL(removed);
        } catch (e) {}

        createdObjectUrlsRef.current.delete(removed);
      }

      return {
        ...v,
        newImages: images,
        previewUrls: previews,
      };
    });
  };

  const removeVariantExistingImage = (uid, id) => {
    if (!id) return;

    updateVariantByUid(uid, (v) => ({
      ...v,
      existingImages: (v.existingImages || []).filter(
        (img) => img.id !== id && img.public_id !== id
      ),
      removedExistingImageIds: [
        ...(v.removedExistingImageIds || []).filter(
          (existingId) => existingId !== id
        ),
        id,
      ],
    }));
  };

  const getVariantPreviewsCombined = (variant) => {
    const existingUrls = (variant.existingImages || []).map(
      (img) => img.url
    );

    return {
      combined: [...existingUrls, ...(variant.previewUrls || [])],
      existingCount: existingUrls.length,
    };
  };

  // GUARDAR

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("stock", String(form.stock ?? ""));
    data.append("color", String(form.color ?? ""));
    data.append("buyPrice", form.buyPrice ?? "");
    data.append("description", form.description ?? "");

    (form.newImages || []).forEach((file) => {
      data.append("images", file);
    });

    imagesToDelete.forEach((id) => {
      data.append("imagesToDelete", id);
    });

    data.append(
      "variants",
      JSON.stringify(
        variants.map((v) => ({
          uid: v.uid,
          id: v.id || null,
          color: v.color || "",
          size: v.size || null,
          stock: v.stock ?? 0,
          price: v.price === "" ? null : v.price,
          buyPrice: v.buyPrice === "" ? null : v.buyPrice,
          removedImageIds: v.removedExistingImageIds || [],
          toRemove: false,
        }))
      )
    );

    variants.forEach((v) => {
      (v.newImages || []).forEach((file) => {
        data.append(`variantImages_${v.uid}`, file);
      });
    });

    if (removedVariantIds.length) {
      data.append(
        "removedVariantIds",
        JSON.stringify(removedVariantIds)
      );
    }

    onSave(product?.id, data);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl">

        {/* HEADER */}

        <div className="modal-header-r flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase mb-0.5">
              Producto
            </p>

            <h2 className="text-white text-base font-semibold m-0 leading-none">
              Editar
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border-none cursor-pointer text-sm transition-colors p-0 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* BODY */}

        <form
          id="edit-product-form"
          onSubmit={handleSubmit}
          className="modal-body px-6 py-5"
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-7">

            {/* CAMPOS PRINCIPALES */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Nombre">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  className={inputCls}
                  placeholder="—"
                />
              </Field>

              <Field label="Color">
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => updateFormField("color", e.target.value)}
                  className={inputCls}
                  placeholder="—"
                />
              </Field>

              <Field label="Precio venta">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateFormField("price", e.target.value)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              <Field label="Precio compra">
                <input
                  type="number"
                  value={form.buyPrice}
                  onChange={(e) => updateFormField("buyPrice", e.target.value)}
                  className={inputCls}
                  placeholder="0.00"
                />
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateFormField("stock", e.target.value)}
                  className={inputCls}
                  placeholder="0"
                />
              </Field>

              <div className="col-span-2 md:col-span-3">
                <Field label="Descripción">
                  <textarea
                    value={form.description}
                    onChange={(e) => updateFormField("description", e.target.value)}
                    placeholder="—"
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-zinc-800" />

            {/* IMÁGENES DEL PRODUCTO */}

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                Imágenes del producto
              </p>

              {(existingImages.length > 0 || previewImages.length > 0) && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {existingImages.map((img) => (
                    <ImageThumb
                      key={img.id}
                      src={img.url}
                      onRemove={() =>
                        removeExistingMainImage(img.id || img.public_id)
                      }
                    />
                  ))}

                  {previewImages.map((src, index) => (
                    <ImageThumb
                      key={src}
                      src={src}
                      onRemove={() => removeNewMainImage(index)}
                    />
                  ))}
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors w-fit">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg border border-dashed border-zinc-700 hover:border-zinc-400 text-lg">
                  +
                </span>

                <span>Añadir imágenes</span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMainImagesChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="border-t border-zinc-800" />

            {/* VARIANTES */}

            <div className="flex flex-col gap-4">

              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                  Variantes ({variants.length})
                </p>
              </div>

              <AddVariantButton onAdd={addVariant} />

              {variants.length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-4">
                  Sin variantes. Agrega la primera variante.
                </p>
              )}

              <div className="flex flex-col gap-3">
                {variants.map((vv, index) => {
                  const { combined, existingCount } =
                    getVariantPreviewsCombined(vv);

                  return (
                    <div
                      key={vv.uid}
                      className="border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 bg-zinc-900/50"
                    >

                      {/* CABECERA DE VARIANTE */}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400 font-medium">
                          Variante {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeVariantByUid(vv.uid)}
                          className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-widest font-semibold border-none bg-transparent cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* CAMPOS */}

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <Field label="Color">
                          <input
                            placeholder="—"
                            value={vv.color}
                            onChange={(e) =>
                              updateVariantByUid(vv.uid, (v) => ({
                                ...v,
                                color: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Talla">
                          <input
                            placeholder="—"
                            value={vv.size || ""}
                            onChange={(e) =>
                              updateVariantByUid(vv.uid, (v) => ({
                                ...v,
                                size: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Stock">
                          <input
                            type="number"
                            placeholder="0"
                            value={vv.stock}
                            onChange={(e) =>
                              updateVariantByUid(vv.uid, (v) => ({
                                ...v,
                                stock: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Precio">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={vv.price || ""}
                            onChange={(e) =>
                              updateVariantByUid(vv.uid, (v) => ({
                                ...v,
                                price: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                        </Field>

                        <Field label="Compra">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={vv.buyPrice || ""}
                            onChange={(e) =>
                              updateVariantByUid(vv.uid, (v) => ({
                                ...v,
                                buyPrice: e.target.value,
                              }))
                            }
                            className={inputCls}
                          />
                        </Field>
                      </div>

                      {/* IMÁGENES DE VARIANTE */}

                      <div className="flex flex-col gap-2">
                        {combined.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {combined.map((src, i) => {
                              const isExisting = i < existingCount;

                              return (
                                <ImageThumb
                                  key={src + i}
                                  src={src}
                                  small
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
                                />
                              );
                            })}
                          </div>
                        )}

                        <label className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors w-fit">
                          <span className="w-6 h-6 flex items-center justify-center rounded-md border border-dashed border-zinc-700 text-base">
                            +
                          </span>

                          <span>Añadir imágenes</span>

                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              handleVariantImagesChange(
                                vv.uid,
                                e.target.files
                              );
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <AddVariantButton onAdd={addVariant} />

            </div>

            <div className="h-1" />
          </div>
        </form>

        {/* FOOTER */}

        <div className="modal-footer-safe flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-zinc-800/80">
          <span className="text-xs text-zinc-600">
            {variants.length} variante{variants.length !== 1 ? "s" : ""}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-zinc-400 hover:text-white px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 bg-transparent cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="edit-product-form"
              className="text-sm text-white px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 cursor-pointer transition-colors font-medium"
            >
              Guardar cambios
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default EditProductModal;
