// src/pages/Templates/Custom/ElementRenderer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in replacement for your existing ElementRenderer.
// Handles every type the AI can generate — no more "Unknown element type" boxes.
// Keeps the same prop interface so CustomCanvas.jsx needs ZERO changes.
//
// Props (same as before):
//   element          — the canvas element object
//   isEditing        — boolean (inline text editing active)
//   readOnly         — boolean
//   onContentChange  — (value | object) => void
//   onSrcChange      — (src: string) => void
//   pages            — array of pages (for navbar page links)
//   activePage       — active page id
//   onPageChange     — (pageId) => void
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useEffect } from "react";

// ── Google Font loader ────────────────────────────────────────────────────────
const _loadedFonts = new Set();
function loadFont(family) {
  if (!family || family === "inherit" || _loadedFonts.has(family)) return;
  const safe = ["Arial","Helvetica","Georgia","Times New Roman","Courier New","Verdana"];
  if (safe.includes(family)) return;
  _loadedFonts.add(family);
  const link  = document.createElement("link");
  link.rel    = "stylesheet";
  link.href   = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

// ── Build CSS background string ───────────────────────────────────────────────
function buildBackground(s = {}) {
  if (s.bgImage) return `url("${s.bgImage}") center / ${s.bgSize || "cover"} no-repeat`;
  if (s.bgType === "gradient" && s.gradientFrom && s.gradientTo)
    return `linear-gradient(${s.gradientDir || "135deg"}, ${s.gradientFrom}, ${s.gradientTo})`;
  return s.bgColor && s.bgColor !== "transparent" ? s.bgColor : "transparent";
}

// ── Inline editable text ──────────────────────────────────────────────────────
function EditableText({ value, isEditing, readOnly, onChange, tag: Tag = "span", style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }, [isEditing]);

  return (
    <Tag
      ref={ref}
      contentEditable={isEditing && !readOnly}
      suppressContentEditableWarning
      onBlur={e => onChange?.(e.currentTarget.textContent)}
      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ref.current?.blur(); }}}
      style={{ ...style, outline: "none", minWidth: 20 }}
    >
      {value}
    </Tag>
  );
}

// ── Button renderer ───────────────────────────────────────────────────────────
function RenderButton({ el, isEditing, readOnly, onContentChange }) {
  const s  = el.styles || {};
  loadFont(s.fontFamily);
  const outlined = s.bgType === "transparent" || (!s.bgColor || s.bgColor === "transparent");
  let bg = outlined ? "transparent" : (s.bgColor || "#111827");
  if (s.bgType === "gradient" && s.gradientFrom && s.gradientTo)
    bg = `linear-gradient(${s.gradientDir || "135deg"}, ${s.gradientFrom}, ${s.gradientTo})`;

  return (
    <button
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        justifyContent:"center",
        width:         "100%",
        height:        "100%",
        padding:       typeof s.padding === "number" ? `${s.padding * 0.5}px ${s.padding}px` : "12px 28px",
        background:    bg,
        color:         s.color || "#ffffff",
        fontFamily:    s.fontFamily ? `'${s.fontFamily}', sans-serif` : "inherit",
        fontSize:      s.fontSize   ? `${s.fontSize}px`   : "15px",
        fontWeight:    s.fontWeight || "700",
        borderRadius:  s.borderRadius ? `${s.borderRadius}px` : "8px",
        border:        outlined ? `${s.borderWidth || 2}px solid ${s.borderColor || s.color || "#ffffff"}` : "none",
        boxShadow:     s.boxShadow !== "none" ? s.boxShadow : undefined,
        letterSpacing: s.letterSpacing ? `${s.letterSpacing}px` : undefined,
        textTransform: s.textTransform || undefined,
        cursor:        readOnly ? "pointer" : "default",
        whiteSpace:    "nowrap",
      }}
    >
      <EditableText
        value={el.content || "Button"}
        isEditing={isEditing}
        readOnly={readOnly}
        onChange={onContentChange}
      />
    </button>
  );
}

// ── Image renderer ────────────────────────────────────────────────────────────
function RenderImage({ el, onSrcChange, readOnly }) {
  const s = el.styles || {};
  const [err, setErr] = useState(false);
  const isAvatar = el.type === "avatar";

  if (el.src && !err) {
    return (
      <img
        src={el.src}
        alt={el.alt || ""}
        draggable={false}
        onError={() => setErr(true)}
        style={{
          width:          "100%",
          height:         "100%",
          objectFit:      s.objectFit      || "cover",
          objectPosition: s.objectPosition || "center",
          borderRadius:   isAvatar ? "50%" : (s.borderRadius ? `${s.borderRadius}px` : undefined),
          display:        "block",
          filter:         s.filter !== "none" ? s.filter : undefined,
          opacity:        s.opacity !== undefined ? s.opacity : 1,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width:"100%", height:"100%",
        background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap: 8,
        borderRadius: isAvatar ? "50%" : (s.borderRadius ? `${s.borderRadius}px` : undefined),
      }}
      onClick={() => {
        if (readOnly) return;
        const url = prompt("Paste image URL:", el.src || "");
        if (url) onSrcChange?.(url);
      }}
    >
      <span style={{ fontSize: 28, opacity: 0.4 }}>🖼</span>
      {!readOnly && (
        <span style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", padding: "0 12px" }}>
          Click to set image URL
        </span>
      )}
    </div>
  );
}

// ── Embed YouTube/Vimeo ───────────────────────────────────────────────────────
function RenderVideo({ el }) {
  const s   = el.styles || {};
  const url = el.src || "";
  const getEmbed = (u) => {
    const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
    const vm = u.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return u;
  };
  const embed = url ? getEmbed(url) : null;
  return (
    <div style={{ width:"100%", height:"100%", background:"#0f172a", borderRadius: s.borderRadius ? `${s.borderRadius}px` : "8px", overflow:"hidden" }}>
      {embed
        ? <iframe src={embed} width="100%" height="100%" style={{ border:"none", display:"block" }} allow="autoplay; fullscreen" title="video" />
        : <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", flexDirection:"column", gap:8 }}>
            <span style={{ fontSize:36, opacity:0.3 }}>▶</span>
            <span style={{ fontSize:11, color:"#94a3b8" }}>Paste YouTube / Vimeo URL in Style tab</span>
          </div>
      }
    </div>
  );
}

// ── Stats — "2,847|Projects Done" ────────────────────────────────────────────
function RenderStats({ el, isEditing, readOnly, onContentChange }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "0|Label").split("|");
  const num   = parts[0] || "0";
  const lbl   = parts[1] || "";
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems: s.textAlign === "center" ? "center" : "flex-start",
      justifyContent:"center", height:"100%", gap: 6,
      padding: s.padding ? `${s.padding}px` : "16px",
    }}>
      <div style={{
        fontSize:      `${s.fontSize || 56}px`,
        fontWeight:    s.fontWeight || "800",
        color:         s.color || "#6366f1",
        fontFamily:    s.fontFamily ? `'${s.fontFamily}',sans-serif` : "inherit",
        lineHeight:    1,
        letterSpacing: s.letterSpacing ? `${s.letterSpacing}px` : "-1px",
      }}>
        {num}
      </div>
      {lbl && (
        <div style={{
          fontSize: "14px", fontWeight: "500",
          color: s.color ? `${s.color}99` : "#94a3b8",
          fontFamily: s.fontFamily ? `'${s.fontFamily}',sans-serif` : "inherit",
          letterSpacing: "0.5px",
          textTransform: s.textTransform || undefined,
        }}>
          {lbl}
        </div>
      )}
    </div>
  );
}

// ── Testimonial — "Quote|Name|Role" ──────────────────────────────────────────
function RenderTestimonial({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Great product!|Name|Role").split("|");
  const quote = parts[0] || "";
  const name  = parts[1] || "";
  const role  = parts[2] || "";
  const pad   = s.padding || 28;
  return (
    <div style={{ padding: `${pad}px`, display:"flex", flexDirection:"column", gap:12, height:"100%", boxSizing:"border-box" }}>
      <div style={{ fontSize:60, lineHeight:1, color: s.borderColor || "#6366f1", opacity:0.15, fontFamily:"Georgia,serif", marginBottom:-16 }}>"</div>
      <p style={{ margin:0, fontSize:`${s.fontSize||16}px`, color:s.color||"#374151", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:s.lineHeight||1.7, fontStyle:"italic" }}>
        {quote}
      </p>
      <div style={{ marginTop:"auto" }}>
        <div style={{ color:"#f59e0b", fontSize:13, marginBottom:6 }}>★★★★★</div>
        {name && <div style={{ fontSize:14, fontWeight:700, color:s.color||"#0f172a" }}>{name}</div>}
        {role && <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{role}</div>}
      </div>
    </div>
  );
}

// ── Pricing — "Plan|$79|/mo|Desc|Feat1|Feat2" ────────────────────────────────
function RenderPricing({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts  = (el.content || "Pro|$79|/mo").split("|");
  const plan   = parts[0] || "Plan";
  const price  = parts[1] || "$0";
  const period = parts[2] || "/mo";
  const desc   = parts[3] || "";
  const feats  = parts.slice(4);
  const pad    = s.padding || 32;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", flexDirection:"column", gap:16, height:"100%", boxSizing:"border-box" }}>
      <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:2, color:s.color?`${s.color}aa`:"#6366f1" }}>{plan}</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:2 }}>
        <span style={{ fontSize:`${s.fontSize||48}px`, fontWeight:"800", color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:1 }}>{price}</span>
        <span style={{ fontSize:14, color:"#94a3b8" }}>{period}</span>
      </div>
      {desc && <p style={{ margin:0, fontSize:14, color:"#64748b", lineHeight:1.5 }}>{desc}</p>}
      {feats.length > 0 && (
        <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:8, flex:1 }}>
          {feats.map((f,i) => (
            <li key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:s.color||"#374151" }}>
              <span style={{ color:"#22c55e", fontWeight:700, flexShrink:0 }}>✓</span> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Team card — "Name|Title|Bio" ──────────────────────────────────────────────
function RenderTeam({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Name|Title|Bio").split("|");
  const name  = parts[0] || "Team Member";
  const title = parts[1] || "Role";
  const bio   = parts[2] || "";
  const [err, setErr] = useState(false);
  const pad   = s.padding || 24;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", flexDirection:"column", alignItems:"center", gap:12, textAlign:"center", height:"100%", boxSizing:"border-box" }}>
      {el.src && !err
        ? <img src={el.src} alt={name} onError={() => setErr(true)} style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover", border:`3px solid ${s.borderColor||"#e0e7ff"}`, boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }} />
        : <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"#fff", flexShrink:0 }}>{name.charAt(0)}</div>
      }
      <div>
        <div style={{ fontSize:`${s.fontSize||17}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{name}</div>
        <div style={{ fontSize:13, color:"#6366f1", fontWeight:600, marginTop:2 }}>{title}</div>
        {bio && <p style={{ margin:"8px 0 0", fontSize:13, color:"#6b7280", lineHeight:1.5 }}>{bio}</p>}
      </div>
    </div>
  );
}

// ── Feature — "Title|Desc|emoji" ─────────────────────────────────────────────
function RenderFeature({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Feature|Description|✦").split("|");
  const ttl   = parts[0] || "Feature";
  const desc  = parts[1] || "";
  const icon  = parts[2] || "✦";
  const pad   = s.padding || 24;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", flexDirection:"column", gap:12, height:"100%", boxSizing:"border-box" }}>
      <div style={{ width:48, height:48, borderRadius:12, background:s.borderColor?`${s.borderColor}18`:"#f0f0ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:s.borderColor||"#6366f1", flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ fontSize:`${s.fontSize||18}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{ttl}</div>
      {desc && <p style={{ margin:0, fontSize:14, color:"#64748b", lineHeight:1.6 }}>{desc}</p>}
    </div>
  );
}

// ── Service — "Title|Desc|emoji" ─────────────────────────────────────────────
function RenderService({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Service|Description|⚙").split("|");
  const ttl   = parts[0] || "Service";
  const desc  = parts[1] || "";
  const icon  = parts[2] || "⚙";
  const pad   = s.padding || 24;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", gap:16, alignItems:"flex-start", height:"100%", boxSizing:"border-box" }}>
      <div style={{ width:44, height:44, borderRadius:10, background:s.borderColor?`${s.borderColor}15`:"#f0f0ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, color:s.borderColor||"#6366f1" }}>{icon}</div>
      <div>
        <div style={{ fontSize:`${s.fontSize||16}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{ttl}</div>
        {desc && <p style={{ margin:"6px 0 0", fontSize:13, color:"#64748b", lineHeight:1.5 }}>{desc}</p>}
      </div>
    </div>
  );
}

// ── Property — "Name|Price|Details" ──────────────────────────────────────────
function RenderProperty({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts   = (el.content || "Property|$500,000|3 Bed • 2 Bath").split("|");
  const name    = parts[0] || "Property";
  const price   = parts[1] || "$0";
  const details = parts[2] || "";
  const [err, setErr] = useState(false);
  return (
    <div style={{ width:"100%", height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {el.src && !err
        ? <img src={el.src} alt={name} onError={() => setErr(true)} style={{ width:"100%", height:180, objectFit:"cover", display:"block", flexShrink:0 }} />
        : <div style={{ width:"100%", height:180, background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontSize:32, opacity:0.3 }}>🏠</span></div>
      }
      <div style={{ padding:"16px 20px", flex:1 }}>
        <div style={{ fontSize:`${s.fontSize||17}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{name}</div>
        <div style={{ fontSize:22, fontWeight:800, color:"#059669", margin:"6px 0" }}>{price}</div>
        {details && <div style={{ fontSize:13, color:"#64748b" }}>{details}</div>}
      </div>
    </div>
  );
}

// ── FAQ — "Question|Answer" ───────────────────────────────────────────────────
function RenderFAQ({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Question?|Answer.").split("|");
  const q     = parts[0] || "Question?";
  const a     = parts[1] || "Answer.";
  const pad   = s.padding || 20;
  return (
    <div style={{ padding:`${pad}px`, borderBottom:`1px solid ${s.borderColor||"#f1f5f9"}`, height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div style={{ fontSize:`${s.fontSize||17}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:1.4 }}>{q}</div>
        <span style={{ fontSize:20, color:"#6366f1", fontWeight:300, flexShrink:0 }}>+</span>
      </div>
      <p style={{ margin:"10px 0 0", fontSize:14, color:"#64748b", lineHeight:1.6 }}>{a}</p>
    </div>
  );
}

// ── Timeline — "Title|Desc|Year" ─────────────────────────────────────────────
function RenderTimeline({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const parts = (el.content || "Milestone|Description|2024").split("|");
  const ttl   = parts[0] || "Milestone";
  const desc  = parts[1] || "";
  const year  = parts[2] || "";
  const pad   = s.padding || 16;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", gap:16, height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0 }}>
        <div style={{ width:12, height:12, borderRadius:"50%", background:s.borderColor||"#6366f1", flexShrink:0 }} />
        <div style={{ width:2, flex:1, background:`${s.borderColor||"#6366f1"}30` }} />
      </div>
      <div style={{ paddingBottom:16 }}>
        {year && <div style={{ fontSize:11, fontWeight:700, color:s.borderColor||"#6366f1", marginBottom:4, letterSpacing:1, textTransform:"uppercase" }}>{year}</div>}
        <div style={{ fontSize:`${s.fontSize||16}px`, fontWeight:700, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{ttl}</div>
        {desc && <p style={{ margin:"4px 0 0", fontSize:13, color:"#64748b", lineHeight:1.5 }}>{desc}</p>}
      </div>
    </div>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function RenderCTA({ el, isEditing, readOnly, onContentChange }) {
  const s   = el.styles || {};
  loadFont(s.fontFamily);
  const pad = s.padding || 48;
  return (
    <div style={{ padding:`${pad}px 40px`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, textAlign:"center", height:"100%", boxSizing:"border-box" }}>
      <EditableText
        value={el.content || "Ready to get started?"}
        isEditing={isEditing} readOnly={readOnly} onChange={onContentChange}
        tag="p"
        style={{ margin:0, fontSize:`${s.fontSize||22}px`, color:s.color||"#f1f5f9", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:s.lineHeight||1.5, fontWeight:s.fontWeight||"600" }}
      />
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function RenderNavbar({ el, pages, activePage, onPageChange, readOnly }) {
  const s = el.styles || {};
  loadFont(s.fontFamily);
  const brandName = el.content || "Brand";
  return (
    <div style={{ display:"flex", alignItems:"center", padding:`0 ${s.padding||40}px`, height:"100%", gap:32, background:buildBackground(s) }}>
      <div style={{ fontSize:`${s.fontSize||18}px`, fontWeight:800, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", flexShrink:0 }}>
        {brandName}
      </div>
      <div style={{ display:"flex", gap:24, marginLeft:"auto" }}>
        {(pages||[]).slice(0,4).map(p => (
          <button key={p.id} onClick={() => !readOnly && onPageChange?.(p.id)}
            style={{ fontSize:14, fontWeight:500, color:p.id===activePage?(s.borderColor||"#6366f1"):(s.color||"#374151"), background:"none", border:"none", cursor:readOnly?"default":"pointer", padding:0 }}>
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function RenderFooter({ el }) {
  const s   = el.styles || {};
  loadFont(s.fontFamily);
  const pad = s.padding || 40;
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`0 ${pad}px`, height:"100%", flexWrap:"wrap", gap:12 }}>
      <div style={{ fontSize:14, fontWeight:700, color:s.color||"#94a3b8", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>
        {el.content || "© 2025 Company. All rights reserved."}
      </div>
      <div style={{ display:"flex", gap:20 }}>
        {["Privacy","Terms","Contact"].map(item => (
          <span key={item} style={{ fontSize:13, color:s.color||"#94a3b8", cursor:"pointer" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Logo strip — "Brand A|Brand B|Brand C" ───────────────────────────────────
function RenderLogostrip({ el }) {
  const s      = el.styles || {};
  loadFont(s.fontFamily);
  const brands = (el.content || "Brand A|Brand B|Brand C|Brand D|Brand E").split("|");
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-around", padding:`0 ${s.padding||40}px`, height:"100%", flexWrap:"wrap", gap:20 }}>
      {brands.map((b,i) => (
        <div key={i} style={{ fontSize:14, fontWeight:700, color:s.color||"#94a3b8", letterSpacing:1, textTransform:"uppercase", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{b}</div>
      ))}
    </div>
  );
}

// ── Social icons ──────────────────────────────────────────────────────────────
function RenderSocial({ el }) {
  const s    = el.styles || {};
  const icons = ["𝕏","in","f","▶"];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:s.padding?`${s.padding}px`:"12px", height:"100%", boxSizing:"border-box" }}>
      {icons.map((ic,i) => (
        <div key={i} style={{ width:36, height:36, borderRadius:"50%", background:s.bgColor||"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer", border:`1px solid ${s.borderColor||"#e2e8f0"}`, color:s.color||"#374151" }}>
          {ic}
        </div>
      ))}
    </div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────
function RenderForm({ el }) {
  const s   = el.styles || {};
  const pad = s.padding || 24;
  return (
    <div style={{ padding:`${pad}px`, display:"flex", flexDirection:"column", gap:12, height:"100%", boxSizing:"border-box" }}>
      {["Name","Email","Message"].map((field, i) => (
        i < 2
          ? <input key={field} type={i===1?"email":"text"} placeholder={field} readOnly
              style={{ width:"100%", padding:"10px 14px", border:`1px solid ${s.borderColor||"#e2e8f0"}`, borderRadius:8, fontSize:14, background:"#fafafa", boxSizing:"border-box", pointerEvents:"none", outline:"none" }} />
          : <textarea key={field} placeholder={field} readOnly rows={3}
              style={{ width:"100%", padding:"10px 14px", border:`1px solid ${s.borderColor||"#e2e8f0"}`, borderRadius:8, fontSize:14, background:"#fafafa", resize:"none", boxSizing:"border-box", pointerEvents:"none", outline:"none" }} />
      ))}
      <button style={{ padding:"11px 24px", background:s.bgColor||"linear-gradient(135deg,#6366f1,#7c3aed)", color:s.color||"#fff", border:"none", borderRadius:8, fontSize:14, fontWeight:700, cursor:"pointer" }}>
        Send Message
      </button>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────
function RenderInput({ el }) {
  const s = el.styles || {};
  return (
    <div style={{ display:"flex", alignItems:"center", width:"100%", height:"100%" }}>
      <input type="text" placeholder={el.content||"Type here..."} readOnly
        style={{ width:"100%", padding:"10px 14px", border:`${s.borderWidth||1}px solid ${s.borderColor||"#e2e8f0"}`, borderRadius:`${s.borderRadius||8}px`, fontSize:`${s.fontSize||15}px`, color:s.color||"#374151", background:s.bgColor||"#fff", outline:"none", pointerEvents:"none", boxSizing:"border-box" }} />
    </div>
  );
}

// ── Map embed ─────────────────────────────────────────────────────────────────
function RenderMap({ el }) {
  const s = el.styles || {};
  return (
    <div style={{ width:"100%", height:"100%", borderRadius:s.borderRadius?`${s.borderRadius}px`:"8px", overflow:"hidden" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30593530316!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1719000000000!5m2!1sen!2sus"
        width="100%" height="100%" style={{ border:"none", display:"block" }} loading="lazy" title="map"
      />
    </div>
  );
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function RenderCountdown({ el }) {
  const s = el.styles || {};
  loadFont(s.fontFamily);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, height:"100%", padding:s.padding?`${s.padding}px`:"16px" }}>
      {[["00","Days"],["00","Hours"],["00","Mins"],["00","Secs"]].map(([v,l]) => (
        <div key={l} style={{ textAlign:"center" }}>
          <div style={{ fontSize:`${s.fontSize||40}px`, fontWeight:800, color:s.color||"#0f172a", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:1 }}>{v}</div>
          <div style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1, marginTop:4 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ── Tabs — "Tab1|Tab2|Tab3" ───────────────────────────────────────────────────
function RenderTabs({ el }) {
  const s    = el.styles || {};
  loadFont(s.fontFamily);
  const tabs = (el.content||"Tab 1|Tab 2|Tab 3").split("|");
  return (
    <div style={{ padding:s.padding?`${s.padding}px`:"16px", height:"100%", boxSizing:"border-box" }}>
      <div style={{ display:"flex", borderBottom:`2px solid ${s.borderColor||"#e2e8f0"}`, marginBottom:16 }}>
        {tabs.map((t,i) => (
          <div key={i} style={{ padding:"10px 20px", fontSize:14, fontWeight:i===0?700:500, color:i===0?(s.color||"#6366f1"):"#94a3b8", borderBottom:i===0?`2px solid ${s.color||"#6366f1"}`:"none", marginBottom:-2, cursor:"pointer" }}>{t}</div>
        ))}
      </div>
      <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6 }}>Tab content goes here.</p>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function RenderGallery({ el }) {
  const s = el.styles || {};
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, padding:s.padding?`${s.padding}px`:"8px", height:"100%", boxSizing:"border-box" }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ background:"linear-gradient(135deg,#f1f5f9,#e2e8f0)", borderRadius:8, aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#94a3b8" }}>🖼</div>
      ))}
    </div>
  );
}

// ── Breadcrumb — "Home|Services|Contact" ─────────────────────────────────────
function RenderBreadcrumb({ el }) {
  const s     = el.styles || {};
  loadFont(s.fontFamily);
  const crumbs = (el.content||"Home|Page").split("|");
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:s.padding?`${s.padding}px`:"12px", height:"100%", boxSizing:"border-box" }}>
      {crumbs.map((c,i) => (
        <React.Fragment key={i}>
          <span style={{ fontSize:`${s.fontSize||13}px`, color:i===crumbs.length-1?(s.color||"#0f172a"):"#94a3b8", fontWeight:i===crumbs.length-1?600:400, cursor:"pointer", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit" }}>{c}</span>
          {i < crumbs.length-1 && <span style={{ color:"#94a3b8", fontSize:12 }}>›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Icon ─────────────────────────────────────────────────────────────────────
function RenderIcon({ el }) {
  const s = el.styles || {};
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent: s.textAlign==="center"?"center":s.textAlign==="right"?"flex-end":"flex-start", height:"100%", padding:s.padding?`${s.padding}px`:"0" }}>
      <span style={{ fontSize:`${s.fontSize||32}px`, color:s.color||"#6366f1" }}>{el.content||"★"}</span>
    </div>
  );
}

// ── Generic section / container / card / hero background block ───────────────
function RenderSection({ el }) {
  const s  = el.styles || {};
  loadFont(s.fontFamily);
  const bg = buildBackground(s);
  const pad = s.padding || 0;
  return (
    <div style={{
      width:"100%", height:"100%",
      background: bg,
      borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
      boxShadow: s.boxShadow !== "none" ? s.boxShadow : undefined,
      padding: pad ? `${pad}px` : undefined,
      opacity: s.opacity !== undefined ? s.opacity : 1,
      boxSizing:"border-box",
      backdropFilter: s.backdropBlur ? `blur(${s.backdropBlur}px)` : undefined,
    }}>
      {el.content && (
        <p style={{ margin:0, fontSize:`${s.fontSize||15}px`, color:s.color||"#374151", fontFamily:s.fontFamily?`'${s.fontFamily}',sans-serif`:"inherit", lineHeight:s.lineHeight||1.6 }}>
          {el.content}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export function ElementRenderer({ element: el, isEditing, readOnly, onContentChange, onSrcChange, pages, activePage, onPageChange }) {
  if (!el) return null;

  const s   = el.styles || {};
  const type = el.type || "paragraph";

  // Load Google Font if specified
  loadFont(s.fontFamily);

  // ── Text element base style ───────────────────────────────────────────────
  const textStyle = {
    margin:        0,
    padding:       s.padding ? `${s.padding}px` : undefined,
    fontFamily:    s.fontFamily ? `'${s.fontFamily}', sans-serif` : "inherit",
    fontSize:      s.fontSize   ? `${s.fontSize}px`   : undefined,
    fontWeight:    s.fontWeight  || undefined,
    fontStyle:     s.fontStyle   || undefined,
    color:         s.color       || undefined,
    textAlign:     s.textAlign   || undefined,
    lineHeight:    s.lineHeight  || undefined,
    letterSpacing: s.letterSpacing ? `${s.letterSpacing}px` : undefined,
    textTransform: s.textTransform || undefined,
    textShadow:    s.textShadow !== "none" ? s.textShadow : undefined,
    width:         "100%",
  };

  // ─── ROUTING ──────────────────────────────────────────────────────────────
  switch (type) {

    // ── All text types ──────────────────────────────────────────────────────
    case "heading":
      return (
        <EditableText value={el.content||"Heading"} isEditing={isEditing} readOnly={readOnly} onChange={onContentChange}
          tag="h1" style={{ ...textStyle, fontSize:s.fontSize?`${s.fontSize}px`:"48px", fontWeight:s.fontWeight||"800", lineHeight:s.lineHeight||1.15, letterSpacing:s.letterSpacing?`${s.letterSpacing}px`:"-1px" }} />
      );
    case "subheading":
      return (
        <EditableText value={el.content||"Subheading"} isEditing={isEditing} readOnly={readOnly} onChange={onContentChange}
          tag="h2" style={{ ...textStyle, fontSize:s.fontSize?`${s.fontSize}px`:"24px", fontWeight:s.fontWeight||"500", lineHeight:s.lineHeight||1.5 }} />
      );
    case "paragraph":
      return (
        <EditableText value={el.content||"Your text here."} isEditing={isEditing} readOnly={readOnly} onChange={onContentChange}
          tag="p" style={{ ...textStyle, fontSize:s.fontSize?`${s.fontSize}px`:"16px", lineHeight:s.lineHeight||1.7 }} />
      );
    case "label":
      return (
        <div style={{ display:"flex", alignItems:"center", height:"100%" }}>
          <span style={{ ...textStyle, fontSize:s.fontSize?`${s.fontSize}px`:"11px", fontWeight:s.fontWeight||"700", letterSpacing:s.letterSpacing?`${s.letterSpacing}px`:"3px", textTransform:s.textTransform||"uppercase", display:"inline-block" }}>
            <EditableText value={el.content||"LABEL"} isEditing={isEditing} readOnly={readOnly} onChange={onContentChange} />
          </span>
        </div>
      );
    case "quote":
      return (
        <blockquote style={{ ...textStyle, borderLeft:`4px solid ${s.borderColor||"#6366f1"}`, paddingLeft:"20px", fontSize:s.fontSize?`${s.fontSize}px`:"20px", fontStyle:"italic", lineHeight:s.lineHeight||1.6, margin:0 }}>
          <EditableText value={el.content||"Your inspiring quote."} isEditing={isEditing} readOnly={readOnly} onChange={onContentChange} />
        </blockquote>
      );
    case "list":
      return (
        <ul style={{ ...textStyle, paddingLeft:20, lineHeight:s.lineHeight||1.8, fontSize:s.fontSize?`${s.fontSize}px`:"16px" }}>
          {(el.content||"Item one\nItem two\nItem three").split("\n").map((item,i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    // ── Interactive ─────────────────────────────────────────────────────────
    case "button":
      return <RenderButton el={el} isEditing={isEditing} readOnly={readOnly} onContentChange={onContentChange} />;

    case "input":
      return <RenderInput el={el} />;

    case "form":
      return <RenderForm el={el} />;

    // ── Media ───────────────────────────────────────────────────────────────
    case "image":
    case "avatar":
    case "logo":
      return <RenderImage el={el} onSrcChange={onSrcChange} readOnly={readOnly} />;

    case "video":
      return <RenderVideo el={el} />;

    case "icon":
      return <RenderIcon el={el} />;

    case "gallery":
      return <RenderGallery el={el} />;

    // ── Layout ──────────────────────────────────────────────────────────────
    case "divider":
      return (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center" }}>
          <div style={{ width:"100%", height:`${s.borderWidth||1}px`, background:s.bgColor||s.borderColor||"#e2e8f0", borderStyle:s.borderStyle||"solid" }} />
        </div>
      );

    case "spacer":
      return <div style={{ width:"100%", height:"100%" }} />;

    case "card":
    case "container":
    case "columns":
    case "section":
    case "hero":  // hero is a BG block — content is rendered by separate elements on top
    case "bg":    // ← THIS was causing "Unknown element type: bg" — now handled
      return <RenderSection el={el} />;

    case "cta":
      return <RenderCTA el={el} isEditing={isEditing} readOnly={readOnly} onContentChange={onContentChange} />;

    // ── Navigation ──────────────────────────────────────────────────────────
    case "navbar":
      return <RenderNavbar el={el} pages={pages} activePage={activePage} onPageChange={onPageChange} readOnly={readOnly} />;

    case "footer":
      return <RenderFooter el={el} />;

    case "breadcrumb":
      return <RenderBreadcrumb el={el} />;

    case "tabs":
      return <RenderTabs el={el} />;

    // ── Business blocks ─────────────────────────────────────────────────────
    case "stats":
      return <RenderStats el={el} isEditing={isEditing} readOnly={readOnly} onContentChange={onContentChange} />;

    case "testimonial":
      return <RenderTestimonial el={el} />;

    case "pricing":
      return <RenderPricing el={el} />;

    case "team":
      return <RenderTeam el={el} />;

    case "feature":
      return <RenderFeature el={el} />;

    case "service":
      return <RenderService el={el} />;

    case "property":
      return <RenderProperty el={el} />;

    case "faq":
      return <RenderFAQ el={el} />;

    case "timeline":
      return <RenderTimeline el={el} />;

    case "logostrip":  // ← THIS was "Unknown element type: logostrip"
      return <RenderLogostrip el={el} />;

    case "social":
      return <RenderSocial el={el} />;

    case "map":
      return <RenderMap el={el} />;

    case "countdown":
      return <RenderCountdown el={el} />;

    // ── Fallback — catches anything else the AI might generate ───────────────
    default:
      return (
        <div style={{
          width:"100%", height:"100%",
          background: buildBackground(s),
          borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
          boxShadow: s.boxShadow !== "none" ? s.boxShadow : undefined,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding: s.padding ? `${s.padding}px` : "12px",
          boxSizing:"border-box",
        }}>
          {el.content && (
            <p style={{ ...textStyle, margin:0 }}>
              {el.content}
            </p>
          )}
        </div>
      );
  }
}

export default ElementRenderer;