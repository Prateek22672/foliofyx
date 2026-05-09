// src/components/TextFontPopup.jsx
//
// A Wix-style contextual floating popup that appears near any text element
// when it's being edited. Shows font options in a compact horizontal list.
//
// Props:
//   anchorRect   – DOMRect from the trigger element (getBoundingClientRect())
//   currentFont  – current fontFamily value
//   onFontChange – (fontValue) => void
//   onClose      – () => void
//   themeBg      – optional: portfolio bg color for the preview chip

// src/components/TextFontPopup.jsx
//
// A Wix-style contextual floating popup that appears near any text element
// when it's being edited. Shows font options in a compact horizontal list.
//
// Props:
//   anchorRect   – DOMRect from the trigger element (getBoundingClientRect())
//   currentFont  – current fontFamily value
//   onFontChange – (fontValue) => void
//   onClose      – () => void
//   themeBg      – optional: portfolio bg color for the preview chip
// src/components/TextFontPopup.jsx
//
// A Wix-style contextual floating popup that appears near any text element
// when it's being edited. Shows font options in a compact horizontal list.
//
// Props:
//   anchorRect   – DOMRect from the trigger element (getBoundingClientRect())
//   currentFont  – current fontFamily value
//   onFontChange – (fontValue) => void
//   onClose      – () => void
//   themeBg      – optional: portfolio bg color for the preview chip

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Type, X, Check, GripHorizontal } from "lucide-react";
import { createPortal } from "react-dom";

/* ─────────────────────────────────────────
   Font list
───────────────────────────────────────── */
export const FONT_OPTIONS = [
  { label: "Switzer",       value: "Switzer, sans-serif",          emoji: "✦", type: "Default"  },
  { label: "Inter",         value: '"Inter", sans-serif',           emoji: "◎", type: "Clean"    },
  { label: "Playfair",      value: '"Playfair Display", serif',     emoji: "𝒫", type: "Serif"    },
  { label: "Space Grotesk", value: '"Space Grotesk", sans-serif',   emoji: "⊞", type: "Tech"     },
  { label: "Outfit",        value: '"Outfit", sans-serif',          emoji: "◐", type: "Modern"   },
  { label: "Oswald",        value: '"Oswald", sans-serif',          emoji: "▮", type: "Bold"     },
  { label: "Fira Code",     value: '"Fira Code", monospace',        emoji: "</>", type: "Code"   },
  { label: "Syne",          value: '"Syne", sans-serif',            emoji: "◭", type: "Artistic" },
];

/* ─────────────────────────────────────────
   Font chip — compact card for each font
───────────────────────────────────────── */
const FontChip = ({ font, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={`${font.label} — ${font.type}`}
    className={`
      group relative flex flex-col items-center justify-center gap-0.5
      rounded-xl border-2 transition-all duration-150 shrink-0
      px-3 py-2 min-w-[62px]
      ${isActive
        ? "border-violet-500 bg-violet-50 shadow-sm"
        : "border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/40"
      }
    `}
  >
    {/* Large "Aa" preview */}
    <span
      className={`text-[17px] font-semibold leading-none tracking-tight transition-colors
        ${isActive ? "text-violet-700" : "text-gray-800 group-hover:text-violet-600"}`}
      style={{ fontFamily: font.value }}
    >
      Aa
    </span>

    {/* Font name */}
    <span
      className={`text-[8px] font-bold leading-none transition-colors mt-0.5
        ${isActive ? "text-violet-500" : "text-gray-400 group-hover:text-violet-400"}`}
      style={{ fontFamily: font.value }}
    >
      {font.label}
    </span>

    {/* Type badge */}
    <span className="text-[6.5px] font-black uppercase tracking-widest text-gray-300 leading-none">
      {font.type}
    </span>

    {/* Active checkmark */}
    {isActive && (
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shadow-sm">
        <Check size={8} className="text-white" strokeWidth={3} />
      </span>
    )}
  </button>
);

/* ═══════════════════════════════════════════
   TEXT FONT POPUP
   Renders into a portal (document.body) so it
   sits above everything with z-[9999].
   Positions itself above the anchorRect,
   flipping below if there's no room.
═══════════════════════════════════════════ */
const TextFontPopup = ({ anchorRect, currentFont, onFontChange, onClose }) => {
  const popupRef  = useRef(null);
  const [pos, setPos]     = useState({ top: 0, left: 0, flip: false });
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [manualPos, setManualPos] = useState(null); // set once user drags

  const POPUP_WIDTH  = 508;
  const POPUP_HEIGHT = 112;
  const GAP          = 10; // px between popup and anchor

  /* ── Compute initial position relative to anchor ── */
  useLayoutEffect(() => {
    if (!anchorRect || !popupRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: centre on anchor, clamp within viewport
    let left = anchorRect.left + anchorRect.width / 2 - POPUP_WIDTH / 2;
    left = Math.max(8, Math.min(left, vw - POPUP_WIDTH - 8));

    // Vertical: prefer above, flip below if no room
    const spaceAbove = anchorRect.top;
    const spaceBelow = vh - anchorRect.bottom;
    const flip = spaceAbove < POPUP_HEIGHT + GAP + 16 && spaceBelow > POPUP_HEIGHT + GAP;

    const top = flip
      ? anchorRect.bottom + GAP
      : anchorRect.top - POPUP_HEIGHT - GAP;

    setPos({ top, left, flip });
    setVisible(true);
  }, [anchorRect]);

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        // Don't close the popup if user clicked back on the editable text input
        if (e.target.closest("[data-editable-text-container]")) return;
        handleClose();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 150);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Drag logic ── */
  const onDragStart = (e) => {
    if (!popupRef.current) return;
    const rect = popupRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      setManualPos({
        left: e.clientX - dragOffset.x,
        top:  e.clientY - dragOffset.y,
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [isDragging, dragOffset]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 150);
  };

  const activePos = manualPos || pos;
  const currentFontLabel = FONT_OPTIONS.find(f => f.value === currentFont)?.label || "Font";

  return createPortal(
    <div
      ref={popupRef}
      data-text-font-popup="true"
      className="fixed z-[9999] select-none"
      style={{
        top:    activePos.top,
        left:   activePos.left,
        width:  POPUP_WIDTH,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : pos.flip
            ? "translateY(-6px) scale(0.97)"
            : "translateY(6px) scale(0.97)",
        transition: "opacity 0.18s ease, transform 0.18s ease",
        pointerEvents: visible ? "auto" : "none",
        filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18)) drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
      }}
    >
      {/* ── Caret arrow pointing at text ── */}
      {!manualPos && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none"
          style={pos.flip
            ? { top: -7, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "8px solid white" }
            : { bottom: -7, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "8px solid white" }
          }
        />
      )}

      {/* ── Main panel ── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">

        {/* Header row */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 bg-gray-50/90 border-b border-gray-100 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={onDragStart}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
              <Type size={10} className="text-violet-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Font
            </span>
            {/* Active font name badge */}
            <span
              className="text-[10px] font-bold text-gray-700 px-2 py-0.5 bg-white border border-gray-200 rounded-lg"
              style={{ fontFamily: currentFont }}
            >
              {currentFontLabel}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <GripHorizontal size={12} className="text-gray-300" />
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-all ml-1"
            >
              <X size={11} />
            </button>
          </div>
        </div>

        {/* Font chips row — horizontally scrollable */}
        <div
          className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {FONT_OPTIONS.map(font => {
            const isActive = currentFont === font.value;
            return (
              <FontChip
                key={font.value}
                font={font}
                isActive={isActive}
                onClick={() => onFontChange(font.value)}
              />
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TextFontPopup;