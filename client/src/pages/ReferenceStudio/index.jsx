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

const COMING_SOON = ["url", "html"];

// Honest-feeling progress: staged messages that advance while the backend works.
const STAGES = {
  image: [
    "Uploading your screenshot",
    "Extracting colors and layout bands",
    "AI is recreating the design",
    "Building editable elements",
    "Polishing typography and spacing",
  ],
  text: [
    "Reading your brief",
    "Retrieving design rules",
    "AI is designing the structure",
    "Building editable elements",
  ],
};

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

// Animated progress panel shown while the analysis runs.
function ProgressPanel({ mode }) {
  const stages = STAGES[mode] || STAGES.text;
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const t = setInterval(() => {
      setStep((s) => Math.min(s + 1, stages.length - 1));
    }, 4000);
    return () => clearInterval(t);
  }, [mode, stages.length]);

  const pct = Math.min(92, ((step + 1) / stages.length) * 100);
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ height: 6, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 999,
          background: "linear-gradient(90deg,#6366f1,#7c3aed)",
          transition: "width 1.2s ease",
        }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
        {stages.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: i <= step ? "#4338ca" : "#94a3b8" }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < step ? "#22c55e" : i === step ? "#6366f1" : "#e2e8f0",
              transition: "background 300ms",
            }} />
            <span>{label}{i === step ? "…" : ""}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", margin: "12px 0 0" }}>
        This usually takes 10 to 40 seconds.
      </p>
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
    if (COMING_SOON.includes(mode)) return; // button is disabled anyway
    if (mode === "image" && !file) { setError("Upload a screenshot first."); return; }
    if (mode === "text" && !description.trim()) { setError("Describe the design you want."); return; }

    setResult(null);
    setStatus("loading");
    try {
      const data = await analyzeReference({ mode, file: mode === "image" ? file : null, description, url });
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
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
    // Pass via navigation state too: the editor prefers location.state, which
    // wins even when a previously-loaded portfolio is still in context.
    navigate("/customize/custom", { state: { portfolioData } });
  };

  const loading = status === "loading";
  const comingSoon = COMING_SOON.includes(mode);

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
          Describe a site or upload a screenshot, and we'll rebuild its layout and colours using fully editable elements.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>
          {/* Input card */}
          <div style={card}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {MODES.map((m) => (
                <button key={m.id} onClick={() => { setMode(m.id); setError(""); }}
                  style={{ ...tab, ...(mode === m.id ? tabActive : {}) }}>
                  {m.label}
                  {COMING_SOON.includes(m.id) && <span style={soonPill}>Soon</span>}
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
                disabled={loading}
                style={textareaStyle}
              />
            )}

            {mode === "image" && (
              <div>
                <div
                  onClick={() => !loading && fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (!loading) onPickFile(e.dataTransfer.files?.[0]); }}
                  style={{ ...dropzone, opacity: loading ? 0.6 : 1 }}
                >
                  {filePreview
                    ? <img src={filePreview} alt="reference" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }} />
                    : <span style={{ color: "#94a3b8", fontSize: 14 }}>Click or drop a PNG / JPG screenshot here (max 12MB)</span>}
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden
                    onChange={(e) => onPickFile(e.target.files?.[0])} />
                </div>
                <input value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading}
                  placeholder="Optional: add context (e.g. 'SaaS for dentists')" style={{ ...input, marginTop: 12 }} />
              </div>
            )}

            {mode === "url" && (
              <div>
                <input value={url} onChange={(e) => setUrl(e.target.value)} disabled
                  placeholder="https://example.com" style={{ ...input, background: "#f8fafc", color: "#94a3b8" }} />
                <div style={soonBox}>
                  Live-URL capture is coming soon. Until then, take a screenshot of the site and use the Screenshot tab — you'll get the same recreation quality.
                </div>
              </div>
            )}

            {mode === "html" && (
              <div style={soonBox}>
                HTML / .zip import is coming soon. For now, use a screenshot or describe the design in words.
              </div>
            )}

            {error && (
              <div style={errBox}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>That didn't work</div>
                <div>{error}</div>
                {status === "error" && (
                  <button onClick={handleAnalyze} style={retryBtn}>Try again</button>
                )}
              </div>
            )}

            {loading
              ? <ProgressPanel mode={mode} />
              : (
                <button
                  onClick={handleAnalyze}
                  disabled={loading || comingSoon}
                  style={{ ...primaryBtn, opacity: comingSoon ? 0.5 : 1, cursor: comingSoon ? "not-allowed" : "pointer", marginTop: 16 }}
                >
                  {comingSoon ? "Coming Soon" : "Generate Layout"}
                </button>
              )}
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

              {result.warning && (
                <div style={warnBox}>
                  Colour extraction was skipped ({result.warning}) — the AI matched colours by eye instead.
                </div>
              )}

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
              <button onClick={handleAnalyze} style={{ ...ghostBtn, width: "100%", marginTop: 10, padding: "11px 20px", textAlign: "center" }}>
                Regenerate
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
const tab = { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const tabActive = { background: "#6366f1", color: "#fff", borderColor: "#6366f1" };
const soonPill = { fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: "#fef3c7", color: "#92400e", letterSpacing: 0.4 };
const textareaStyle = { width: "100%", padding: 14, borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", outline: "none" };
const input = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", outline: "none" };
const dropzone = { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, border: "2px dashed #cbd5e1", borderRadius: 12, cursor: "pointer", background: "#f8fafc", padding: 12 };
const primaryBtn = { width: "100%", padding: "13px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.3)" };
const ghostBtn = { padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13, cursor: "pointer" };
const errBox = { marginTop: 12, padding: 14, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#b91c1c", fontSize: 13, lineHeight: 1.5 };
const retryBtn = { marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fff", color: "#b91c1c", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const warnBox = { marginBottom: 12, padding: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, color: "#92400e", fontSize: 12, lineHeight: 1.5 };
const soonBox = { marginTop: 10, padding: 16, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, color: "#9a3412", fontSize: 14, lineHeight: 1.5 };
const chip = { padding: "4px 10px", borderRadius: 999, background: "#eef2ff", color: "#4338ca", fontSize: 12, fontWeight: 600 };
const badgeGreen = { padding: "3px 9px", borderRadius: 999, background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700 };
const badgeGray = { padding: "3px 9px", borderRadius: 999, background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700 };
