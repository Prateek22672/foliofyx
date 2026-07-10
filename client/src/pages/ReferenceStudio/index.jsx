// client/src/pages/ReferenceStudio/index.jsx
// "Design from Reference" — dedicated full-screen flow.
// User supplies a reference (describe / screenshot / url / code) → backend extracts
// structure + design tokens → we preview the generated page → hand off to the editor.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ElementRenderer } from "../Customize/customize-editor/custom/CanvasElementRenderer";
import { defaultCustomLayout } from "../Templates/Custom/constants";
import { analyzeReference } from "../../api/referenceAPI";

const CANVAS_W = 1200;

const MODES = [
  { id: "text",  label: "Describe",   hint: "Tell us the vibe and we build it." },
  { id: "image", label: "Screenshot", hint: "Upload a screenshot of any design." },
  { id: "url",   label: "URL",        hint: "Paste a live site (coming soon)." },
  { id: "html",  label: "Code / Zip", hint: "Upload HTML or a .zip (coming soon)." },
];

// Scaled, read-only preview of the generated elements (reuses the real renderer).
function Preview({ elements }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => wrapRef.current && setScale(Math.min(1, wrapRef.current.offsetWidth / CANVAS_W));
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);
  const maxY = elements.reduce((m, e) => Math.max(m, (e.y || 0) + (e.height === "auto" ? 80 : e.height || 0)), 0);
  return (
    <div ref={wrapRef} style={{ width: "100%", overflow: "hidden", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff" }}>
      <div style={{ width: CANVAS_W, height: maxY, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}>
        {elements.map((el) => (
          <div key={el.id} style={{ position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height === "auto" ? undefined : el.height, zIndex: el.zIndex || 1 }}>
            <ElementRenderer element={el} readOnly />
          </div>
        ))}
      </div>
      <div style={{ height: maxY * scale }} />
    </div>
  );
}

export default function ReferenceStudio() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("text");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const onPickFile = (f) => {
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = (e) => setFilePreview(e.target.result);
    r.readAsDataURL(f);
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    if (mode === "url" || mode === "html") {
      setError("This input is coming soon. For now, describe the design or upload a screenshot.");
      return;
    }
    if (mode === "image" && !file) { setError("Upload a screenshot first."); return; }
    if (mode === "text" && !description.trim()) { setError("Describe the design you want."); return; }

    setStatus("loading");
    try {
      const data = await analyzeReference({ mode, file: mode === "image" ? file : null, description, url });
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const openInBuilder = () => {
    if (!result?.elements?.length) return;
    const layout = defaultCustomLayout();
    const base = layout.pages[0];
    const bg = result.page?.bg || result.tokens?.bg || base.bgColor;
    const page = {
      ...base,
      elements: result.elements,
      bgColor: bg,
      bgType: "solid",
    };
    const portfolioData = {
      // `name` is required by the Portfolio model — without it the DB save fails.
      name: "Reference Site",
      template: "custom",
      themeBg: bg,
      customLayout: { ...layout, pages: [page], activePage: page.id },
    };
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    navigate("/customize/custom");
  };

  const loading = status === "loading";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 24px", fontFamily: "Outfit, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <button onClick={() => navigate(-1)} style={ghostBtn}>← Back</button>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Structural mimic · your assets, their layout</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "8px 0 4px" }}>Design from a Reference</h1>
        <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: 15 }}>
          Describe a site, upload a screenshot, and we'll rebuild its layout and colours using editable elements.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>
          {/* Input card */}
          <div style={card}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {MODES.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{ ...tab, ...(mode === m.id ? tabActive : {}) }}>
                  {m.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 14px" }}>{MODES.find((m) => m.id === mode)?.hint}</p>

            {mode === "text" && (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A bold, dark agency landing page with a big hero, client logos, 3 service cards, stats, testimonials, and a strong call to action."
                rows={6}
                style={textareaStyle}
              />
            )}

            {mode === "image" && (
              <div>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onPickFile(e.dataTransfer.files?.[0]); }}
                  style={dropzone}
                >
                  {filePreview
                    ? <img src={filePreview} alt="reference" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }} />
                    : <span style={{ color: "#94a3b8", fontSize: 14 }}>Click or drop a PNG / JPG screenshot here</span>}
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden
                    onChange={(e) => onPickFile(e.target.files?.[0])} />
                </div>
                <input value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional: add context (e.g. 'SaaS for dentists')" style={{ ...input, marginTop: 12 }} />
              </div>
            )}

            {(mode === "url" || mode === "html") && (
              <div style={{ padding: 16, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, color: "#9a3412", fontSize: 14 }}>
                {mode === "url"
                  ? "Live-URL capture is coming soon. For now, take a screenshot and use the Screenshot tab."
                  : "HTML / .zip import is coming soon. For now, use a screenshot or describe the design."}
              </div>
            )}

            {error && <div style={errBox}>{error}</div>}

            <button onClick={handleAnalyze} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.6 : 1, marginTop: 16 }}>
              {loading ? "Analyzing…" : "✨ Generate Layout"}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <strong style={{ fontSize: 15, color: "#0f172a" }}>{result.count} elements · {result.industry}</strong>
                {result.replicated
                  ? <span style={badgeGreen}>Replicated from your image</span>
                  : result.sawImage
                    ? <span style={badgeGreen}>Vision AI · saw your image</span>
                    : result.personalized
                      ? <span style={badgeGreen}>AI-personalized</span>
                      : <span style={badgeGray}>Template copy</span>}
              </div>

              {result.palette?.swatches && (
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {result.palette.swatches.map((c, i) => (
                    <div key={i} title={c} style={{ width: 28, height: 28, borderRadius: 6, background: c, border: "1px solid #e2e8f0" }} />
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {result.sections.map((s, i) => (
                  <span key={i} style={chip}>{s}</span>
                ))}
              </div>

              <Preview elements={result.elements} />

              <button onClick={openInBuilder} style={{ ...primaryBtn, marginTop: 16 }}>
                Open in Builder →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── inline styles ─────────────────────────────────────────────────────────────
const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" };
const tab = { padding: "8px 14px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const tabActive = { background: "#6366f1", color: "#fff", borderColor: "#6366f1" };
const textareaStyle = { width: "100%", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" };
const input = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", outline: "none" };
const dropzone = { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, border: "2px dashed #cbd5e1", borderRadius: 12, cursor: "pointer", background: "#f8fafc", padding: 12 };
const primaryBtn = { width: "100%", padding: "13px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" };
const ghostBtn = { padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, cursor: "pointer" };
const errBox = { marginTop: 12, padding: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#b91c1c", fontSize: 13 };
const chip = { padding: "4px 10px", borderRadius: 999, background: "#eef2ff", color: "#4338ca", fontSize: 12, fontWeight: 600 };
const badgeGreen = { padding: "3px 9px", borderRadius: 999, background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700 };
const badgeGray = { padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700 };
