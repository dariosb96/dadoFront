import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../Redux/actions/Products/get_categories";
import { exportCatalogPDF } from "../Redux/actions/Products/export_pdf";
import { Link2, FileDown, Copy, ExternalLink, QrCode, X, Check, Tag } from "lucide-react";

const MyCatalogLink = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { categories } = useSelector((state) => state.categories || {});

  const [tab, setTab] = React.useState("link");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [showBusinessOnLink, setShowBusinessOnLink] = React.useState(false);
  const [showPhoneOnLink, setShowPhoneOnLink] = React.useState(false);
  const [includeBusinessName, setIncludeBusinessName] = React.useState(true);
  const [includeOwnerName, setIncludeOwnerName] = React.useState(true);
  const [includePhone, setIncludePhone] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (user?.id) dispatch(getCategories(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
      Cargando...
    </div>
  );

  const baseUrl = `${window.location.origin}/catalog/${user.id}`;
  const linkParams = new URLSearchParams();
  if (selectedCategory) linkParams.append("category", selectedCategory);
  if (showBusinessOnLink) linkParams.append("showBusiness", "1");
  if (showPhoneOnLink) linkParams.append("showPhone", "1");
  const catalogUrl = linkParams.toString() ? `${baseUrl}?${linkParams}` : baseUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(catalogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    dispatch(exportCatalogPDF(user.id, {
      includeBusinessName, includeOwnerName, includePhone,
      selectedCategories: selectedCategory ? [selectedCategory] : [],
    }));
  };

  const Toggle = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={onChange}
        style={{
          width: 36, height: 20, borderRadius: 999, flexShrink: 0,
          background: checked ? '#7c3aed' : 'rgba(255,255,255,0.08)',
          border: checked ? '1px solid #9333ea' : '1px solid rgba(255,255,255,0.1)',
          position: 'relative', transition: 'all 0.2s', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: checked ? '#fff' : 'rgba(255,255,255,0.3)',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>
      <span style={{ fontSize: 13, color: '#9ca3af' }}>{label}</span>
    </label>
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        dir="ltr"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 520,
          maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          boxShadow: '0 0 0 1px rgba(124,58,237,0.1), 0 32px 64px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Franja top */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed)', flexShrink: 0 }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Link2 size={14} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f3f4f6', margin: 0 }}>
                Tu catálogo público
              </p>
              <p style={{ fontSize: 11, color: '#6b7280', margin: '1px 0 0' }}>
                {user?.businessName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6b7280', cursor: 'pointer',
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}>
          {[
            { id: 'link', label: 'Enlace público', icon: Link2 },
            { id: 'pdf',  label: 'Descargar PDF',  icon: FileDown },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '8px 12px', borderRadius: 10, border: 'none',
                cursor: 'pointer', fontSize: 12, fontWeight: 500,
                transition: 'all 0.15s',
                background: tab === id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                color: tab === id ? '#c4b5fd' : '#6b7280',
                boxShadow: tab === id ? 'inset 0 0 0 1px rgba(124,58,237,0.3)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Scroll body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Filtro categoría */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              <Tag size={11} /> Filtrar categoría
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%', appearance: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: '10px 36px 10px 14px',
                  color: '#d1d5db', fontSize: 13, cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="" style={{ background: '#1c1c1e' }}>Todas las categorías</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id} style={{ background: '#1c1c1e' }}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
                ▾
              </div>
            </div>
          </div>

          {/* TAB: ENLACE */}
          {tab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Opciones toggle */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                  Opciones visibles
                </p>
                <Toggle checked={showBusinessOnLink} onChange={() => setShowBusinessOnLink(!showBusinessOnLink)} label="Nombre del negocio" />
                <Toggle checked={showPhoneOnLink} onChange={() => setShowPhoneOnLink(!showPhoneOnLink)} label="Teléfono de contacto" />
              </div>

              {/* URL */}
              <div>
                <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Enlace generado
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <a
                    href={catalogUrl} target="_blank" rel="noreferrer"
                    style={{
                      flex: 1, padding: '10px 14px',
                      fontSize: 12, color: '#818cf8',
                      wordBreak: 'break-all', lineHeight: 1.5,
                      textDecoration: 'none',
                    }}
                  >
                    {catalogUrl}
                  </a>
                  <a
                    href={catalogUrl} target="_blank" rel="noreferrer"
                    style={{
                      padding: '10px 12px', color: '#6b7280',
                      borderLeft: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
                    background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(124,58,237,0.12)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.25)' : 'rgba(124,58,237,0.25)'}`,
                    borderRadius: 10, padding: '8px 16px',
                    color: copied ? '#4ade80' : '#c4b5fd',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copiado' : 'Copiar enlace'}
                </button>
              </div>

              {/* QR */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  background: '#fff', borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 0 0 1px rgba(124,58,237,0.15), 0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  <QRCodeCanvas value={catalogUrl} size={140} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 11 }}>
                  <QrCode size={11} />
                  Escanea para abrir el catálogo
                </div>
              </div>

            </div>
          )}

          {/* TAB: PDF */}
          {tab === 'pdf' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                  Información a incluir
                </p>
                <Toggle checked={includeBusinessName} onChange={() => setIncludeBusinessName(!includeBusinessName)} label="Nombre del negocio" />
                <Toggle checked={includeOwnerName}   onChange={() => setIncludeOwnerName(!includeOwnerName)}   label="Nombre del propietario" />
                <Toggle checked={includePhone}        onChange={() => setIncludePhone(!includePhone)}            label="Teléfono de contacto" />
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '13px 0', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg,#7c3aed,#9333ea)',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <FileDown size={16} />
                Descargar PDF
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyCatalogLink;