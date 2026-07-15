// src/pages/Customize/customize-editor/custom/ui.jsx
// Shared design tokens + UI atoms for the Studio custom-builder panels.
// One background scale, one border color, one accent — every panel imports
// from here instead of redefining its own inputStyle/Section/Row.

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/* ── Design tokens ──────────────────────────────────────────────────────── */
export const T = {
  panel:      "#0f0f0f",                    // panel background
  panelAlt:   "#141414",                    // raised surfaces (tab bars, toolbars)
  input:      "#1a1a1a",                    // input backgrounds
  hover:      "rgba(255,255,255,0.06)",
  border:     "rgba(255,255,255,0.10)",
  borderSoft: "rgba(255,255,255,0.06)",
  text:       "#e5e5e5",
  textDim:    "#9a9a9a",
  textFaint:  "#6b6b6b",
  accent:     "#8b5cf6",                    // violet
  accentText: "#a78bfa",
  accentSoft: "rgba(139,92,246,0.14)",
  accentBorder: "rgba(139,92,246,0.45)",
  danger:     "#f87171",
  success:    "#34d399",
  warn:       "#fbbf24",
};

/* ── Shared styles ──────────────────────────────────────────────────────── */
export const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  fontSize: 12,
  color: T.text,
  outline: "none",
  background: T.input,
  boxSizing: "border-box",
  colorScheme: "dark",
};

export const iconBtn = {
  background: T.input,
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  padding: 5,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: T.textDim,
  transition: "background 0.15s, color 0.15s, border-color 0.15s",
};

export const sectionLabelStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: T.textDim,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export const fieldLabelStyle = {
  fontSize: 10,
  fontWeight: 600,
  color: T.textFaint,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

/* ── Collapsible section ────────────────────────────────────────────────── */
export function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${T.borderSoft}` }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title={open ? `Collapse ${title}` : `Expand ${title}`}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "8px 16px",
          background: "none", border: "none", cursor: "pointer",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = T.hover; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
      >
        <span style={sectionLabelStyle}>{title}</span>
        {open
          ? <ChevronDown size={12} color={T.textFaint} />
          : <ChevronRight size={12} color={T.textFaint} />}
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Labeled field row ──────────────────────────────────────────────────── */
export function Row({ label, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={fieldLabelStyle}>{label}</label>
        {hint && <span style={{ fontSize: 9, color: T.textFaint }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Segmented button group ─────────────────────────────────────────────── */
// options: [{ value, node (label or icon), title? }]
export function Seg({ options, value, onChange, size = "sm" }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {options.map(({ value: v, node, title }) => {
        const active = value === v;
        return (
          <button
            key={v}
            type="button"
            title={title || (typeof node === "string" ? node : undefined)}
            onClick={() => onChange(v)}
            style={{
              flex: 1,
              padding: size === "sm" ? "5px 2px" : "6px 4px",
              borderRadius: 6,
              border: `1px solid ${active ? T.accentBorder : T.border}`,
              background: active ? T.accentSoft : T.input,
              fontSize: 10,
              fontWeight: 700,
              color: active ? T.accentText : T.textDim,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.hover; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = T.input; }}
          >
            {node}
          </button>
        );
      })}
    </div>
  );
}

/* ── Number input with suffix ───────────────────────────────────────────── */
export function NumberInput({ value, onChange, min, max, step = 1, suffix = "", placeholder = "" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="number"
        value={value ?? ""}
        min={min} max={max} step={step}
        placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ ...inputStyle, flex: 1 }}
      />
      {suffix && <span style={{ fontSize: 11, color: T.textFaint, flexShrink: 0 }}>{suffix}</span>}
    </div>
  );
}

/* ── Color picker (swatch + hex + optional transparent) ─────────────────── */
export function ColorPicker({ value, onChange, allowTransparent = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="color"
        value={value && value !== "transparent" ? value : "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        title="Pick color"
        style={{
          width: 30, height: 30, borderRadius: 6,
          border: `1px solid ${T.border}`, cursor: "pointer",
          padding: 2, flexShrink: 0, background: T.input,
        }}
      />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={allowTransparent ? "transparent" : "#000000"}
        style={{ ...inputStyle, flex: 1, fontFamily: "ui-monospace, monospace", fontSize: 11 }}
      />
      {allowTransparent && (
        <button
          type="button"
          onClick={() => onChange("transparent")}
          title="Set transparent"
          style={{
            padding: "4px 7px", borderRadius: 5,
            border: `1px solid ${value === "transparent" ? T.accentBorder : T.border}`,
            background: value === "transparent" ? T.accentSoft : T.input,
            fontSize: 9, fontWeight: 700, color: T.accentText,
            cursor: "pointer", flexShrink: 0,
          }}
        >
          None
        </button>
      )}
    </div>
  );
}
