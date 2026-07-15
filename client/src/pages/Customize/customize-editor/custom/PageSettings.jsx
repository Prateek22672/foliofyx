// src/pages/Customize/customize-editor/custom/PageSettings.jsx
// Per-page settings: background, overlay, SEO, scroll behavior.

import React from "react";
import { Upload, X, FileText } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { defaultCustomLayout } from "../../../Templates/Custom/constants";
import { T, inputStyle, Section, Row, Seg } from "./ui";

function getLayout(pd) {
  return pd?.customLayout ?? defaultCustomLayout();
}

const BG_PATTERNS = [
  { label: "None",       value: "none" },
  { label: "Dots",       value: "radial-gradient(#00000015 1px, transparent 1px)" },
  { label: "Grid",       value: "linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)" },
  { label: "Diagonal",   value: "repeating-linear-gradient(45deg, #00000008 0, #00000008 1px, transparent 0, transparent 50%)" },
  { label: "Crosshatch", value: "repeating-linear-gradient(0deg,transparent,transparent 24px,#00000010 25px), repeating-linear-gradient(90deg,transparent,transparent 24px,#00000010 25px)" },
  { label: "Noise",      value: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")" },
];

const OVERLAY_PRESETS = [
  { label: "None",             value: "none" },
  { label: "Dark 20%",         value: "rgba(0,0,0,0.2)" },
  { label: "Dark 40%",         value: "rgba(0,0,0,0.4)" },
  { label: "Dark 60%",         value: "rgba(0,0,0,0.6)" },
  { label: "Light 20%",        value: "rgba(255,255,255,0.2)" },
  { label: "Indigo gradient",  value: "linear-gradient(135deg,rgba(99,102,241,0.6),rgba(236,72,153,0.4))" },
  { label: "Warm gradient",    value: "linear-gradient(135deg,rgba(245,158,11,0.5),rgba(239,68,68,0.4))" },
  { label: "Ocean gradient",   value: "linear-gradient(135deg,rgba(6,182,212,0.5),rgba(99,102,241,0.4))" },
  { label: "Forest gradient",  value: "linear-gradient(135deg,rgba(16,185,129,0.5),rgba(20,184,166,0.4))" },
];

const colorSwatchStyle = {
  width: 30, height: 30, borderRadius: 6,
  border: `1px solid ${T.border}`, cursor: "pointer",
  padding: 2, background: T.input, flexShrink: 0,
};

function PageSettings() {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const layout      = getLayout(portfolioData);
  const activePage  = layout.pages?.find(p => p.id === layout.activePage);

  if (!activePage) return (
    <div style={{ padding: 24, textAlign: "center", color: T.textFaint }}>
      <FileText size={26} style={{ marginBottom: 8 }} />
      <p style={{ fontSize: 13 }}>No page selected</p>
    </div>
  );

  const patch = (p) => {
    setPortfolioData(prev => {
      const l = getLayout(prev);
      return {
        ...prev,
        customLayout: {
          ...l,
          pages: l.pages.map(pg => pg.id === l.activePage ? { ...pg, ...p } : pg),
        },
      };
    });
  };

  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => patch({ bgImage: ev.target.result });
    r.readAsDataURL(file);
  };

  const bg = activePage.bgColor || "#ffffff";
  const bgImage = activePage.bgImage || "";
  const pattern = activePage.bgPattern || "none";
  const overlay = activePage.bgOverlay || "none";
  const bgType  = activePage.bgType || "solid";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>

      {/* Page badge */}
      <div style={{ padding: "12px 16px 6px", flexShrink: 0 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 10px", borderRadius: 20,
          background: T.accentSoft, border: `1px solid ${T.accentBorder}`,
          fontSize: 11, fontWeight: 700, color: T.accentText,
        }}>
          <FileText size={11} /> {activePage.name}
        </div>
      </div>

      {/* ── BACKGROUND ─────────────────────────────────────────────────── */}
      <Section title="Background">

        {/* BG Type tabs */}
        <Row label="Type">
          <Seg
            value={bgType}
            onChange={t => patch({ bgType: t })}
            options={[
              { value: "solid",       node: "Solid" },
              { value: "gradient",    node: "Gradient" },
              { value: "image",       node: "Image" },
              { value: "transparent", node: "Clear", title: "Transparent" },
            ]}
          />
        </Row>

        {/* Solid */}
        {bgType === "solid" && (
          <Row label="Color">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="color"
                value={bg}
                onChange={e => patch({ bgColor: e.target.value })}
                title="Pick color"
                style={colorSwatchStyle}
              />
              <input type="text" value={bg} onChange={e => patch({ bgColor: e.target.value })} style={{ ...inputStyle, flex: 1, fontFamily: "ui-monospace, monospace" }} />
            </div>
            {/* Quick palette */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
              {["#ffffff","#0a0a0a","#f8fafc","#0f172a","#1e293b","#f0f0ff","#fef3c7","#ecfdf5","#fce7f3","#e0f2fe"].map(c => (
                <button
                  key={c} type="button"
                  onClick={() => patch({ bgColor: c })}
                  title={c}
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    border: bg === c ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                    background: c, cursor: "pointer", flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </Row>
        )}

        {/* Gradient */}
        {bgType === "gradient" && (
          <>
            <Row label="From">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={activePage.gradFrom || "#6366f1"} onChange={e => patch({ gradFrom: e.target.value })}
                  title="Pick color" style={colorSwatchStyle} />
                <input type="text" value={activePage.gradFrom || "#6366f1"} onChange={e => patch({ gradFrom: e.target.value })} style={{ ...inputStyle, flex: 1, fontFamily: "ui-monospace, monospace", fontSize: 11 }} />
              </div>
            </Row>
            <Row label="To">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={activePage.gradTo || "#ec4899"} onChange={e => patch({ gradTo: e.target.value })}
                  title="Pick color" style={colorSwatchStyle} />
                <input type="text" value={activePage.gradTo || "#ec4899"} onChange={e => patch({ gradTo: e.target.value })} style={{ ...inputStyle, flex: 1, fontFamily: "ui-monospace, monospace", fontSize: 11 }} />
              </div>
            </Row>
            <Row label="Direction">
              <select value={activePage.gradDir || "135deg"} onChange={e => patch({ gradDir: e.target.value })} style={inputStyle}>
                {[["90deg","Left to Right"],["270deg","Right to Left"],["180deg","Top to Bottom"],["0deg","Bottom to Top"],["135deg","Diagonal TL-BR"],["45deg","Diagonal BL-TR"],["225deg","Diagonal TR-BL"],["315deg","Diagonal BR-TL"]].map(([v,l]) =>
                  <option key={v} value={v}>{l}</option>
                )}
              </select>
            </Row>
            {/* Preset gradients */}
            <Row label="Presets">
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {[
                  ["#6366f1","#ec4899","Purple Pink"],
                  ["#0ea5e9","#6366f1","Ocean Indigo"],
                  ["#f59e0b","#ef4444","Sunset"],
                  ["#10b981","#0ea5e9","Mint Ocean"],
                  ["#1e293b","#0f172a","Dark Slate"],
                  ["#f0f4ff","#fce7f3","Soft Pastel"],
                ].map(([from, to, label]) => (
                  <button
                    key={label} type="button"
                    onClick={() => patch({ gradFrom: from, gradTo: to })}
                    title={label}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: `linear-gradient(135deg, ${from}, ${to})`,
                      border: (activePage.gradFrom === from && activePage.gradTo === to) ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </Row>
          </>
        )}

        {/* Image */}
        {bgType === "image" && (
          <>
            <Row label="Image">
              {bgImage ? (
                <div style={{ position: "relative" }}>
                  <img src={bgImage} alt="bg" style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: `1px solid ${T.border}` }} />
                  <button
                    type="button"
                    onClick={() => patch({ bgImage: null })}
                    title="Remove image"
                    style={{ position: "absolute", top: 6, right: 6, background: T.panel, border: `1px solid ${T.border}`, color: T.text, borderRadius: 6, padding: 3, cursor: "pointer", display: "flex" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: 16, border: `2px dashed ${T.border}`, borderRadius: 10,
                  cursor: "pointer", color: T.textDim, fontSize: 12, background: T.input,
                }}>
                  <Upload size={18} />
                  Click to upload
                  <input type="file" accept="image/*" onChange={handleBgUpload} style={{ display: "none" }} />
                </label>
              )}
              <input
                type="text"
                value={bgImage}
                placeholder="…or paste image URL"
                onChange={e => patch({ bgImage: e.target.value || null })}
                style={inputStyle}
              />
            </Row>

            <Row label="Size">
              <select value={activePage.bgSize || "cover"} onChange={e => patch({ bgSize: e.target.value })} style={inputStyle}>
                {["cover","contain","auto","100% 100%"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Row>
            <Row label="Position">
              <select value={activePage.bgPos || "center"} onChange={e => patch({ bgPos: e.target.value })} style={inputStyle}>
                {["center","top","bottom","left","right","top center","bottom center"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Row>
            <Row label="Repeat">
              <select value={activePage.bgRepeat || "no-repeat"} onChange={e => patch({ bgRepeat: e.target.value })} style={inputStyle}>
                {["no-repeat","repeat","repeat-x","repeat-y"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Row>
            <Row label="Parallax">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={!!activePage.bgParallax}
                  onChange={e => patch({ bgParallax: e.target.checked })}
                  style={{ width: 14, height: 14, cursor: "pointer", accentColor: T.accent }}
                />
                <span style={{ fontSize: 11, color: T.text }}>Enable parallax scrolling</span>
              </div>
            </Row>
          </>
        )}

      </Section>

      {/* ── OVERLAY ──────────────────────────────────────────────────────── */}
      <Section title="Overlay / Tint" defaultOpen={false}>
        <Row label="Overlay Preset">
          <select value={overlay} onChange={e => patch({ bgOverlay: e.target.value })} style={inputStyle}>
            {OVERLAY_PRESETS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Row>
        {overlay !== "none" && !overlay.startsWith("linear") && (
          <Row label="Custom Overlay Color">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={overlay.match(/#[0-9a-f]{3,6}/i)?.[0] || "#000000"} onChange={e => patch({ bgOverlay: e.target.value })}
                title="Pick color" style={colorSwatchStyle} />
              <input type="text" value={overlay} onChange={e => patch({ bgOverlay: e.target.value })} style={{ ...inputStyle, flex: 1, fontFamily: "ui-monospace, monospace", fontSize: 11 }} />
            </div>
          </Row>
        )}
      </Section>

      {/* ── PATTERN ──────────────────────────────────────────────────────── */}
      <Section title="Pattern Overlay" defaultOpen={false}>
        <Row label="Pattern">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {BG_PATTERNS.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => patch({ bgPattern: value })}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 6,
                  border: `1px solid ${pattern === value ? T.accentBorder : T.border}`,
                  background: pattern === value ? T.accentSoft : T.input,
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{
                  width: 28, height: 20, borderRadius: 4, flexShrink: 0,
                  background: "#ffffff",
                  backgroundImage: value !== "none" ? value : undefined,
                  backgroundSize: value === BG_PATTERNS[1].value ? "16px 16px" : value === BG_PATTERNS[2].value ? "25px 25px" : "20px 20px",
                  border: `1px solid ${T.border}`,
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: pattern === value ? T.accentText : T.textDim }}>{label}</span>
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* ── PAGE LAYOUT ──────────────────────────────────────────────────── */}
      <Section title="Page Layout" defaultOpen={false}>
        <Row label="Max Width">
          <select value={activePage.maxWidth || "100%"} onChange={e => patch({ maxWidth: e.target.value })} style={inputStyle}>
            {["100%","1536px","1280px","1024px","960px","720px"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
        <Row label="Min Height">
          <select value={activePage.minHeight || "100vh"} onChange={e => patch({ minHeight: e.target.value })} style={inputStyle}>
            {["100vh","auto","600px","800px","1000px"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
        <Row label="Overflow">
          <select value={activePage.overflow || "auto"} onChange={e => patch({ overflow: e.target.value })} style={inputStyle}>
            {["auto","hidden","scroll","visible"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
      </Section>

      {/* ── URL & SLUG ──────────────────────────────────────────────────── */}
      <Section title="URL & SEO" defaultOpen={false}>
        <Row label="Slug" hint="URL path">
          <input
            type="text"
            value={activePage.slug || "/"}
            onChange={e => patch({ slug: e.target.value })}
            style={{ ...inputStyle, fontFamily: "ui-monospace, monospace" }}
            placeholder="/about"
          />
        </Row>
        <Row label="Page Title" hint="Browser tab">
          <input type="text" value={activePage.seoTitle || ""} onChange={e => patch({ seoTitle: e.target.value })} style={inputStyle} placeholder="My Awesome Page" />
        </Row>
        <Row label="Meta Description" hint="Search engines">
          <textarea
            value={activePage.seoDesc || ""}
            onChange={e => patch({ seoDesc: e.target.value })}
            rows={3}
            placeholder="Describe this page in 150 characters…"
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </Row>
        <Row label="OG Image URL" hint="Social share">
          <input type="text" value={activePage.ogImage || ""} onChange={e => patch({ ogImage: e.target.value })} style={inputStyle} placeholder="https://..." />
        </Row>
        <Row label="Hidden from nav">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={!!activePage.hiddenFromNav}
              onChange={e => patch({ hiddenFromNav: e.target.checked })}
              style={{ width: 14, height: 14, cursor: "pointer", accentColor: T.accent }}
            />
            <span style={{ fontSize: 11, color: T.text }}>Don't show in navigation</span>
          </div>
        </Row>
      </Section>

      {/* ── SCROLL & TRANSITION ─────────────────────────────────────────── */}
      <Section title="Scroll & Transition" defaultOpen={false}>
        <Row label="Scroll Behavior">
          <select value={activePage.scrollBehavior || "auto"} onChange={e => patch({ scrollBehavior: e.target.value })} style={inputStyle}>
            <option value="auto">Auto</option>
            <option value="smooth">Smooth</option>
          </select>
        </Row>
        <Row label="Page Transition">
          <select value={activePage.pageTransition || "none"} onChange={e => patch({ pageTransition: e.target.value })} style={inputStyle}>
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slideLeft">Slide Left</option>
            <option value="slideUp">Slide Up</option>
            <option value="zoom">Zoom</option>
          </select>
        </Row>
      </Section>

      <div style={{ height: 20 }} />
    </div>
  );
}

export default PageSettings;
