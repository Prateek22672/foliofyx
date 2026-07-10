// src/pages/Templates/Custom/elements/ButtonElement.jsx
import React from "react";

export function ButtonElement({ element, isEditing, onContentChange, readOnly }) {
  const { content, styles } = element;
  const s = {
    display:       "inline-flex",
    alignItems:    "center",
    justifyContent:"center",
    width:         "100%",
    height:        "100%",
    fontSize:      styles.fontSize   || 14,
    fontWeight:    styles.fontWeight || "600",
    fontFamily:    styles.fontFamily || "inherit",
    color:         styles.color      || "#ffffff",
    background:    styles.bgColor    || "#111827",
    borderRadius:  styles.borderRadius != null ? `${styles.borderRadius}px` : "8px",
    padding:       styles.padding    || "12px 24px",
    border:        styles.border     || "none",
    boxShadow:     styles.boxShadow  || "none",
    opacity:       styles.opacity    ?? 1,
    cursor:        readOnly ? "pointer" : "default",
    textAlign:     "center",
    textDecoration:"none",
    outline:       "none",
    whiteSpace:    "nowrap",
    letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
    transition:    "opacity 0.15s",
    boxSizing:     "border-box",
  };

  if (readOnly) return <a href={element.href || "#"} style={s}>{content || "Button"}</a>;

  if (isEditing) {
    return (
      <span
        contentEditable
        suppressContentEditableWarning
        style={{ ...s, cursor: "text" }}
        onBlur={(e) => onContentChange(e.currentTarget.innerText)}
      >
        {content || "Button"}
      </span>
    );
  }

  return <span style={s}>{content || "Button"}</span>;
}