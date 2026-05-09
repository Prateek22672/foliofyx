// src/components/EditableText.jsx
//
// When the user clicks any editable text, two things happen:
//  1. The inline input appears (same as before).
//  2. A Wix-style TextFontPopup floats near that element
//     (rendered via portal into document.body).
//
// Props:
//   value        – string
//   onChange     – (value: string) => void
//   isTextArea   – bool  → render <textarea>
//   multiline    – bool  → same as isTextArea
//   readOnly     – bool  → just render text
//   placeholder  – string
//   currentFont  – optional: current fontFamily value
//   onFontChange – optional: (fontValue) => void
// src/components/EditableText.jsx  (or wherever your EditableText lives)
//
// ── What changed ──────────────────────────────────────────────────────────────
//  • Internally calls usePortfolio() to read + write themeFontFamily.
//  • Every <EditableText> in every template now gets the Wix-style font popup
//    automatically — NO changes needed in any template file.
//  • The optional `currentFont` / `onFontChange` props still work as overrides
//    (e.g. for cases outside PortfolioContext).
//  • isReadOnly still suppresses the popup (never shown in deployed view).
// ─────────────────────────────────────────────────────────────────────────────
// src/components/EditableText.jsx  (or wherever your EditableText lives)
//
// ── What changed ──────────────────────────────────────────────────────────────
//  • Internally calls usePortfolio() to read + write themeFontFamily.
//  • Every <EditableText> in every template now gets the Wix-style font popup
//    automatically — NO changes needed in any template file.
//  • The optional `currentFont` / `onFontChange` props still work as overrides
//    (e.g. for cases outside PortfolioContext).
//  • isReadOnly still suppresses the popup (never shown in deployed view).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { Check, X, Pencil } from "lucide-react";
import TextFontPopup from "./TextFontPopup"; // adjust path if needed
import { usePortfolio } from "/src/context/portfolioContext"; // adjust path if needed

const EditableText = ({
  value,
  onChange,
  isTextArea,
  readOnly,
  placeholder,
  multiline,
  // Optional overrides — if omitted, context is used automatically
  currentFont: fontProp,
  onFontChange: fontChangeProp,
}) => {
  // ── Pull font from context (safe: returns {} if no provider) ──
  let contextFont      = undefined;
  let setContextFont   = undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { portfolioData, setPortfolioData } = usePortfolio();
    contextFont    = portfolioData?.themeFontFamily;
    setContextFont = (v) =>
      setPortfolioData((prev) => ({ ...prev, themeFontFamily: v }));
  } catch {
    // PortfolioContext not available — font popup simply won't show
  }

  // Props take priority over context
  const currentFont  = fontProp    ?? contextFont;
  const onFontChange = fontChangeProp ?? setContextFont;

  const [isEditing,  setIsEditing]  = useState(false);
  const [tempValue,  setTempValue]  = useState(value || "");
  const [anchorRect, setAnchorRect] = useState(null);
  const containerRef = useRef(null);
  const triggerRef   = useRef(null);

  useEffect(() => { setTempValue(value || ""); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Ignore clicks inside the font popup portal (rendered in document.body)
      if (e.target.closest("[data-text-font-popup]")) return;
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleCancel();
      }
    };
    if (isEditing) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  if (readOnly) {
    return <span className="inline-block whitespace-pre-wrap">{value || ""}</span>;
  }

  const handleSave = () => {
    if (onChange) onChange(tempValue);
    setIsEditing(false);
    setAnchorRect(null);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setIsEditing(false);
    setAnchorRect(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTextArea && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const openEditing = (e) => {
    e.stopPropagation();
    if (triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
    }
    setIsEditing(true);
  };

  // Show font popup only when we have both a font value AND a setter
  const hasFontControl = !!onFontChange && !!currentFont;

  /* ── EDITING STATE ── */
  if (isEditing) {
    return (
      <>
        {hasFontControl && anchorRect && (
          <TextFontPopup
            anchorRect={anchorRect}
            currentFont={currentFont}
            onFontChange={onFontChange}
            onClose={() => setAnchorRect(null)}
          />
        )}

        <span
          ref={containerRef}
          data-editable-text-container="true"
          className="relative inline-flex flex-col w-full min-w-[200px] z-[500]"
          style={{ animation: "etFadeIn 0.15s ease both" }}
        >
          <style>{`@keyframes etFadeIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}`}</style>

          {isTextArea || multiline ? (
            <textarea
              className="w-full bg-white/95 backdrop-blur-md p-3 rounded-xl outline-none border-2 border-violet-500 text-slate-900 shadow-2xl min-h-[120px] resize-y text-[0.92em] leading-snug"
              style={{ fontFamily: currentFont || "inherit" }}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <input
              className="w-full bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-xl outline-none border-2 border-violet-500 text-slate-900 shadow-2xl text-[0.92em]"
              style={{ fontFamily: currentFont || "inherit" }}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}

          <span className="flex gap-2 mt-2 justify-end">
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-all">
              <X size={11} /> Cancel
            </button>
            <button type="button" onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-violet-700 transition-all shadow">
              <Check size={11} /> Save
            </button>
          </span>
        </span>
      </>
    );
  }

  /* ── VIEW STATE ── */
  return (
    <span
      ref={triggerRef}
      onClick={openEditing}
      className="relative cursor-pointer group/text inline-flex items-center gap-2"
    >
      <span className="border-b border-dashed border-violet-400/30 group-hover/text:border-violet-500 group-hover/text:text-violet-500 transition-all duration-150">
        {value || placeholder || "Click to edit…"}
      </span>
      <span className="flex-none opacity-0 group-hover/text:opacity-100 scale-90 group-hover/text:scale-100 transition-all duration-150">
        <span className="inline-flex items-center justify-center bg-violet-600 text-white p-1 rounded-md shadow-lg">
          <Pencil size={10} strokeWidth={2.5} />
        </span>
      </span>
    </span>
  );
};

export default EditableText;