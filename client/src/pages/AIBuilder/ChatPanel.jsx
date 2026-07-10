// client/src/pages/AIBuilder/ChatPanel.jsx
// Left column of the AI Chat Builder: conversation history + composer.
// Message shape: { id, role: "user"|"assistant", content, kind?: "error"|"link", url? }

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, SendHorizonal, RotateCcw, ExternalLink } from "lucide-react";

const SUGGESTIONS = [
  "A portfolio for a freelance photographer with a dark, cinematic feel",
  "A landing page for a coffee shop in Bangalore with an online menu",
  "A clean SaaS homepage for a project-management tool",
  "A one-page site for a wedding planning studio",
];

const palette = {
  panelBg: "rgba(15, 15, 26, 0.72)",
  border: "rgba(148, 163, 184, 0.14)",
  userBubble: "linear-gradient(135deg, #6366f1, #7c3aed)",
  botBubble: "rgba(30, 32, 50, 0.85)",
  errorBubble: "rgba(127, 29, 29, 0.35)",
  errorBorder: "rgba(248, 113, 113, 0.4)",
  dim: "#94a3b8",
};

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  const isError = msg.kind === "error";
  const isLink = msg.kind === "link";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        animation: "fyxFadeUp .28s ease both",
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          padding: "10px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          fontSize: 14,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: isError ? palette.errorBubble : isUser ? palette.userBubble : palette.botBubble,
          border: isError
            ? `1px solid ${palette.errorBorder}`
            : isUser
            ? "none"
            : `1px solid ${palette.border}`,
          color: isError ? "#fecaca" : "#e2e8f0",
        }}
      >
        {msg.content}
        {isLink && msg.url && (
          <a
            href={msg.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 8,
              background: "rgba(99, 102, 241, 0.18)",
              border: "1px solid rgba(99, 102, 241, 0.45)",
              color: "#c7d2fe",
              fontSize: 13,
              textDecoration: "none",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <ExternalLink size={13} style={{ flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{msg.url}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  const dot = (delay) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#a5b4fc",
    animation: `fyxDotBounce 1.1s ${delay}s infinite ease-in-out`,
  });
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div
        style={{
          display: "flex",
          gap: 5,
          alignItems: "center",
          padding: "12px 16px",
          borderRadius: "16px 16px 16px 4px",
          background: palette.botBubble,
          border: `1px solid ${palette.border}`,
        }}
      >
        <span style={dot(0)} />
        <span style={dot(0.15)} />
        <span style={dot(0.3)} />
      </div>
    </div>
  );
}

export default function ChatPanel({ messages, sending, onSend, onNewChat, isMobile }) {
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const submit = () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    onSend(text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const empty = messages.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: isMobile ? 1 : "0 0 420px",
        minWidth: 0,
        minHeight: 0,
        borderRight: isMobile ? "none" : `1px solid ${palette.border}`,
        background: palette.panelBg,
        backdropFilter: "blur(14px)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: `1px solid ${palette.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              animation: "fyxGlowPulse 3s infinite ease-in-out",
            }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}>AI Builder</div>
            <div style={{ fontSize: 11, color: palette.dim }}>
              Describe it. Watch it become a website.
            </div>
          </div>
        </div>
        <button
          onClick={onNewChat}
          title="Start over"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: 9,
            border: `1px solid ${palette.border}`,
            background: "transparent",
            color: palette.dim,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={13} />
          New chat
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "18px 18px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {empty ? (
          <div style={{ margin: "auto 0", textAlign: "center", padding: "0 8px" }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
              What are we building today?
            </div>
            <p style={{ fontSize: 13, color: palette.dim, marginBottom: 18, lineHeight: 1.6 }}>
              Describe the website you want in plain language. You can refine it
              turn by turn — colors, sections, copy — then open it in the Studio
              or publish it straight away.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  disabled={sending}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${palette.border}`,
                    background: "rgba(30, 32, 50, 0.5)",
                    color: "#cbd5e1",
                    fontSize: 13,
                    cursor: "pointer",
                    lineHeight: 1.45,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} msg={m} />)
        )}
        {sending && <TypingDots />}
      </div>

      {/* Composer */}
      <div style={{ padding: "12px 16px 16px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "10px 10px 10px 14px",
            borderRadius: 14,
            border: `1px solid ${palette.border}`,
            background: "rgba(20, 22, 38, 0.9)",
          }}
        >
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={empty ? "e.g. A minimal portfolio for a UX designer…" : "Refine it — \"make the hero darker\", \"add a pricing section\"…"}
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              maxHeight: 120,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={submit}
            disabled={sending || !draft.trim()}
            title="Send"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              display: "grid",
              placeItems: "center",
              cursor: sending || !draft.trim() ? "default" : "pointer",
              background:
                sending || !draft.trim()
                  ? "rgba(99, 102, 241, 0.25)"
                  : "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <SendHorizonal size={16} />
          </button>
        </div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, textAlign: "center" }}>
          Enter to send · Shift+Enter for a new line
        </div>
      </div>
    </div>
  );
}
