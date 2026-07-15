// src/pages/Templates/Custom/SelectionBox.jsx
// Renders the selection overlay (blue outline + 8 resize handles)
// over a selected canvas element.

import React from "react";
import { Lock, Unlock, Trash2, Copy } from "lucide-react";

const HANDLES = ["nw","n","ne","e","se","s","sw","w"];

const HANDLE_POS = {
  nw: { top: -5,    left: -5,   cursor: "nw-resize" },
  n:  { top: -5,    left: "50%",cursor: "n-resize",  transform: "translateX(-50%)" },
  ne: { top: -5,    right: -5,  cursor: "ne-resize" },
  e:  { top: "50%", right: -5,  cursor: "e-resize",  transform: "translateY(-50%)" },
  se: { bottom: -5, right: -5,  cursor: "se-resize" },
  s:  { bottom: -5, left: "50%",cursor: "s-resize",  transform: "translateX(-50%)" },
  sw: { bottom: -5, left: -5,   cursor: "sw-resize" },
  w:  { top: "50%", left: -5,   cursor: "w-resize",  transform: "translateY(-50%)" },
};

export function SelectionBox({
  element,
  showDims = false, // true while dragging/resizing — shows the W x H chip
  onResizeStart,   // (e, element, handle) => void
  onDelete,        // () => void
  onDuplicate,     // () => void
  onToggleLock,    // () => void
}) {
  const dimW = Math.round(Number(element.width) || 0);
  const dimH = element.height === "auto" ? "auto" : Math.round(Number(element.height) || 0);

  return (
    <div
      style={{
        position: "absolute",
        inset: -2,
        border: "2px solid #6366f1",
        borderRadius: 2,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Resize handles */}
      {HANDLES.map((h) => (
        <div
          key={h}
          onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, element, h); }}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            background: "#ffffff",
            border: "2px solid #6366f1",
            borderRadius: 2,
            pointerEvents: "all",
            zIndex: 12,
            ...HANDLE_POS[h],
          }}
        />
      ))}

      {/* Dimensions chip — visible while dragging/resizing */}
      {showDims && (
        <div
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#6366f1",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            padding: "2px 8px",
            borderRadius: 5,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {dimW} × {dimH} px
        </div>
      )}

      {/* Toolbar above the element (hidden mid-drag so it stays out of the way) */}
      {!showDims && (
      <div
        style={{
          position: "absolute",
          top: -38,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "#111827",
          borderRadius: 8,
          padding: "4px 6px",
          pointerEvents: "all",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Element type chip */}
        <span style={{
          fontSize: 10, color: "#9ca3af", fontWeight: 600,
          paddingRight: 6, borderRight: "1px solid #374151",
          marginRight: 4, textTransform: "capitalize", letterSpacing: "0.05em",
        }}>
          {element.type}
        </span>

        <ToolBtn onClick={onDuplicate} title="Duplicate">
          <Copy size={12} />
        </ToolBtn>
        <ToolBtn onClick={onToggleLock} title={element.locked ? "Unlock" : "Lock"}>
          {element.locked ? <Unlock size={12} /> : <Lock size={12} />}
        </ToolBtn>
        <ToolBtn onClick={onDelete} title="Delete" danger>
          <Trash2 size={12} />
        </ToolBtn>
      </div>
      )}
    </div>
  );
}

function ToolBtn({ children, onClick, title, danger }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:  24,
        height: 24,
        borderRadius: 5,
        border:  "none",
        background: "transparent",
        color:   danger ? "#f87171" : "#e5e7eb",
        cursor:  "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = danger ? "rgba(239,68,68,0.15)" : "#374151"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}