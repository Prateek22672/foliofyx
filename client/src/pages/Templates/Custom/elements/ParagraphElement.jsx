// src/pages/Templates/Custom/elements/ParagraphElement.jsx
import React from "react";

export function ParagraphElement({ element, isEditing, onContentChange, readOnly }) {
  const { content, styles } = element;
  const s = {
    fontSize:      styles.fontSize   || 16,
    fontWeight:    styles.fontWeight || "400",
    fontFamily:    styles.fontFamily || "inherit",
    color:         styles.color      || "#374151",
    textAlign:     styles.textAlign  || "left",
    lineHeight:    styles.lineHeight || 1.6,
    letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
    opacity:       styles.opacity    ?? 1,
    background:    styles.bgColor !== "transparent" ? styles.bgColor : undefined,
    borderRadius:  styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    padding:       styles.padding    || 0,
    width:         "100%",
    margin:        0,
    outline:       "none",
    wordBreak:     "break-word",
    whiteSpace:    "pre-wrap",
  };

  if (readOnly || !isEditing) return <p style={s}>{content || "Paragraph text"}</p>;

  return (
    <p
      contentEditable
      suppressContentEditableWarning
      style={{ ...s, minHeight: 24 }}
      onBlur={(e) => onContentChange(e.currentTarget.innerText)}
    >
      {content || "Paragraph text"}
    </p>
  );
}