// src/pages/Templates/Custom/elements/HeadingElement.jsx
import React from "react";

export function HeadingElement({ element, isEditing, onContentChange, readOnly }) {
  const { content, styles } = element;
  const s = {
    fontSize:      styles.fontSize,
    fontWeight:    styles.fontWeight || "700",
    fontFamily:    styles.fontFamily || "inherit",
    color:         styles.color      || "#111827",
    textAlign:     styles.textAlign  || "left",
    lineHeight:    styles.lineHeight || 1.15,
    letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
    opacity:       styles.opacity    ?? 1,
    background:    styles.bgColor !== "transparent" ? styles.bgColor : undefined,
    borderRadius:  styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    padding:       styles.padding    || 0,
    width:         "100%",
    margin:        0,
    outline:       "none",
    wordBreak:     "break-word",
  };

  if (readOnly || !isEditing) {
    return <h2 style={s}>{content || "Heading"}</h2>;
  }

  return (
    <h2
      contentEditable
      suppressContentEditableWarning
      style={{ ...s, minWidth: 60 }}
      onBlur={(e) => onContentChange(e.currentTarget.innerText)}
    >
      {content || "Heading"}
    </h2>
  );
}