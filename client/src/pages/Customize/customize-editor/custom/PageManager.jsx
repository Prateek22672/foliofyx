// src/pages/Customize/customize-editor/custom/PageManager.jsx
// Left-side panel tab: manage pages (add, rename, reorder, delete, set type).

import React, { useState } from "react";
import {
  Plus, Trash2, GripVertical, FileText, Home, Check, X, Copy, ChevronDown,
  Rocket, PenLine, ShoppingBag, Mail, Users, Palette, DollarSign, Wrench,
  Building2, HelpCircle, Heart,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { createPage, defaultCustomLayout } from "../../../Templates/Custom/constants";
import { T, inputStyle, sectionLabelStyle } from "./ui";

const PAGE_TYPES = [
  { value: "page",       label: "Standard Page", Icon: FileText   },
  { value: "landing",    label: "Landing Page",  Icon: Rocket     },
  { value: "blog",       label: "Blog Post",     Icon: PenLine    },
  { value: "product",    label: "Product Page",  Icon: ShoppingBag },
  { value: "contact",    label: "Contact",       Icon: Mail       },
  { value: "about",      label: "About Us",      Icon: Users      },
  { value: "portfolio",  label: "Portfolio",     Icon: Palette    },
  { value: "pricing",    label: "Pricing",       Icon: DollarSign },
  { value: "services",   label: "Services",      Icon: Wrench     },
  { value: "properties", label: "Properties",    Icon: Building2  },
  { value: "faq",        label: "FAQ",           Icon: HelpCircle },
  { value: "thankyou",   label: "Thank You",     Icon: Heart      },
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
    <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={sectionLabelStyle}>
          Pages ({pages.length})
        </span>
        <button
          type="button"
          onClick={() => addPage("page")}
          title="Add a new page"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 6, border: `1px solid ${T.accentBorder}`,
            background: T.accentSoft, fontSize: 11, fontWeight: 700, color: T.accentText,
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.accentSoft; }}
        >
          <Plus size={12} /> Add Page
        </button>
      </div>

      {/* ── Quick-add page type pills ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
        {PAGE_TYPES.slice(0, 6).map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => addPage(value)}
            title={`Add ${label}`}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 8px", borderRadius: 20, border: `1px solid ${T.border}`,
              background: T.input, fontSize: 10, fontWeight: 600, color: T.textDim,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentBorder; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
          >
            <Icon size={10} /> {label}
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
        const RowIcon    = idx === 0 ? Home : typeInfo.Icon;

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
            title={isActive ? undefined : `Switch to ${page.name}`}
            style={{
              display: "flex", flexDirection: "column",
              border: isActive
                ? `1px solid ${T.accentBorder}`
                : isDragOver ? `1px dashed ${T.accentBorder}` : `1px solid ${T.border}`,
              borderRadius: 8,
              background: isActive ? T.accentSoft : isDragOver ? T.hover : T.input,
              opacity: isDraggingThis ? 0.4 : 1,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {/* Main row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
              <GripVertical size={13} color={T.textFaint} style={{ flexShrink: 0, cursor: "grab" }} />

              <RowIcon size={13} color={isActive ? T.accentText : T.textDim} style={{ flexShrink: 0 }} />

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
                      ...inputStyle,
                      flex: 1, border: `1px solid ${T.accentBorder}`,
                      padding: "2px 6px", fontWeight: 600,
                    }}
                  />
                  <button type="button" title="Save name" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                    onClick={e => { e.stopPropagation(); commitRename(page.id); }}>
                    <Check size={13} color={T.success} />
                  </button>
                  <button type="button" title="Cancel rename" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                    onClick={e => { e.stopPropagation(); setRenamingId(null); }}>
                    <X size={13} color={T.danger} />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? T.text : T.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      onDoubleClick={e => { e.stopPropagation(); setRenameVal(page.name); setRenamingId(page.id); }}
                      title="Double-click to rename"
                    >
                      {page.name}
                    </div>
                    <div style={{ fontSize: 10, color: T.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        style={{ ...pageActionBtn, color: T.danger }}
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
              <div style={{ borderTop: `1px solid ${T.borderSoft}`, padding: "6px 10px" }} onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowTypeFor(showTypeFor === page.id ? null : page.id)}
                  title="Change page type"
                  style={{
                    display: "flex", alignItems: "center", gap: 4, background: "none",
                    border: "none", cursor: "pointer", fontSize: 10, color: T.accentText, fontWeight: 600,
                  }}
                >
                  <typeInfo.Icon size={10} /> {typeInfo.label}
                  <ChevronDown size={10} />
                </button>
                {showTypeFor === page.id && (
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 6,
                  }}>
                    {PAGE_TYPES.map(({ value, label, Icon }) => {
                      const sel = (page.pageType || "page") === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPageType(page.id, value)}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "4px 6px", borderRadius: 6,
                            border: `1px solid ${sel ? T.accentBorder : T.border}`,
                            background: sel ? T.accentSoft : T.input,
                            fontSize: 10, fontWeight: 600,
                            color: sel ? T.accentText : T.textDim,
                            cursor: "pointer",
                          }}
                        >
                          <Icon size={10} /> {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Element count badge */}
            {isActive && (
              <div style={{ padding: "4px 10px 6px" }}>
                <span style={{ fontSize: 9, color: T.textFaint }}>
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
        background: T.input, borderRadius: 6, border: `1px solid ${T.borderSoft}`,
        fontSize: 10, color: T.textDim, lineHeight: 1.5,
      }}>
        <strong style={{ color: T.text }}>Double-click</strong> name to rename, <strong style={{ color: T.text }}>drag</strong> to reorder. First page is the homepage.
      </div>
    </div>
  );
}

const pageActionBtn = {
  background: "none", border: `1px solid ${T.border}`, borderRadius: 5,
  padding: 4, cursor: "pointer", display: "flex", color: T.textDim,
  transition: "all 0.15s",
};

export default PageManager;
