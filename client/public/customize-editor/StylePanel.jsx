// src/pages/Customize/customize-editor/StylePanel.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Palette, RotateCcw, X, Check, Minimize2, Maximize2, Type,
  ChevronDown, ChevronUp,
} from "lucide-react";

/* ─────────────────────────────────────────
   Font options
───────────────────────────────────────── */
const FONT_OPTIONS = [
  { label: "Switzer",       value: "Switzer, sans-serif",          type: "Default"  },
  { label: "Inter",         value: '"Inter", sans-serif',           type: "Clean"    },
  { label: "Playfair",      value: '"Playfair Display", serif',     type: "Serif"    },
  { label: "Space Grotesk", value: '"Space Grotesk", sans-serif',   type: "Tech"     },
  { label: "Outfit",        value: '"Outfit", sans-serif',          type: "Modern"   },
  { label: "Oswald",        value: '"Oswald", sans-serif',          type: "Bold"     },
  { label: "Fira Code",     value: '"Fira Code", monospace',        type: "Code"     },
  { label: "Syne",          value: '"Syne", sans-serif',            type: "Artistic" },
];

/* ─────────────────────────────────────────
   Palette groups
───────────────────────────────────────── */
const PALETTE_GROUPS = [
  {
    group: "Professional",
    palettes: [
      { name: "Snow",      bg: "#ffffff", text: "#111111" },
      { name: "Pebble",    bg: "#f5f4f2", text: "#1a1a1a" },
      { name: "Navy Ink",  bg: "#0f172a", text: "#e2e8f0" },
      { name: "Slate",     bg: "#1e293b", text: "#cbd5e1" },
    ],
  },
  {
    group: "Innovative",
    palettes: [
      { name: "Obsidian",  bg: "#0a0a0a", text: "#f5f5f5" },
      { name: "Blaze",     bg: "#fafafa", text: "#111111" },
      { name: "Solar",     bg: "#fffbeb", text: "#1c1917" },
      { name: "Electric",  bg: "#0d0d0d", text: "#e0e0e0" },
    ],
  },
  {
    group: "Playful",
    palettes: [
      { name: "Candy",     bg: "#fdf4ff", text: "#4a044e" },
      { name: "Bubblegum", bg: "#fdf2f8", text: "#831843" },
      { name: "Ocean",     bg: "#f0f9ff", text: "#0c4a6e" },
      { name: "Mint",      bg: "#f0fdf4", text: "#14532d" },
    ],
  },
  {
    group: "Sophisticated",
    palettes: [
      { name: "Ivory",     bg: "#faf6f1", text: "#1c1917" },
      { name: "Cream",     bg: "#fffbeb", text: "#78350f" },
      { name: "Charcoal",  bg: "#1f1f1f", text: "#e4e4e4" },
      { name: "Smoke",     bg: "#f8f8f8", text: "#333333" },
    ],
  },
  {
    group: "Friendly",
    palettes: [
      { name: "Sage",      bg: "#f0fdf4", text: "#14532d" },
      { name: "Forest",    bg: "#0d1f1a", text: "#a7f3d0" },
      { name: "Sky",       bg: "#e0f2fe", text: "#0c4a6e" },
      { name: "Lavender",  bg: "#f5f3ff", text: "#3b0764" },
    ],
  },
  {
    group: "Bold",
    palettes: [
      { name: "Midnight",  bg: "#020617", text: "#7dd3fc" },
      { name: "Rose Gold", bg: "#fff1f2", text: "#881337" },
      { name: "Steel",     bg: "#1e293b", text: "#94a3b8" },
      { name: "Void",      bg: "#09090b", text: "#fafafa" },
    ],
  },
  {
    group: "Quirky",
    palettes: [
      { name: "Neon",      bg: "#0a0a0a", text: "#39ff14" },
      { name: "Retro",     bg: "#fef9c3", text: "#713f12" },
      { name: "Grape",     bg: "#faf5ff", text: "#3b0764" },
      { name: "Coral",     bg: "#fff7ed", text: "#7c2d12" },
    ],
  },
];

/* ─────────────────────────────────────────
   3-strip swatch
───────────────────────────────────────── */
const PaletteSwatch = ({ palette, isActive, onClick, size = "md" }) => (
  <button
    type="button"
    title={palette.name}
    onClick={onClick}
    className={`
      group relative rounded-xl overflow-hidden border-2 transition-all duration-150 shrink-0
      ${isActive
        ? "border-violet-500 shadow-md scale-[1.04]"
        : "border-transparent hover:border-gray-300"}
    `}
    style={{ height: size === "sm" ? 24 : 38, minWidth: size === "sm" ? 52 : 80 }}
  >
    <div className="flex h-full">
      <div className="flex-1"  style={{ backgroundColor: palette.bg }}   />
      <div className="flex-[0.55]" style={{ backgroundColor: palette.bg === palette.text ? "#888" : palette.text }} />
      <div className="flex-[0.75]" style={{ backgroundColor: palette.text }} />
    </div>
    {size !== "sm" && (
      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/65 text-white text-[7px] font-bold text-center py-0.5 truncate px-1">
          {palette.name}
        </div>
      </div>
    )}
    {isActive && (
      <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-violet-500 flex items-center justify-center">
        <Check size={7} className="text-white" strokeWidth={3} />
      </div>
    )}
  </button>
);

/* ═══════════════════════════════════════════
   MOBILE BOTTOM SHEET version of Style Panel
═══════════════════════════════════════════ */
const MobileStyleSheet = ({ portfolioData, onColorChange, onFontChange, onReset, onClose }) => {
  const [tab, setTab]             = useState("palettes"); // "palettes" | "colors" | "fonts"
  const [activeGroup, setActiveGroup] = useState("Professional");
  const [collapsed, setCollapsed] = useState(false);

  const currentBg   = portfolioData?.themeBg        || "#ffffff";
  const currentFg   = portfolioData?.themeFont       || "#111111";
  const currentFont = portfolioData?.themeFontFamily || "Switzer, sans-serif";
  const currentFontLabel = FONT_OPTIONS.find(f => f.value === currentFont)?.label || "Switzer";

  const sheetRef = useRef(null);

  return (
    <div className="fixed inset-0 z-[900] flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative pointer-events-auto bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: collapsed ? "auto" : "82vh" }}
      >
        {/* Drag handle + header */}
        <div className="flex flex-col items-center pt-2 pb-0 shrink-0">
          {/* Pill handle */}
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="w-10 h-1 bg-gray-300 rounded-full mb-3"
          />

          <div className="w-full flex items-center justify-between px-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center">
                <Palette size={14} className="text-violet-600" />
              </div>
              <span className="text-[14px] font-bold text-gray-900">Site Design</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-700 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                <RotateCcw size={10} /> Reset
              </button>
              <button type="button" onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>

        {!collapsed && (
          <>
            {/* ── Quick status bar ── */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md border border-gray-200" style={{ backgroundColor: currentBg }} />
                <div className="w-5 h-5 rounded-md border border-gray-200" style={{ backgroundColor: currentFg }} />
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div
                className="flex items-center gap-1 bg-violet-50 rounded-lg px-2 py-1 cursor-pointer"
                onClick={() => setTab("fonts")}
              >
                <Type size={10} className="text-violet-500" />
                <span className="text-[10px] font-bold text-violet-700" style={{ fontFamily: currentFont }}>
                  {currentFontLabel}
                </span>
                {/* Pulsing dot to attract attention to font option */}
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              </div>
              <span className="text-[9px] text-gray-400 ml-auto">Tap font to change ↑</span>
            </div>

            {/* ── Tabs ── */}
            <div className="flex shrink-0 border-b border-gray-100 bg-white">
              {[
                { id: "palettes", label: "🎨 Palettes" },
                { id: "colors",   label: "🖌 Custom"   },
                { id: "fonts",    label: "✏️ Fonts"    },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`
                    flex-1 py-2.5 text-[11px] font-bold transition-all relative
                    ${tab === t.id
                      ? "text-gray-900 border-b-2 border-violet-500"
                      : "text-gray-400"}
                  `}
                >
                  {t.label}
                  {t.id === "fonts" && tab !== "fonts" && (
                    <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-violet-400" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab content ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {/* PALETTES tab */}
              {tab === "palettes" && (
                <div className="pb-6">
                  {/* Group tabs — horizontal scroll */}
                  <div
                    className="flex gap-1.5 px-4 py-3 overflow-x-auto"
                    style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                  >
                    {PALETTE_GROUPS.map(({ group }) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setActiveGroup(group)}
                        className={`
                          px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap shrink-0 transition-all
                          ${activeGroup === group
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-500"}
                        `}
                      >
                        {group}
                      </button>
                    ))}
                  </div>

                  {/* Active group swatches — horizontal scroll row */}
                  <div className="px-4 mb-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{activeGroup}</p>
                    <div
                      className="flex gap-2 overflow-x-auto pb-1"
                      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                    >
                      {PALETTE_GROUPS.find(g => g.group === activeGroup)?.palettes.map(p => {
                        const isActive = currentBg === p.bg && currentFg === p.text;
                        return (
                          <div key={p.name} className="flex flex-col items-center gap-1 shrink-0">
                            <PaletteSwatch
                              palette={p}
                              isActive={isActive}
                              size="md"
                              onClick={() => { onColorChange("themeBg", p.bg); onColorChange("themeFont", p.text); }}
                            />
                            <span className="text-[7px] text-gray-400 font-medium">{p.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* All palettes — 2-row horizontal scroll */}
                  <div className="px-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">All Palettes</p>
                    <div
                      className="flex gap-1.5 overflow-x-auto pb-1"
                      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                    >
                      {PALETTE_GROUPS.flatMap(g => g.palettes).map(p => {
                        const isActive = currentBg === p.bg && currentFg === p.text;
                        return (
                          <PaletteSwatch
                            key={p.name}
                            palette={p}
                            isActive={isActive}
                            size="sm"
                            onClick={() => { onColorChange("themeBg", p.bg); onColorChange("themeFont", p.text); }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* COLORS tab */}
              {tab === "colors" && (
                <div className="p-4 flex flex-col gap-4">
                  {/* Live preview */}
                  <div
                    className="rounded-2xl p-4 border border-gray-100 text-center"
                    style={{ backgroundColor: currentBg, fontFamily: currentFont }}
                  >
                    <p className="text-[13px] font-bold" style={{ color: currentFg }}>Jane Doe</p>
                    <p className="text-[10px] opacity-55 mt-0.5 mb-3" style={{ color: currentFg }}>Designer & Dev</p>
                    <div className="inline-block px-3 py-1 rounded-full text-[9px] font-bold"
                      style={{ backgroundColor: currentFg, color: currentBg }}>
                      Hire Me
                    </div>
                  </div>

                  {[
                    { key: "themeBg",   label: "Background", hint: "Page background" },
                    { key: "themeFont", label: "Text Color",  hint: "Main text & icons" },
                  ].map(({ key, label, hint }) => (
                    <label key={key}
                      className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer gap-3 active:bg-gray-100">
                      <div>
                        <span className="text-[12px] font-bold text-gray-800 block">{label}</span>
                        <span className="text-[10px] text-gray-400">{hint}</span>
                        <span className="text-[9px] text-gray-400 font-mono block mt-0.5">
                          {portfolioData?.[key] || "#ffffff"}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md overflow-hidden relative ring-1 ring-gray-200 shrink-0"
                        style={{ backgroundColor: portfolioData?.[key] || "#fff" }}>
                        <input
                          type="color"
                          value={portfolioData?.[key] || "#ffffff"}
                          onChange={(e) => onColorChange(key, e.target.value)}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* FONTS tab */}
              {tab === "fonts" && (
                <div className="p-4 flex flex-col gap-2 pb-8">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Pick a Typeface</p>
                  {/* Font preview strip */}
                  <div
                    className="flex gap-2 overflow-x-auto pb-3 mb-1"
                    style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
                  >
                    {FONT_OPTIONS.map(font => {
                      const isActive = currentFont === font.value;
                      return (
                        <button
                          key={font.label}
                          type="button"
                          onClick={() => onFontChange(font.value)}
                          className={`
                            shrink-0 px-4 py-3 rounded-2xl border-2 flex flex-col gap-0.5 transition-all
                            ${isActive
                              ? "border-violet-500 bg-violet-50"
                              : "border-gray-200 bg-white"}
                          `}
                          style={{ minWidth: 100 }}
                        >
                          <span className="text-[18px] font-semibold leading-tight text-gray-900" style={{ fontFamily: font.value }}>
                            Aa
                          </span>
                          <span className="text-[10px] font-bold text-gray-700" style={{ fontFamily: font.value }}>
                            {font.label}
                          </span>
                          <span className="text-[8px] text-gray-400 uppercase tracking-wider">{font.type}</span>
                          {isActive && <Check size={10} className="text-violet-500 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Full list */}
                  {FONT_OPTIONS.map(font => {
                    const isActive = currentFont === font.value;
                    return (
                      <button
                        key={font.label}
                        type="button"
                        onClick={() => onFontChange(font.value)}
                        className={`
                          w-full px-4 py-3.5 rounded-2xl text-left border-2 transition-all relative flex items-center gap-3
                          ${isActive
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-100 bg-gray-50 text-gray-700"}
                        `}
                      >
                        <span className="text-[20px] font-semibold w-10 shrink-0" style={{ fontFamily: font.value }}>
                          Aa
                        </span>
                        <div>
                          <span className="block text-[13px] font-semibold" style={{ fontFamily: font.value }}>
                            {font.label}
                          </span>
                          <span className="block text-[9px] uppercase tracking-widest font-bold opacity-50 mt-0.5">
                            {font.type} · Aa Bb 123
                          </span>
                        </div>
                        {isActive && (
                          <span className="ml-auto w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   DESKTOP STYLE PANEL (unchanged layout, minor tweaks)
═══════════════════════════════════════════ */
const DesktopStylePanel = ({ portfolioData, onColorChange, onFontChange, onReset, onClose, side, panelRef }) => {
  const [minimized, setMinimized]   = useState(false);
  const [activeGroup, setActiveGroup] = useState("Professional");
  const [leftTab, setLeftTab]       = useState("palette");

  const currentBg   = portfolioData?.themeBg        || "#ffffff";
  const currentFg   = portfolioData?.themeFont       || "#111111";
  const currentFont = portfolioData?.themeFontFamily || "Switzer, sans-serif";
  const currentFontLabel = FONT_OPTIONS.find(f => f.value === currentFont)?.label || "Switzer";

  const currentGroupPalettes = PALETTE_GROUPS.find(g => g.group === activeGroup)?.palettes || [];

  const posStyle = side === "left"
    ? { left: 64, top: 56 }
    : { right: 64, top: 56 };

  return (
    <div
      ref={panelRef}
      className="fixed z-[800] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_48px_-8px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden"
      style={{
        ...posStyle,
        width: minimized ? 240 : 500,
        maxWidth: "calc(100vw - 80px)",
        maxHeight: "calc(100vh - 72px)",
        transition: "width 0.2s ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center">
            <Palette size={11} className="text-violet-600" />
          </div>
          <span className="text-[12px] font-bold text-gray-800">Site Design</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={onReset} title="Reset to defaults"
            className="flex items-center gap-0.5 text-[9px] font-semibold text-gray-400 hover:text-gray-700 px-1.5 py-1 rounded-lg hover:bg-gray-100 transition-all">
            <RotateCcw size={9} /> Reset
          </button>
          <button type="button" onClick={() => setMinimized(m => !m)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
            {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
          </button>
          <button type="button" onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Minimized state */}
      {minimized && (
        <div className="flex items-center gap-2 px-3 py-2 shrink-0">
          <div className="w-5 h-5 rounded-md border border-gray-200 shrink-0" style={{ backgroundColor: currentBg }} />
          <div className="w-5 h-5 rounded-md border border-gray-200 shrink-0" style={{ backgroundColor: currentFg }} />
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="flex items-center gap-1 bg-violet-50 hover:bg-violet-100 rounded-lg px-2 py-0.5 transition-all"
          >
            <Type size={9} className="text-violet-500 shrink-0" />
            <span className="text-[9px] text-violet-600 font-semibold" style={{ fontFamily: currentFont }}>
              {currentFontLabel}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 ml-0.5 animate-pulse" />
          </button>
        </div>
      )}

      {/* Full body */}
      {!minimized && (
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT COLUMN */}
          <div className="shrink-0 border-r border-gray-100 flex flex-col overflow-hidden" style={{ width: 185 }}>

            {/* Tabs */}
            <div className="flex shrink-0 border-b border-gray-100">
              <button type="button" onClick={() => setLeftTab("palette")}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1
                  ${leftTab === "palette" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                <Palette size={9} /> Colors
              </button>
              <button type="button" onClick={() => setLeftTab("font")}
                className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 relative
                  ${leftTab === "font" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                <Type size={9} /> Fonts
                {leftTab !== "font" && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Colors tab */}
            {leftTab === "palette" && (
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 flex flex-col gap-3">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preview</p>
                  <div className="rounded-xl p-3 border border-gray-100 text-center"
                    style={{ backgroundColor: currentBg, fontFamily: currentFont }}>
                    <p className="text-[11px] font-bold leading-tight" style={{ color: currentFg }}>Jane Doe</p>
                    <p className="text-[8px] opacity-55 mt-0.5 mb-2" style={{ color: currentFg }}>Designer & Dev</p>
                    <div className="inline-block px-2 py-0.5 rounded-full text-[7px] font-bold"
                      style={{ backgroundColor: currentFg, color: currentBg }}>
                      Hire Me
                    </div>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    <div className="flex-1 h-3 rounded border border-gray-200" style={{ backgroundColor: currentBg }} />
                    <div className="flex-1 h-3 rounded border border-gray-200" style={{ backgroundColor: currentFg }} />
                  </div>
                </div>

                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Custom</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { key: "themeBg",   label: "Background" },
                      { key: "themeFont", label: "Text Color"  },
                    ].map(({ key, label }) => (
                      <label key={key}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-white transition-all cursor-pointer gap-2">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-gray-600 block leading-tight">{label}</span>
                          <span className="text-[7.5px] text-gray-400 font-mono">{portfolioData?.[key] || "#ffffff"}</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg border-2 border-white shadow overflow-hidden relative ring-1 ring-gray-200 shrink-0"
                          style={{ backgroundColor: portfolioData?.[key] || "#fff" }}>
                          <input type="color" value={portfolioData?.[key] || "#ffffff"}
                            onChange={(e) => onColorChange(key, e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Font hint chip */}
                <button type="button" onClick={() => setLeftTab("font")}
                  className="flex items-center gap-2 p-2.5 bg-violet-50 border border-violet-100 rounded-xl hover:bg-violet-100 transition-all group">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center transition-all">
                    <Type size={12} className="text-violet-600" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-[9px] font-bold text-violet-700 leading-tight">Change Font</p>
                    <p className="text-[8px] text-violet-400 truncate" style={{ fontFamily: currentFont }}>
                      {currentFontLabel} — click to browse
                    </p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
                </button>
              </div>
            )}

            {/* Fonts tab */}
            {leftTab === "font" && (
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 flex flex-col gap-1.5">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Pick a Font</p>
                {FONT_OPTIONS.map((font) => {
                  const isActive = currentFont === font.value;
                  return (
                    <button key={font.label} type="button" onClick={() => onFontChange(font.value)}
                      className={`
                        w-full px-3 py-2.5 rounded-xl text-left border-2 transition-all relative
                        ${isActive
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-700"}
                      `}>
                      <span className="block text-[15px] font-semibold leading-tight" style={{ fontFamily: font.value }}>
                        {font.label}
                      </span>
                      <span className="block text-[8px] uppercase tracking-widest font-bold mt-0.5 opacity-50">
                        {font.type}
                      </span>
                      <span className="block text-[9px] mt-1 opacity-40" style={{ fontFamily: font.value }}>
                        Aa Bb Cc 123
                      </span>
                      {isActive && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Palettes */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center gap-0.5 px-2.5 pt-2.5 pb-2 shrink-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {PALETTE_GROUPS.map(({ group }) => (
                <button key={group} type="button" onClick={() => setActiveGroup(group)}
                  className={`
                    px-2 py-1 rounded-lg text-[8.5px] font-bold whitespace-nowrap transition-all shrink-0
                    ${activeGroup === group ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}
                  `}>
                  {group}
                </button>
              ))}
            </div>

            <div className="px-2.5 pb-2 shrink-0">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{activeGroup}</p>
              <div className="grid grid-cols-2 gap-2">
                {currentGroupPalettes.map((p) => {
                  const isActive = currentBg === p.bg && currentFg === p.text;
                  return (
                    <PaletteSwatch key={p.name} palette={p} isActive={isActive} size="md"
                      onClick={() => { onColorChange("themeBg", p.bg); onColorChange("themeFont", p.text); }} />
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-2.5 pb-3">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">All Palettes</p>
              <div className="grid grid-cols-4 gap-1.5">
                {PALETTE_GROUPS.flatMap(g => g.palettes).map((p) => {
                  const isActive = currentBg === p.bg && currentFg === p.text;
                  return (
                    <PaletteSwatch key={p.name} palette={p} isActive={isActive} size="sm"
                      onClick={() => { onColorChange("themeBg", p.bg); onColorChange("themeFont", p.text); }} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN EXPORT — auto-picks mobile vs desktop
═══════════════════════════════════════════ */
const StylePanel = (props) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* Desktop: close on outside click */
  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) props.onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 120);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [isMobile, props.onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") props.onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [props.onClose]);

  if (isMobile) {
    return <MobileStyleSheet {...props} />;
  }

  return <DesktopStylePanel {...props} panelRef={panelRef} />;
};

export default StylePanel;