// client/src/pages/AIBuilder/PreviewPane.jsx
// Right column of the AI Chat Builder: live, scaled, read-only render of the
// generated site (same ElementRenderer the Studio uses) + action toolbar.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ElementRenderer } from "../Customize/customize-editor/custom/CanvasElementRenderer";
import { Monitor, PenLine, Rocket, Globe, ExternalLink, Loader2 } from "lucide-react";

const CANVAS_W = 1200;
const border = "rgba(148, 163, 184, 0.14)";
const dim = "#94a3b8";

function toolbarBtn(kind, disabled) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 13px",
    borderRadius: 9,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
    whiteSpace: "nowrap",
    transition: "opacity .15s ease",
  };
  if (kind === "primary")
    return {
      ...base,
      border: "none",
      background: "linear-gradient(135deg, #6366f1, #7c3aed)",
      color: "#fff",
    };
  return {
    ...base,
    border: `1px solid ${border}`,
    background: "rgba(30, 32, 50, 0.6)",
    color: "#cbd5e1",
  };
}

// Scaled read-only canvas (same approach as ReferenceStudio's Preview).
function ScaledCanvas({ page }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calc = () =>
      wrapRef.current && setScale(Math.min(1, wrapRef.current.offsetWidth / CANVAS_W));
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const elements = page?.elements || [];
  const maxY = elements.reduce(
    (m, e) => Math.max(m, (e.y || 0) + (e.height === "auto" ? 80 : e.height || 0)),
    720
  );

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      <div
        style={{
          width: CANVAS_W,
          height: maxY,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          background: page?.bgColor || "#ffffff",
        }}
      >
        {elements.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height === "auto" ? undefined : el.height,
              zIndex: el.zIndex || 1,
            }}
          >
            <ElementRenderer element={el} readOnly />
          </div>
        ))}
      </div>
      {/* Reserve the scaled height so the scroll area sizes correctly. */}
      <div style={{ height: Math.max(0, maxY * scale - maxY), marginTop: maxY * (scale - 1) }} />
    </div>
  );
}

export default function PreviewPane({
  site,
  publishedUrl,
  publishing,
  onOpenStudio,
  onPublish,
  onConnectDomain,
  compact = false,
}) {
  const activePage = useMemo(() => {
    if (!site?.pages?.length) return null;
    return site.pages.find((p) => p.id === site.activePage) || site.pages[0];
  }, [site]);

  const hasSite = Boolean(activePage);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: compact ? "8px 12px" : "12px 18px",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <Monitor size={15} color={dim} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: dim, whiteSpace: "nowrap" }}>Live preview</span>
          {hasSite && site.industry && (
            <span
              style={{
                fontSize: 11,
                padding: "3px 9px",
                borderRadius: 999,
                background: "rgba(99, 102, 241, 0.16)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                color: "#c7d2fe",
                whiteSpace: "nowrap",
              }}
            >
              {site.industry}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={onOpenStudio}
            disabled={!hasSite}
            style={toolbarBtn("ghost", !hasSite)}
            title="Open this site in the full Studio editor"
          >
            <PenLine size={13} />
            {compact ? "Studio" : "Edit in Studio"}
          </button>
          <button
            onClick={onPublish}
            disabled={!hasSite || publishing}
            style={toolbarBtn("primary", !hasSite || publishing)}
            title="Publish this site to a public link"
          >
            {publishing ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Rocket size={13} />}
            {publishing ? "Publishing…" : publishedUrl ? "Republish" : "Publish"}
          </button>
          <button
            onClick={onConnectDomain}
            disabled={!publishedUrl}
            style={toolbarBtn("ghost", !publishedUrl)}
            title={publishedUrl ? "Connect your own domain" : "Publish first, then connect a domain"}
          >
            <Globe size={13} />
            {compact ? "Domain" : "Connect domain"}
          </button>
        </div>
      </div>

      {/* Published banner */}
      {publishedUrl && !compact && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            fontSize: 12.5,
            color: "#a7f3d0",
            background: "rgba(16, 185, 129, 0.08)",
            borderBottom: `1px solid ${border}`,
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>Live at</span>
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#6ee7b7",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{publishedUrl}</span>
            <ExternalLink size={12} style={{ flexShrink: 0 }} />
          </a>
        </div>
      )}

      {/* Canvas area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: compact ? 10 : 22,
        }}
      >
        {hasSite ? (
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${border}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              background: "#fff",
            }}
          >
            <ScaledCanvas page={activePage} />
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              color: dim,
            }}
          >
            <div style={{ maxWidth: 340, padding: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: "0 auto 14px",
                  borderRadius: 14,
                  display: "grid",
                  placeItems: "center",
                  border: `1px dashed ${border}`,
                  animation: "fyxGlowPulse 3s infinite ease-in-out",
                }}
              >
                <Monitor size={22} color={dim} />
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                Your site appears here
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                Describe the website you want in the chat and the preview will
                render live. Every change you ask for updates it instantly.
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
