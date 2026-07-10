// src/pages/Templates/Custom/elements/ImageElement.jsx
import React, { useRef } from "react";
import { Upload } from "lucide-react";

export function ImageElement({ element, onSrcChange, readOnly }) {
  const { src, alt, styles } = element;
  const inputRef = useRef(null);

  const s = {
    width:        "100%",
    height:       "100%",
    objectFit:    styles.objectFit    || "cover",
    borderRadius: styles.borderRadius != null ? `${styles.borderRadius}px` : "8px",
    opacity:      styles.opacity      ?? 1,
    display:      "block",
  };

  if (src) return <img src={src} alt={alt || "Image"} style={s} />;

  if (readOnly) return <div style={{ ...s, background: "#f3f4f6" }} />;

  return (
    <div
      style={{
        width: "100%", height: "100%",
        background: "#f9fafb",
        border: "2px dashed #d1d5db",
        borderRadius: s.borderRadius,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", gap: 8,
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => onSrcChange?.(ev.target.result);
          reader.readAsDataURL(file);
        }}
      />
      <Upload size={22} color="#9ca3af" />
      <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Click to upload image</span>
      <span style={{ fontSize: 10, color: "#d1d5db" }}>or paste a URL in the properties panel</span>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Templates/Custom/elements/DividerElement.jsx
export function DividerElement({ element }) {
  const { styles } = element;
  return (
    <div
      style={{
        width:        "100%",
        height:       element.height || 2,
        background:   styles.bgColor || "#e5e7eb",
        borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : 1,
        opacity:      styles.opacity ?? 1,
      }}
    />
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Templates/Custom/elements/SpacerElement.jsx
export function SpacerElement({ element, readOnly }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: readOnly ? "transparent" : "repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6 4px,transparent 4px,transparent 12px)",
        border: readOnly ? "none" : "1px dashed #d1d5db",
        borderRadius: 4,
        opacity: 0.5,
      }}
    />
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Templates/Custom/elements/CardElement.jsx
export function CardElement({ element, isEditing, onContentChange, readOnly }) {
  const { content, subtitle, styles } = element;
  const s = {
    width:        "100%",
    height:       "100%",
    background:   styles.bgColor      || "#ffffff",
    borderRadius: styles.borderRadius != null ? `${styles.borderRadius}px` : "12px",
    border:       styles.border        || "1px solid #e5e7eb",
    boxShadow:    styles.boxShadow     || "0 2px 8px rgba(0,0,0,0.06)",
    padding:      styles.padding       != null ? `${styles.padding}px` : "24px",
    display:      "flex",
    flexDirection:"column",
    gap:          8,
    opacity:      styles.opacity       ?? 1,
    boxSizing:    "border-box",
    overflow:     "hidden",
  };

  return (
    <div style={s}>
      <div
        contentEditable={isEditing && !readOnly}
        suppressContentEditableWarning
        style={{
          fontSize:   styles.fontSize   || 16,
          fontWeight: styles.fontWeight || "600",
          fontFamily: styles.fontFamily || "inherit",
          color:      styles.color      || "#111827",
          outline:    "none",
        }}
        onBlur={(e) => isEditing && onContentChange?.({ content: e.currentTarget.innerText })}
      >
        {content || "Card Title"}
      </div>
      <div
        contentEditable={isEditing && !readOnly}
        suppressContentEditableWarning
        style={{ fontSize: (styles.fontSize || 16) - 2, color: "#6b7280", outline: "none" }}
        onBlur={(e) => isEditing && onContentChange?.({ subtitle: e.currentTarget.innerText })}
      >
        {subtitle || "Description text"}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Templates/Custom/elements/VideoElement.jsx
export function VideoElement({ element, readOnly }) {
  const { src, styles } = element;

  // Convert YouTube watch URL → embed URL
  const embedSrc = src
    ? src.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
    : null;

  const s = {
    width:        "100%",
    height:       "100%",
    borderRadius: styles.borderRadius != null ? `${styles.borderRadius}px` : "8px",
    border:       "none",
    overflow:     "hidden",
    display:      "block",
    opacity:      styles.opacity ?? 1,
    background:   "#000",
  };

  if (embedSrc) {
    return <iframe src={embedSrc} style={s} allowFullScreen title="video" />;
  }

  if (readOnly) return <div style={{ ...s, background: "#111" }} />;

  return (
    <div style={{ ...s, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#9ca3af", fontSize: 13 }}>Paste YouTube URL in properties panel</span>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Templates/Custom/elements/NavbarElement.jsx
export function NavbarElement({ element, pages = [], activePage, onPageChange, readOnly }) {
  const { content, styles } = element;
  const s = {
    width:       "100%",
    height:      "100%",
    background:  styles.bgColor  || "#ffffff",
    boxShadow:   styles.boxShadow || "0 1px 0 #e5e7eb",
    display:     "flex",
    alignItems:  "center",
    justifyContent: "space-between",
    padding:     styles.padding || "0 40px",
    boxSizing:   "border-box",
    gap:         32,
    opacity:     styles.opacity ?? 1,
  };

  const linkStyle = {
    fontSize:     styles.fontSize   || 14,
    fontWeight:   styles.fontWeight || "600",
    fontFamily:   styles.fontFamily || "inherit",
    color:        styles.color      || "#111827",
    textDecoration:"none",
    cursor:       "pointer",
    whiteSpace:   "nowrap",
    padding:      "4px 0",
    borderBottom: "2px solid transparent",
    transition:   "border-color 0.15s",
  };

  return (
    <nav style={s}>
      <span style={{ ...linkStyle, fontSize: (styles.fontSize || 14) + 2, fontWeight: "800" }}>
        {content || "Brand"}
      </span>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {pages.map((p) => (
          <span
            key={p.id}
            style={{
              ...linkStyle,
              borderBottomColor: p.id === activePage ? styles.color || "#111827" : "transparent",
            }}
            onClick={() => !readOnly && onPageChange?.(p.id)}
          >
            {p.name}
          </span>
        ))}
      </div>
    </nav>
  );
}