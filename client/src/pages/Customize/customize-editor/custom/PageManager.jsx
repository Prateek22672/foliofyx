// src/pages/Customize/customize-editor/custom/PageManager.jsx
// Left-side panel tab: manage pages (add, rename, reorder, delete, set type).

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, FileText, Home, Check, X, Copy, ChevronDown } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { createPage, defaultCustomLayout } from "../../../Templates/Custom/constants";

const PAGE_TYPES = [
  { value: "page",       label: "Standard Page", icon: "📄" },
  { value: "landing",    label: "Landing Page",  icon: "🚀" },
  { value: "blog",       label: "Blog Post",     icon: "✍️" },
  { value: "product",    label: "Product Page",  icon: "🛍" },
  { value: "contact",    label: "Contact",       icon: "✉️" },
  { value: "about",      label: "About Us",      icon: "👥" },
  { value: "portfolio",  label: "Portfolio",     icon: "🎨" },
  { value: "pricing",    label: "Pricing",       icon: "💰" },
  { value: "services",   label: "Services",      icon: "⚙️" },
  { value: "properties", label: "Properties",    icon: "🏠" },
  { value: "faq",        label: "FAQ",           icon: "❓" },
  { value: "thankyou",   label: "Thank You",     icon: "🙏" },
];

function getLayout(pd) {
  return pd?.customLayout ?? defaultCustomLayout();
}

function PageManager() {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const layout = getLayout(portfolioData);
  const { pages, activePage } = layout;

  const [renamingId, setRenamingId] = useState(null);
  const [renameVal,  setRenameVal]  = useState("");
  const [dragOver,   setDragOver]   = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [showTypeFor, setShowTypeFor] = useState(null);

  const updateLayout = (patch) => {
    setPortfolioData(prev => ({
      ...prev,
      customLayout: { ...getLayout(prev), ...patch },
    }));
  };

  const addPage = (type = "page") => {
    const typeInfo = PAGE_TYPES.find(t => t.value === type) || PAGE_TYPES[0];
    const newPage = createPage(`${typeInfo.label} ${pages.length + 1}`, type);
    updateLayout({ pages: [...pages, newPage], activePage: newPage.id });
  };

  const duplicatePage = (id) => {
    const src = pages.find(p => p.id === id);
    if (!src) return;
    const copy = {
      ...src,
      id: `page_${Date.now()}`,
      name: `${src.name} (Copy)`,
      slug: `${src.slug}-copy`,
    };
    const idx = pages.findIndex(p => p.id === id);
    const next = [...pages.slice(0, idx + 1), copy, ...pages.slice(idx + 1)];
    updateLayout({ pages: next, activePage: copy.id });
  };

  const deletePage = (id) => {
    if (pages.length <= 1) return;
    const next = pages.filter(p => p.id !== id);
    updateLayout({ pages: next, activePage: activePage === id ? next[0].id : activePage });
  };

  const commitRename = (id) => {
    if (!renameVal.trim()) { setRenamingId(null); return; }
    const slug = `/${renameVal.trim().toLowerCase().replace(/\s+/g, "-")}`;
    updateLayout({
      pages: pages.map(p => p.id === id ? { ...p, name: renameVal.trim(), slug } : p),
    });
    setRenamingId(null);
  };

  // ── Drag reorder ──────────────────────────────────────────────────────────
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("page-id", id);
    setDraggingId(id);
  };

  const onDrop = (e, targetId) => {
    e.preventDefault();
    const srcId = e.dataTransfer.getData("page-id");
    if (!srcId || srcId === targetId) { setDragOver(null); setDraggingId(null); return; }
    const srcIdx = pages.findIndex(p => p.id === srcId);
    const tgtIdx = pages.findIndex(p => p.id === targetId);
    const next = [...pages];
    const [moved] = next.splice(srcIdx, 1);
    next.splice(tgtIdx, 0, moved);
    updateLayout({ pages: next });
    setDragOver(null);
    setDraggingId(null);
  };

  const setPageType = (id, type) => {
    updateLayout({ pages: pages.map(p => p.id === id ? { ...p, pageType: type } : p) });
    setShowTypeFor(null);
  };

  return (
    <div style={{ padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Pages ({pages.length})
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={() => addPage("page")}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 8, border: "1px solid #6366f1",
              background: "#f0f0ff", fontSize: 11, fontWeight: 700, color: "#4f46e5",
              cursor: "pointer",
            }}
          >
            <Plus size={12} /> Add Page
          </button>
        </div>
      </div>

      {/* ── Quick-add page type pills ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
        {PAGE_TYPES.slice(0, 6).map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => addPage(value)}
            style={{
              display: "flex", alignItems: "center", gap: 3,
              padding: "3px 8px", borderRadius: 20, border: "1px solid #e5e7eb",
              background: "#fafafa", fontSize: 10, fontWeight: 600, color: "#374151",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#f0f0ff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── Page list ── */}
      {pages.map((page, idx) => {
        const isActive   = page.id === activePage;
        const isRenaming = renamingId === page.id;
        const isDraggingThis = draggingId === page.id;
        const isDragOver = dragOver === page.id;
        const typeInfo   = PAGE_TYPES.find(t => t.value === (page.pageType || "page")) || PAGE_TYPES[0];

        return (
          <div
            key={page.id}
            draggable
            onDragStart={e => onDragStart(e, page.id)}
            onDragOver={e => { e.preventDefault(); setDragOver(page.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => onDrop(e, page.id)}
            onDragEnd={() => { setDraggingId(null); setDragOver(null); }}
            onClick={() => !isRenaming && setPortfolioData(prev => ({
              ...prev, customLayout: { ...getLayout(prev), activePage: page.id }
            }))}
            style={{
              display: "flex", flexDirection: "column",
              border: isActive
                ? "1.5px solid #6366f1"
                : isDragOver ? "1.5px dashed #6366f1" : "1px solid #e5e7eb",
              borderRadius: 10,
              background: isActive ? "#f0f0ff" : isDragOver ? "#f5f3ff" : "#fff",
              opacity: isDraggingThis ? 0.4 : 1,
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: isActive ? "0 2px 8px rgba(99,102,241,0.12)" : "none",
            }}
          >
            {/* Main row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
              <GripVertical size={13} color="#d1d5db" style={{ flexShrink: 0, cursor: "grab" }} />

              <span style={{ fontSize: 14, flexShrink: 0 }}>
                {idx === 0 ? "🏠" : typeInfo.icon}
              </span>

              {isRenaming ? (
                <>
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") commitRename(page.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex: 1, border: "1px solid #6366f1", borderRadius: 6,
                      padding: "2px 6px", fontSize: 12, fontWeight: 600, outline: "none",
                    }}
                  />
                  <button type="button" onClick={e => { e.stopPropagation(); commitRename(page.id); }}>
                    <Check size={13} color="#22c55e" />
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); setRenamingId(null); }}>
                    <X size={13} color="#ef4444" />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? "#4f46e5" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      onDoubleClick={e => { e.stopPropagation(); setRenameVal(page.name); setRenamingId(page.id); }}
                    >
                      {page.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {page.slug}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => duplicatePage(page.id)}
                      title="Duplicate page"
                      style={pageActionBtn}
                    >
                      <Copy size={11} />
                    </button>
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deletePage(page.id)}
                        title="Delete page"
                        style={{ ...pageActionBtn, color: "#ef4444" }}
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Page type selector (collapsible) */}
            {isActive && !isRenaming && (
              <div style={{ borderTop: "1px solid #e0e7ff", padding: "6px 10px" }} onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowTypeFor(showTypeFor === page.id ? null : page.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, background: "none",
                    border: "none", cursor: "pointer", fontSize: 10, color: "#6366f1", fontWeight: 600,
                  }}
                >
                  {typeInfo.icon} {typeInfo.label}
                  <ChevronDown size={10} />
                </button>
                {showTypeFor === page.id && (
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 6,
                  }}>
                    {PAGE_TYPES.map(({ value, label, icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPageType(page.id, value)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "4px 6px", borderRadius: 6, border: "1px solid",
                          borderColor: (page.pageType || "page") === value ? "#6366f1" : "#e5e7eb",
                          background: (page.pageType || "page") === value ? "#f0f0ff" : "#fafafa",
                          fontSize: 10, fontWeight: 600,
                          color: (page.pageType || "page") === value ? "#4f46e5" : "#374151",
                          cursor: "pointer",
                        }}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Element count badge */}
            {isActive && (
              <div style={{ padding: "4px 10px 6px" }}>
                <span style={{ fontSize: 9, color: "#9ca3af" }}>
                  {page.elements?.length || 0} element{(page.elements?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Tip ── */}
      <div style={{
        marginTop: 4, padding: "8px 10px",
        background: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb",
        fontSize: 10, color: "#64748b", lineHeight: 1.5,
      }}>
        💡 <strong>Double-click</strong> name to rename · <strong>Drag</strong> to reorder · First page = homepage
      </div>
    </div>
  );
}

const pageActionBtn = {
  background: "none", border: "1px solid #e5e7eb", borderRadius: 5,
  padding: 4, cursor: "pointer", display: "flex", color: "#9ca3af",
  transition: "all 0.15s",
};

export default PageManager;