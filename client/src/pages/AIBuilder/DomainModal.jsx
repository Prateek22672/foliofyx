// client/src/pages/AIBuilder/DomainModal.jsx
// Connect-your-own-domain flow for a published site.
// connect → show the DNS records to create → verify (live DNS check) → live.

import React, { useEffect, useState } from "react";
import {
  connectDomain,
  verifyDomain,
  getDomainStatus,
  disconnectDomain,
} from "../../api/domainAPI";
import { Globe, X, Copy, Check, RefreshCw, Loader2, Trash2 } from "lucide-react";

const border = "rgba(148, 163, 184, 0.16)";
const dim = "#94a3b8";

const STATUS_META = {
  pending: {
    label: "Pending DNS",
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.12)",
    hint: "Add the records below at your domain registrar, then hit Verify. DNS changes can take a few minutes to a few hours to propagate.",
  },
  verified: {
    label: "Ownership verified",
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.12)",
    hint: "Ownership is confirmed. Once the pointing records (A / CNAME) propagate, your domain will go live automatically on the next verify.",
  },
  live: {
    label: "Live",
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.12)",
    hint: "Your domain is connected and serving your site.",
  },
  failed: {
    label: "Check failed",
    color: "#f87171",
    bg: "rgba(248, 113, 113, 0.12)",
    hint: "The last DNS check failed. Double-check the records and try again.",
  },
};

function CopyValue({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        maxWidth: "100%",
        padding: "4px 8px",
        borderRadius: 6,
        border: `1px solid ${border}`,
        background: "rgba(20, 22, 38, 0.8)",
        color: copied ? "#34d399" : "#cbd5e1",
        fontSize: 12,
        fontFamily: "ui-monospace, monospace",
        cursor: "pointer",
      }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </span>
      {copied ? <Check size={12} style={{ flexShrink: 0 }} /> : <Copy size={12} style={{ flexShrink: 0 }} />}
    </button>
  );
}

export default function DomainModal({ siteId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false); // connect / verify / disconnect in flight
  const [error, setError] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [state, setState] = useState({ domain: null, status: null, records: [], lastCheckedAt: null });
  const [verifyMsg, setVerifyMsg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await getDomainStatus(siteId);
        if (alive) setState(s);
      } catch (e) {
        if (alive) setError(e.message || "Could not load domain status.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [siteId]);

  const handleConnect = async () => {
    const domain = domainInput.trim().toLowerCase();
    if (!domain || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await connectDomain(siteId, domain);
      setState({
        domain: res.domain,
        status: res.status || "pending",
        records: res.records || [],
        lastCheckedAt: null,
      });
      setVerifyMsg(res.note || "");
    } catch (e) {
      setError(e.message || "Could not connect that domain.");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    setVerifyMsg("");
    try {
      const res = await verifyDomain(siteId);
      setState((prev) => ({
        ...prev,
        status: res.status || prev.status,
        records: res.records?.length ? res.records : prev.records,
        lastCheckedAt: new Date().toISOString(),
      }));
      setVerifyMsg(res.message || "");
    } catch (e) {
      setError(e.message || "Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    if (busy) return;
    if (!window.confirm(`Disconnect ${state.domain}? Your site stays live on its foliofyx link.`)) return;
    setBusy(true);
    setError("");
    try {
      await disconnectDomain(siteId);
      setState({ domain: null, status: null, records: [], lastCheckedAt: null });
      setVerifyMsg("");
      setDomainInput("");
    } catch (e) {
      setError(e.message || "Could not disconnect the domain.");
    } finally {
      setBusy(false);
    }
  };

  const meta = state.status ? STATUS_META[state.status] || STATUS_META.pending : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "rgba(4, 5, 12, 0.72)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: 16,
          border: `1px solid ${border}`,
          background: "linear-gradient(180deg, #12131f, #0c0d17)",
          color: "#e2e8f0",
          padding: 22,
          animation: "fyxFadeUp .25s ease both",
          fontFamily: "Outfit, system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                display: "grid",
                placeItems: "center",
                background: "rgba(99, 102, 241, 0.18)",
                border: "1px solid rgba(99, 102, 241, 0.4)",
              }}
            >
              <Globe size={16} color="#a5b4fc" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Custom domain</div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              border: `1px solid ${border}`,
              background: "transparent",
              color: dim,
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>
        <p style={{ fontSize: 12.5, color: dim, margin: "6px 0 18px", lineHeight: 1.6 }}>
          Serve this site on a domain you already own — like <span style={{ color: "#cbd5e1" }}>yourname.com</span>.
          You keep the domain at your registrar; we just tell you which DNS records to add.
        </p>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: dim, fontSize: 13, padding: "18px 0" }}>
            <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            Checking domain status…
          </div>
        ) : !state.domain ? (
          /* ── No domain yet: connect form ── */
          <div>
            <label style={{ fontSize: 12.5, color: "#cbd5e1", display: "block", marginBottom: 8 }}>
              Your domain
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                placeholder="yourname.com"
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: "10px 13px",
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  background: "rgba(20, 22, 38, 0.9)",
                  color: "#e2e8f0",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={handleConnect}
                disabled={busy || !domainInput.trim()}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: busy || !domainInput.trim() ? "default" : "pointer",
                  opacity: busy || !domainInput.trim() ? 0.5 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                {busy && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                Connect
              </button>
            </div>
          </div>
        ) : (
          /* ── Domain connected: status + records + verify ── */
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 11,
                border: `1px solid ${border}`,
                background: "rgba(20, 22, 38, 0.6)",
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 14.5, fontWeight: 600, fontFamily: "ui-monospace, monospace" }}>
                {state.domain}
              </div>
              {meta && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: "4px 11px",
                    borderRadius: 999,
                    color: meta.color,
                    background: meta.bg,
                    border: `1px solid ${meta.color}44`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {meta.label}
                </span>
              )}
            </div>

            {meta && (
              <p style={{ fontSize: 12.5, color: dim, lineHeight: 1.6, marginBottom: 14 }}>{meta.hint}</p>
            )}

            {state.records?.length > 0 && state.status !== "live" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#cbd5e1", marginBottom: 8 }}>
                  Add these records at your registrar
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {state.records.map((r, i) => (
                    <div
                      key={`${r.type}-${r.host}-${i}`}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1px solid ${border}`,
                        background: "rgba(15, 16, 28, 0.7)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            letterSpacing: 0.6,
                            padding: "2px 8px",
                            borderRadius: 5,
                            background: "rgba(99, 102, 241, 0.16)",
                            border: "1px solid rgba(99, 102, 241, 0.35)",
                            color: "#c7d2fe",
                          }}
                        >
                          {r.type}
                        </span>
                        {r.purpose && <span style={{ fontSize: 11.5, color: dim }}>{r.purpose}</span>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 10px", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: dim }}>Host</span>
                        <CopyValue value={r.host} />
                        <span style={{ fontSize: 11, color: dim }}>Value</span>
                        <CopyValue value={r.value} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {verifyMsg && (
              <p style={{ fontSize: 12.5, color: "#a5b4fc", lineHeight: 1.55, marginBottom: 12 }}>{verifyMsg}</p>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={handleVerify}
                disabled={busy}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.55 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                }}
              >
                {busy ? (
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <RefreshCw size={14} />
                )}
                {state.status === "live" ? "Re-check" : "Verify DNS"}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={busy}
                title="Disconnect this domain"
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(248, 113, 113, 0.35)",
                  background: "rgba(127, 29, 29, 0.15)",
                  color: "#fca5a5",
                  fontSize: 13,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.55 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Trash2 size={13} />
                Disconnect
              </button>
            </div>

            {state.lastCheckedAt && (
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>
                Last checked {new Date(state.lastCheckedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: "9px 12px",
              borderRadius: 9,
              fontSize: 12.5,
              color: "#fecaca",
              background: "rgba(127, 29, 29, 0.3)",
              border: "1px solid rgba(248, 113, 113, 0.4)",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
