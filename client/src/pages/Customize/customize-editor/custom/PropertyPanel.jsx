// src/pages/Customize/customize-editor/custom/PropertyPanel.jsx
// Shows style controls for the currently-selected canvas element.

import React, { useState } from "react";
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Lock, Unlock, Trash2, Copy, Eye, EyeOff,
  MousePointerClick, Link2, Unlink,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { EL } from "../../../Templates/Custom/constants";
import { T, inputStyle, iconBtn, Section, Row, Seg, NumberInput, ColorPicker } from "./ui";

const FONTS = [
  "inherit", "Inter", "DM Sans", "Syne", "Playfair Display",
  "Space Grotesk", "Outfit", "Raleway", "Poppins", "Nunito",
  "Merriweather", "Lora", "Source Serif 4", "JetBrains Mono",
  "Fira Code", "Georgia", "Arial", "Helvetica", "Oswald", "Bebas Neue",
];

const SHADOWS = [
  { label: "None",    value: "none" },
  { label: "XS",     value: "0 1px 2px rgba(0,0,0,0.08)" },
  { label: "SM",     value: "0 1px 6px rgba(0,0,0,0.12)" },
  { label: "MD",     value: "0 4px 16px rgba(0,0,0,0.14)" },
  { label: "LG",     value: "0 8px 30px rgba(0,0,0,0.18)" },
  { label: "XL",     value: "0 24px 60px rgba(0,0,0,0.24)" },
  { label: "Glow",   value: "0 0 20px rgba(99,102,241,0.5)" },
  { label: "Warm",   value: "0 8px 30px rgba(245,158,11,0.35)" },
];

const BLEND_MODES = [
  "normal","multiply","screen","overlay","darken",
  "lighten","color-dodge","color-burn","hard-light","soft-light",
];

function getLayout(pd) { return pd?.customLayout ?? { pages: [], activePage: null }; }

function SpacingGrid({ value = {}, onChange }) {
  const sides = ["top", "right", "bottom", "left"];
  const [linked, setLinked] = useState(true);

  const handleChange = (side, v) => {
    if (linked) {
      const next = {};
      sides.forEach(s => next[s] = v);
      onChange(next);
    } else {
      onChange({ ...value, [side]: v });
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4, marginBottom: 4 }}>
        {sides.map(side => (
          <div key={side}>
            <div style={{ fontSize: 9, color: T.textFaint, textAlign: "center", marginBottom: 2, textTransform: "capitalize" }}>{side}</div>
            <input
              type="number"
              value={value[side] ?? 0}
              min={0} max={200}
              onChange={e => handleChange(side, parseFloat(e.target.value) || 0)}
              style={{ ...inputStyle, textAlign: "center", padding: "4px 2px" }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setLinked(l => !l)}
        title={linked ? "Edit sides individually" : "Link all sides"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 10, color: linked ? T.accentText : T.textFaint,
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}
      >
        {linked ? <Link2 size={10} /> : <Unlink size={10} />}
        {linked ? "Linked" : "Individual"}
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function PropertyPanel({ selectedId, onDelete, onDuplicate }) {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const layout = getLayout(portfolioData);
  const activePage = layout.pages?.find(p => p.id === layout.activePage);
  const element = activePage?.elements?.find(el => el.id === selectedId);

  if (!selectedId || !element) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: T.textFaint }}>
        <MousePointerClick size={28} color={T.textFaint} style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>No element selected</p>
        <p style={{ fontSize: 11, lineHeight: 1.6, marginTop: 6, color: T.textDim }}>
          Click any element on the canvas to edit its style, content, and layout here.
        </p>
        <div style={{
          marginTop: 16, padding: "10px 12px", background: T.input,
          borderRadius: 8, border: `1px solid ${T.border}`, textAlign: "left",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.textDim, marginBottom: 6, letterSpacing: "0.06em" }}>KEYBOARD SHORTCUTS</p>
          {[
            ["Arrows", "Nudge 1px (Shift: 10px)"],
            ["Delete", "Remove element"],
            ["Ctrl+D", "Duplicate"],
            ["Ctrl+Z", "Undo"],
            ["Ctrl+Shift+Z", "Redo"],
            ["Ctrl+]", "Bring forward"],
            ["Ctrl+[", "Send backward"],
            ["Esc", "Deselect"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <code style={{ fontSize: 10, background: T.panelAlt, border: `1px solid ${T.borderSoft}`, padding: "1px 5px", borderRadius: 4, color: T.text }}>{k}</code>
              <span style={{ fontSize: 10, color: T.textFaint }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Patchers ──────────────────────────────────────────────────────────────
  const patchStyles = (patch) => {
    setPortfolioData(prev => {
      const l = getLayout(prev);
      return {
        ...prev,
        customLayout: {
          ...l,
          pages: l.pages.map(p =>
            p.id === l.activePage
              ? { ...p, elements: p.elements.map(el =>
                  el.id === selectedId ? { ...el, styles: { ...el.styles, ...patch } } : el
                )}
              : p
          ),
        },
      };
    });
  };

  const patchElement = (patch) => {
    setPortfolioData(prev => {
      const l = getLayout(prev);
      return {
        ...prev,
        customLayout: {
          ...l,
          pages: l.pages.map(p =>
            p.id === l.activePage
              ? { ...p, elements: p.elements.map(el =>
                  el.id === selectedId ? { ...el, ...patch } : el
                )}
              : p
          ),
        },
      };
    });
  };

  const { styles = {}, type } = element;

  const isText = ![EL?.IMAGE, EL?.DIVIDER, EL?.SPACER, EL?.VIDEO].includes(type);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>

      {/* ── Element header / toolbar ─────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 16px", borderBottom: `1px solid ${T.border}`,
        background: T.panelAlt, flexShrink: 0,
        position: "sticky", top: 0, zIndex: 2,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: T.accentText, textTransform: "capitalize", flex: 1,
          background: T.accentSoft, padding: "2px 8px", borderRadius: 6, border: `1px solid ${T.accentBorder}`,
        }}>
          {type}
        </span>
        <button type="button" onClick={() => onDuplicate?.(selectedId)} title="Duplicate element"
          style={iconBtn}><Copy size={13} /></button>
        <button type="button"
          onClick={() => patchElement({ visible: element.visible === false })}
          title={element.visible === false ? "Show element" : "Hide element"}
          style={iconBtn}>
          {element.visible === false ? <EyeOff size={13} color={T.danger} /> : <Eye size={13} />}
        </button>
        <button type="button"
          onClick={() => patchElement({ locked: !element.locked })}
          title={element.locked ? "Unlock element" : "Lock element"}
          style={iconBtn}>
          {element.locked ? <Lock size={13} color={T.danger} /> : <Unlock size={13} />}
        </button>
        <button type="button" onClick={() => onDelete?.(selectedId)} title="Delete element"
          style={{ ...iconBtn, color: T.danger }}><Trash2 size={13} /></button>
      </div>

      {/* ── POSITION & SIZE ────────────────────────────────────────────────── */}
      <Section title="Position & Size">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[["X", "x", 0], ["Y", "y", 0], ["W", "width", 40], ["H", "height", 20]].map(([lbl, key, mn]) => (
            <div key={key}>
              <label style={{ fontSize: 10, color: T.textFaint }}>{lbl}</label>
              <NumberInput
                value={element[key] === "auto" ? "" : element[key]}
                min={mn}
                onChange={v => patchElement({ [key]: v || (key === "height" ? "auto" : 0) })}
                suffix="px"
              />
            </div>
          ))}
        </div>
        <Row label="Z-Index">
          <NumberInput value={element.zIndex ?? 1} min={0} max={999} onChange={v => patchElement({ zIndex: v })} />
        </Row>
        <Row label="Rotation">
          <NumberInput value={styles.rotate ?? 0} min={-360} max={360} onChange={v => patchStyles({ rotate: v })} suffix="deg" />
        </Row>
      </Section>

      {/* ── TYPOGRAPHY ─────────────────────────────────────────────────────── */}
      {isText && (
        <Section title="Typography">
          <Row label="Font Family">
            <select value={styles.fontFamily || "inherit"} onChange={e => patchStyles({ fontFamily: e.target.value })} style={inputStyle}>
              {FONTS.map(f => <option key={f} value={f}>{f === "inherit" ? "Theme Font" : f}</option>)}
            </select>
          </Row>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <Row label="Size">
              <NumberInput value={styles.fontSize || 16} min={8} max={200} onChange={v => patchStyles({ fontSize: v })} suffix="px" />
            </Row>
            <Row label="Weight">
              <select value={styles.fontWeight || "400"} onChange={e => patchStyles({ fontWeight: e.target.value })} style={inputStyle}>
                {[["300","Light"],["400","Regular"],["500","Medium"],["600","SemiBold"],["700","Bold"],["800","ExtraBold"],["900","Black"]].map(([w, l]) =>
                  <option key={w} value={w}>{l}</option>
                )}
              </select>
            </Row>
          </div>

          <Row label="Color">
            <ColorPicker value={styles.color || "#111827"} onChange={v => patchStyles({ color: v })} />
          </Row>

          <Row label="Align">
            <Seg
              value={styles.textAlign || "left"}
              onChange={v => patchStyles({ textAlign: v })}
              options={[
                { value: "left",    node: <AlignLeft size={13} />,    title: "Align left" },
                { value: "center",  node: <AlignCenter size={13} />,  title: "Align center" },
                { value: "right",   node: <AlignRight size={13} />,   title: "Align right" },
                { value: "justify", node: <AlignJustify size={13} />, title: "Justify" },
              ]}
            />
          </Row>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <Row label="Line Height">
              <NumberInput value={styles.lineHeight || 1.5} min={0.8} max={4} step={0.1} onChange={v => patchStyles({ lineHeight: v })} />
            </Row>
            <Row label="Letter Spacing">
              <NumberInput value={styles.letterSpacing || 0} min={-5} max={20} step={0.5} onChange={v => patchStyles({ letterSpacing: v })} suffix="px" />
            </Row>
          </div>

          <Row label="Text Transform">
            <Seg
              value={styles.textTransform || "none"}
              onChange={v => patchStyles({ textTransform: v })}
              options={[
                { value: "none",       node: "Aa", title: "None" },
                { value: "uppercase",  node: "AA", title: "Uppercase" },
                { value: "lowercase",  node: "aa", title: "Lowercase" },
                { value: "capitalize", node: "Aa", title: "Capitalize" },
              ]}
            />
          </Row>

          <Row label="Font Style">
            <Seg
              value={styles.fontStyle || "normal"}
              onChange={v => patchStyles({ fontStyle: v })}
              options={[
                { value: "normal",  node: "N", title: "Normal" },
                { value: "italic",  node: <em>I</em>, title: "Italic" },
                { value: "oblique", node: <em>O</em>, title: "Oblique" },
              ]}
            />
          </Row>

          <Row label="Text Shadow">
            <select value={styles.textShadow || "none"} onChange={e => patchStyles({ textShadow: e.target.value })} style={inputStyle}>
              <option value="none">None</option>
              <option value="1px 1px 2px rgba(0,0,0,0.3)">Soft</option>
              <option value="2px 2px 4px rgba(0,0,0,0.5)">Medium</option>
              <option value="0 0 10px rgba(99,102,241,0.8)">Glow Indigo</option>
              <option value="0 0 10px rgba(245,158,11,0.8)">Glow Amber</option>
              <option value="3px 3px 0px rgba(0,0,0,0.8)">Hard</option>
            </select>
          </Row>
        </Section>
      )}

      {/* ── BACKGROUND ─────────────────────────────────────────────────────── */}
      {![EL?.DIVIDER, EL?.SPACER].includes(type) && (
        <Section title="Background" defaultOpen={false}>
          <Row label="BG Type">
            <Seg
              value={styles.bgType || "solid"}
              onChange={t => patchStyles({ bgType: t, bgColor: t === "none" ? "transparent" : (styles.bgColor || "#ffffff") })}
              options={[
                { value: "solid",    node: "Solid" },
                { value: "gradient", node: "Gradient" },
                { value: "none",     node: "None" },
              ]}
            />
          </Row>

          {(styles.bgType !== "gradient" && styles.bgType !== "none") && (
            <Row label="BG Color">
              <ColorPicker value={styles.bgColor || "transparent"} onChange={v => patchStyles({ bgColor: v })} allowTransparent />
            </Row>
          )}

          {styles.bgType === "gradient" && (
            <>
              <Row label="Gradient From">
                <ColorPicker value={styles.gradientFrom || "#6366f1"} onChange={v => patchStyles({ gradientFrom: v })} />
              </Row>
              <Row label="Gradient To">
                <ColorPicker value={styles.gradientTo || "#ec4899"} onChange={v => patchStyles({ gradientTo: v })} />
              </Row>
              <Row label="Direction">
                <select value={styles.gradientDir || "135deg"} onChange={e => patchStyles({ gradientDir: e.target.value })} style={inputStyle}>
                  {[["90deg","Left to Right"],["270deg","Right to Left"],["180deg","Top to Bottom"],["0deg","Bottom to Top"],["135deg","Diagonal TL-BR"],["45deg","Diagonal BL-TR"]].map(([v,l]) =>
                    <option key={v} value={v}>{l}</option>
                  )}
                </select>
              </Row>
            </>
          )}

          <Row label="BG Image URL">
            <input
              type="text"
              value={styles.bgImage || ""}
              placeholder="https://..."
              onChange={e => patchStyles({ bgImage: e.target.value })}
              style={inputStyle}
            />
          </Row>

          {styles.bgImage && (
            <Row label="BG Size">
              <select value={styles.bgSize || "cover"} onChange={e => patchStyles({ bgSize: e.target.value })} style={inputStyle}>
                {["cover","contain","auto","100% 100%"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Row>
          )}

          <Row label="Backdrop Blur">
            <NumberInput value={styles.backdropBlur || 0} min={0} max={40} onChange={v => patchStyles({ backdropBlur: v })} suffix="px" />
          </Row>
        </Section>
      )}

      {/* ── BORDER & RADIUS ─────────────────────────────────────────────────── */}
      {![EL?.DIVIDER, EL?.SPACER].includes(type) && (
        <Section title="Border" defaultOpen={false}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <Row label="Width">
              <NumberInput value={styles.borderWidth || 0} min={0} max={20} onChange={v => patchStyles({ borderWidth: v })} suffix="px" />
            </Row>
            <Row label="Style">
              <select value={styles.borderStyle || "solid"} onChange={e => patchStyles({ borderStyle: e.target.value })} style={inputStyle}>
                {["solid","dashed","dotted","double","none"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Row>
          </div>
          <Row label="Color">
            <ColorPicker value={styles.borderColor || "#e5e7eb"} onChange={v => patchStyles({ borderColor: v })} />
          </Row>
          <Row label="Radius">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
              {["TL","TR","BR","BL"].map((corner, i) => {
                const keys = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];
                return (
                  <div key={corner}>
                    <div style={{ fontSize: 9, color: T.textFaint, textAlign: "center", marginBottom: 2 }}>{corner}</div>
                    <input
                      type="number" min={0} max={200}
                      value={styles[keys[i]] ?? styles.borderRadius ?? 0}
                      onChange={e => patchStyles({ [keys[i]]: parseFloat(e.target.value) })}
                      style={{ ...inputStyle, textAlign: "center", padding: "4px 2px" }}
                    />
                  </div>
                );
              })}
            </div>
          </Row>
        </Section>
      )}

      {/* ── SPACING ─────────────────────────────────────────────────────────── */}
      <Section title="Spacing" defaultOpen={false}>
        <Row label="Padding">
          <SpacingGrid
            value={typeof styles.paddingObj === "object" ? styles.paddingObj : { top: styles.padding || 0, right: styles.padding || 0, bottom: styles.padding || 0, left: styles.padding || 0 }}
            onChange={v => patchStyles({ paddingObj: v, padding: undefined })}
          />
        </Row>
        <Row label="Margin">
          <SpacingGrid
            value={styles.marginObj || { top: 0, right: 0, bottom: 0, left: 0 }}
            onChange={v => patchStyles({ marginObj: v })}
          />
        </Row>
      </Section>

      {/* ── EFFECTS ─────────────────────────────────────────────────────────── */}
      <Section title="Effects" defaultOpen={false}>
        <Row label="Box Shadow">
          <select value={styles.boxShadow || "none"} onChange={e => patchStyles({ boxShadow: e.target.value })} style={inputStyle}>
            {SHADOWS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Row>

        <Row label="Opacity">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range" min={0} max={100}
              value={Math.round((styles.opacity ?? 1) * 100)}
              onChange={e => patchStyles({ opacity: parseFloat(e.target.value) / 100 })}
              style={{ flex: 1, accentColor: T.accent }}
            />
            <span style={{ fontSize: 11, color: T.text, minWidth: 32, textAlign: "right" }}>
              {Math.round((styles.opacity ?? 1) * 100)}%
            </span>
          </div>
        </Row>

        <Row label="Blend Mode">
          <select value={styles.mixBlendMode || "normal"} onChange={e => patchStyles({ mixBlendMode: e.target.value })} style={inputStyle}>
            {BLEND_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Row>

        <Row label="Filter">
          <select value={styles.filter || "none"} onChange={e => patchStyles({ filter: e.target.value })} style={inputStyle}>
            <option value="none">None</option>
            <option value="blur(4px)">Blur</option>
            <option value="grayscale(100%)">Grayscale</option>
            <option value="sepia(100%)">Sepia</option>
            <option value="brightness(1.3)">Brighten</option>
            <option value="contrast(1.3)">Contrast</option>
            <option value="invert(100%)">Invert</option>
            <option value="saturate(2)">Saturate</option>
          </select>
        </Row>

        <Row label="Cursor">
          <select value={styles.cursor || "default"} onChange={e => patchStyles({ cursor: e.target.value })} style={inputStyle}>
            {["default","pointer","text","move","not-allowed","grab","crosshair","zoom-in"].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
        </Row>
      </Section>

      {/* ── ANIMATION ──────────────────────────────────────────────────────── */}
      <Section title="Animation" defaultOpen={false}>
        <Row label="Entrance">
          <select value={element.animation || "none"} onChange={e => patchElement({ animation: e.target.value })} style={inputStyle}>
            <option value="none">None</option>
            <option value="fadeIn">Fade In</option>
            <option value="fadeUp">Fade Up</option>
            <option value="fadeDown">Fade Down</option>
            <option value="slideLeft">Slide from Left</option>
            <option value="slideRight">Slide from Right</option>
            <option value="zoomIn">Zoom In</option>
            <option value="bounceIn">Bounce In</option>
            <option value="flipX">Flip X</option>
          </select>
        </Row>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <Row label="Delay">
            <NumberInput value={element.animDelay || 0} min={0} max={3000} step={100} onChange={v => patchElement({ animDelay: v })} suffix="ms" />
          </Row>
          <Row label="Duration">
            <NumberInput value={element.animDuration || 600} min={100} max={3000} step={100} onChange={v => patchElement({ animDuration: v })} suffix="ms" />
          </Row>
        </div>
        <Row label="Hover Effect">
          <select value={styles.hoverEffect || "none"} onChange={e => patchStyles({ hoverEffect: e.target.value })} style={inputStyle}>
            <option value="none">None</option>
            <option value="lift">Lift (translate up)</option>
            <option value="scale">Scale up</option>
            <option value="glow">Glow border</option>
            <option value="dim">Dim</option>
          </select>
        </Row>
      </Section>

      {/* ── MEDIA-SPECIFIC ─────────────────────────────────────────────────── */}
      {type === EL?.IMAGE && (
        <Section title="Image" defaultOpen>
          <Row label="URL">
            <input type="text" value={element.src || ""} placeholder="https://..." onChange={e => patchElement({ src: e.target.value })} style={inputStyle} />
          </Row>
          <Row label="Alt Text">
            <input type="text" value={element.alt || ""} onChange={e => patchElement({ alt: e.target.value })} style={inputStyle} />
          </Row>
          <Row label="Object Fit">
            <select value={styles.objectFit || "cover"} onChange={e => patchStyles({ objectFit: e.target.value })} style={inputStyle}>
              {["cover","contain","fill","none","scale-down"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Row>
          <Row label="Object Position">
            <select value={styles.objectPosition || "center"} onChange={e => patchStyles({ objectPosition: e.target.value })} style={inputStyle}>
              {["center","top","bottom","left","right","top left","top right","bottom left","bottom right"].map(v =>
                <option key={v} value={v}>{v}</option>
              )}
            </select>
          </Row>
        </Section>
      )}

      {type === EL?.VIDEO && (
        <Section title="Video" defaultOpen>
          <Row label="YouTube / Vimeo URL">
            <input type="text" value={element.src || ""} placeholder="https://youtube.com/..." onChange={e => patchElement({ src: e.target.value })} style={inputStyle} />
          </Row>
        </Section>
      )}

      {type === EL?.BUTTON && (
        <Section title="Button" defaultOpen>
          <Row label="Link URL">
            <input type="text" value={element.href || ""} placeholder="https://..." onChange={e => patchElement({ href: e.target.value })} style={inputStyle} />
          </Row>
          <Row label="Open in">
            <select value={element.target || "_self"} onChange={e => patchElement({ target: e.target.value })} style={inputStyle}>
              <option value="_self">Same tab</option>
              <option value="_blank">New tab</option>
            </select>
          </Row>
        </Section>
      )}

      {type === EL?.DIVIDER && (
        <Section title="Divider" defaultOpen>
          <Row label="Color">
            <ColorPicker value={styles.bgColor || "#e5e7eb"} onChange={v => patchStyles({ bgColor: v })} />
          </Row>
          <Row label="Style">
            <select value={styles.borderStyle || "solid"} onChange={e => patchStyles({ borderStyle: e.target.value })} style={inputStyle}>
              {["solid","dashed","dotted","double"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Row>
        </Section>
      )}

      {/* ── ADVANCED ─────────────────────────────────────────────────────────── */}
      <Section title="Advanced" defaultOpen={false}>
        <Row label="Custom CSS Class">
          <input type="text" value={element.className || ""} placeholder="my-class" onChange={e => patchElement({ className: e.target.value })} style={inputStyle} />
        </Row>
        <Row label="Element ID">
          <input type="text" value={element.htmlId || ""} placeholder="hero-section" onChange={e => patchElement({ htmlId: e.target.value })} style={inputStyle} />
        </Row>
        <Row label="Link Wrap">
          <input type="text" value={element.linkWrap || ""} placeholder="https://..." onChange={e => patchElement({ linkWrap: e.target.value })} style={inputStyle} />
        </Row>
        <Row label="Overflow">
          <select value={styles.overflow || "visible"} onChange={e => patchStyles({ overflow: e.target.value })} style={inputStyle}>
            {["visible","hidden","scroll","auto"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Row>
      </Section>

      <div style={{ height: 20 }} />
    </div>
  );
}

export default PropertyPanel;
