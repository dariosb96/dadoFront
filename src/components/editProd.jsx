import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const uidFallback = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const deepClone = (obj) => JSON.parse(JSON.stringify(obj || {}));

// Inyecta CSS crítico una vez — resuelve vh en iOS Safari y scroll en mobile
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
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .modal-box {
      background: #18181b;
      width: 100%;
      max-width: 64rem;
      border-radius: 0.75rem;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      /* Usar dvh cuando esté disponible (iOS 15.4+), caer en svh, luego vh con offset */
      max-height: 80vh;
      max-height: 80dvh;
      overflow: hidden;
    }
    .modal-header {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #3f3f46;
      background: #27272a;
      border-radius: 0.75rem 0.75rem 0 0;
    }
    .modal-body {
      flex: 1;
      /* min-h-0 es CRÍTICO para que overflow-y funcione dentro de flex */
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      padding: 1.5rem;
    }
    .modal-footer {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #3f3f46;
      background: #27272a;
      border-radius: 0 0 0.75rem 0.75rem;
    }
    /* Mobile: reducir padding y usar más altura disponible */
    @media (max-width: 640px) {
      .modal-overlay {
        padding: 0;
        align-items: flex-end;
      }
      .modal-box {
        max-height: 92vh;
        max-height: 92dvh;
        border-radius: 1rem 1rem 0 0;
        max-width: 100%;
      }
      .modal-header {
        border-radius: 1rem 1rem 0 0;
      }
      .modal-footer {
        border-radius: 0;
        /* Espacio extra para el home indicator en iPhone */
        padding-bottom: max(1rem, env(safe-area-inset-bottom));
      }
    }
  `;
  document.head.appendChild(style);
};

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "", price: "", stock: "", color: "", buyPrice: "", description: "", newImages: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);
  const createdObjectUrlsRef = useRef(new Set());
  const initializedForProductRef = useRef(null);

  useEffect(() => { injectModalStyles(); }, []);

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

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) {}
      });
      createdObjectUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) { initializedForProductRef.current = null; return; }
    const productId = product?.id ?? null;
    if (initializedForProductRef.current === productId) return;
    initializedForProductRef.current = productId;

    setForm({
      name: product?.name ?? "", price: product?.price ?? "", stock: product?.stock ?? "",
      color: product?.color ?? "", buyPrice: product?.buyPrice ?? "",
      description: product?.description ?? "", newImages: [],
    });
    previewImages.forEach((u) => {
      try { URL.revokeObjectURL(u); } catch (e) {}
      createdObjectUrlsRef.current.delete(u);
    });
    setPreviewImages([]);
    setImagesToDelete([]);
    setExistingImages(product?.images ? deepClone(product.images) : []);
    setVariants((product?.variants || []).map((v) => ({
      uid: v.id ? String(v.id) : uidFallback(),
      id: v.id ?? null, color: v.color ?? "", size: v.size ?? "", stock: v.stock ?? 0,
      price: v.price ?? "", buyPrice: v.buyPrice ?? "",
      existingImages: v.images ? deepClone(v.images) : [],
      newImages: [], previewUrls: [], removedExistingImageIds: [],
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?.id]);

  const updateFormField = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const updateVariantByUid = (uid, updater) =>
    setVariants((prev) => prev.map((v) => (v.uid === uid ? updater(v) : v)));

  const handleMainImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = files.map((f) => { const u = URL.createObjectURL(f); createdObjectUrlsRef.current.add(u); return u; });
    setForm((p) => ({ ...p, newImages: [...(p.newImages || []), ...files] }));
    setPreviewImages((p) => [...p, ...urls]);
    e.target.value = "";
  };

  const removeNewMainImage = (index) => {
    setForm((p) => { const arr = [...(p.newImages || [])]; arr.splice(index, 1); return { ...p, newImages: arr }; });
    setPreviewImages((p) => {
      const arr = [...p];
      const [removed] = arr.splice(index, 1);
      if (removed) { try { URL.revokeObjectURL(removed); } catch (e) {} createdObjectUrlsRef.current.delete(removed); }
      return arr;
    });
  };

  const removeExistingMainImage = (id) => {
    setImagesToDelete((p) => [...p, id]);
    setExistingImages((p) => p.filter((img) => img.id !== id && img.public_id !== id));
  };

  const addVariant = () => setVariants((prev) => [...prev, {
    uid: uidFallback(), id: undefined, color: "", size: "", stock: 0, price: "", buyPrice: "",
    existingImages: [], newImages: [], previewUrls: [], removedExistingImageIds: [],
  }]);

  const removeVariantByUid = (uid) => {
    setVariants((prev) => {
      const target = prev.find((p) => p.uid === uid);
      if (target?.id) setRemovedVariantIds((ids) => ids.includes(target.id) ? ids : [...ids, target.id]);
      target?.previewUrls?.forEach((u) => { try { URL.revokeObjectURL(u); } catch (e) {} createdObjectUrlsRef.current.delete(u); });
      return prev.filter((p) => p.uid !== uid);
    });
  };

  const handleVariantImagesChange = (uid, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const urls = files.map((f) => { const u = URL.createObjectURL(f); createdObjectUrlsRef.current.add(u); return u; });
    updateVariantByUid(uid, (v) => ({
      ...v, newImages: [...(v.newImages || []), ...files], previewUrls: [...(v.previewUrls || []), ...urls],
    }));
  };

  const removeVariantNewImage = (uid, idx) => {
    updateVariantByUid(uid, (v) => {
      const imgs = [...(v.newImages || [])], prevs = [...(v.previewUrls || [])];
      if (idx < 0 || idx >= imgs.length) return v;
      const [removed] = prevs.splice(idx, 1);
      imgs.splice(idx, 1);
      if (removed) { try { URL.revokeObjectURL(removed); } catch (e) {} createdObjectUrlsRef.current.delete(removed); }
      return { ...v, newImages: imgs, previewUrls: prevs };
    });
  };

  const removeVariantExistingImage = (uid, id) => {
    updateVariantByUid(uid, (v) => ({
      ...v,
      existingImages: (v.existingImages || []).filter((img) => img.id !== id && img.public_id !== id),
      removedExistingImageIds: [...(v.removedExistingImageIds || []), id],
    }));
  };

  const getVariantPreviewsCombined = (v) => {
    const existingUrls = (v.existingImages || []).map((img) => img.url);
    return { combined: [...existingUrls, ...(v.previewUrls || [])], existingCount: existingUrls.length };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name); data.append("price", form.price);
    data.append("stock", String(form.stock ?? "")); data.append("color", String(form.color ?? ""));
    data.append("buyPrice", form.buyPrice ?? ""); data.append("description", form.description ?? "");
    (form.newImages || []).forEach((f) => data.append("images", f));
    (imagesToDelete || []).forEach((id) => data.append("imagesToDelete", id));
    data.append("variants", JSON.stringify(variants.map((v) => ({
      uid: v.uid, id: v.id || null, color: v.color || "", size: v.size || null,
      stock: v.stock ?? 0, price: v.price === "" ? null : v.price,
      buyPrice: v.buyPrice === "" ? null : v.buyPrice,
      removedImageIds: v.removedExistingImageIds || [], toRemove: v.toRemove || false,
    }))));
    variants.forEach((v) => v.newImages?.forEach((f) => data.append(`variantImages_${v.uid}`, f)));
    if (removedVariantIds.length) data.append("removedVariantIds", JSON.stringify(removedVariantIds));
    onSave(product?.id, data);
  };

  if (!isOpen) return null;

  const ImageBox = ({ src, onRemove, small }) => (
    <div style={{ position: "relative", width: small ? 64 : "100%", height: small ? 64 : 96, flexShrink: 0 }}>
      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: "absolute", top: 4, right: 4, width: 20, height: 20,
          background: "#dc2626", border: "none", borderRadius: "50%",
          color: "white", fontSize: 10, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
        }}
      >✕</button>
    </div>
  );

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
            Editar producto
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%", background: "#dc2626",
              border: "none", color: "white", cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, padding: 0,
            }}
          >✕</button>
        </div>

        {/* BODY — este div es el que scrollea */}
        <form
          onSubmit={handleSubmit}
          className="modal-body"
          encType="multipart/form-data"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* CAMPOS PRINCIPALES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input type="text" value={form.name} onChange={(e) => updateFormField("name", e.target.value)} placeholder="Nombre" className="input" />
              <input type="text" value={form.color} onChange={(e) => updateFormField("color", e.target.value)} placeholder="Color" className="input" />
              <input type="number" value={form.price} onChange={(e) => updateFormField("price", e.target.value)} placeholder="Precio" className="input" />
              <input type="number" value={form.buyPrice} onChange={(e) => updateFormField("buyPrice", e.target.value)} placeholder="Compra" className="input" />
              <input type="number" value={form.stock} onChange={(e) => updateFormField("stock", e.target.value)} placeholder="Stock" className="input" />
              <textarea value={form.description} onChange={(e) => updateFormField("description", e.target.value)} placeholder="Descripción" className="input md:col-span-2" />
            </div>

            {/* IMÁGENES PRINCIPALES */}
            <div>
              <p className="label">Imágenes</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {existingImages.map((img) => (
                  <ImageBox key={img.id} src={img.url} onRemove={() => removeExistingMainImage(img.id || img.public_id)} />
                ))}
                {previewImages.map((src, i) => (
                  <ImageBox key={src} src={src} onRemove={() => removeNewMainImage(i)} />
                ))}
              </div>
              <input type="file" multiple onChange={handleMainImagesChange} className="mt-3 text-sm text-white" accept="image/*" />
            </div>

            {/* VARIANTES */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ color: "white", fontWeight: 600, margin: 0 }}>Variantes</h3>
                <button type="button" onClick={addVariant} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                  + Agregar
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {variants.map((vv) => {
                  const { combined, existingCount } = getVariantPreviewsCombined(vv);
                  return (
                    <div key={vv.uid} style={{ background: "#3f3f46", padding: "1rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#a1a1aa", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Variante
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariantByUid(vv.uid)}
                          style={{ background: "#dc2626", border: "none", color: "white", fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: 4, cursor: "pointer" }}
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <input placeholder="Color" value={vv.color} onChange={(e) => updateVariantByUid(vv.uid, (v) => ({ ...v, color: e.target.value }))} className="input" />
                        <input placeholder="Talla" value={vv.size || ""} onChange={(e) => updateVariantByUid(vv.uid, (v) => ({ ...v, size: e.target.value }))} className="input" />
                        <input type="number" placeholder="Stock" value={vv.stock} onChange={(e) => updateVariantByUid(vv.uid, (v) => ({ ...v, stock: e.target.value }))} className="input" />
                        <input type="number" placeholder="Precio" value={vv.price || ""} onChange={(e) => updateVariantByUid(vv.uid, (v) => ({ ...v, price: e.target.value }))} className="input" />
                        <input type="number" placeholder="Compra" value={vv.buyPrice || ""} onChange={(e) => updateVariantByUid(vv.uid, (v) => ({ ...v, buyPrice: e.target.value }))} className="input" />
                      </div>

                      <input type="file" multiple onChange={(e) => handleVariantImagesChange(vv.uid, e.target.files)} className="text-sm text-white" />

                      {combined.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {combined.map((src, i) => {
                            const isExisting = i < existingCount;
                            return (
                              <ImageBox
                                key={src + i}
                                src={src}
                                small
                                onRemove={() =>
                                  isExisting
                                    ? removeVariantExistingImage(vv.uid, vv.existingImages[i]?.id)
                                    : removeVariantNewImage(vv.uid, i - existingCount)
                                }
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </form>

        {/* FOOTER */}
        <div className="modal-footer">
          <button onClick={onClose} style={{ background: "#9ca3af", border: "none", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{ background: "#16a34a", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer" }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditProductModal;