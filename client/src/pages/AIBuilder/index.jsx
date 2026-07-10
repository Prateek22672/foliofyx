// client/src/pages/AIBuilder/index.jsx
// "AI Chat Builder" — chat on the left, live site preview on the right.
// Describe a website in plain language → the AI builds it → refine it turn by
// turn → open in the Studio editor, publish, and connect a custom domain.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../api/aiChatAPI";
import {
  createCustomWebsite,
  saveCustomWebsite,
  publishCustomWebsite,
} from "../../api/customWebsiteAPI";
import ChatPanel from "./ChatPanel";
import PreviewPane from "./PreviewPane";
import DomainModal from "./DomainModal";

const SESSION_KEY = "fyx_ai_chat_session";

// Keyframes for the typing dots + message entrance (inline styles can't declare these).
const KEYFRAMES = `
@keyframes fyxDotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: .35; } 40% { transform: translateY(-4px); opacity: 1; } }
@keyframes fyxFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fyxGlowPulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
`;

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && typeof s === "object" && Array.isArray(s.messages) ? s : null;
  } catch {
    return null;
  }
}

function useIsMobile(breakpoint = 900) {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return mobile;
}

let msgSeq = 0;
const newId = () => `m_${Date.now()}_${msgSeq++}`;

export default function AIBuilder() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const saved = useMemo(loadSession, []);

  const [messages, setMessages] = useState(saved?.messages || []);
  const [site, setSite] = useState(saved?.site || null);
  const [siteId, setSiteId] = useState(saved?.siteId || null);
  const [publishedUrl, setPublishedUrl] = useState(saved?.publishedUrl || null);
  const [sending, setSending] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [domainOpen, setDomainOpen] = useState(false);

  // Persist the whole session so a refresh never loses work.
  useEffect(() => {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ messages, site, siteId, publishedUrl })
      );
    } catch {
      /* storage full / unavailable — the session just won't survive a refresh */
    }
  }, [messages, site, siteId, publishedUrl]);

  const pushAssistant = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: newId(), role: "assistant", ...msg }]);
  }, []);

  // ── Send a chat turn ────────────────────────────────────────────────────────
  const handleSend = useCallback(
    async (text) => {
      const trimmed = String(text || "").trim();
      if (!trimmed || sending) return;

      const userMsg = { id: newId(), role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setSending(true);

      try {
        // Only real conversation turns go to the model — not system/link/error bubbles.
        const apiMessages = nextMessages
          .filter((m) => !m.kind)
          .map(({ role, content }) => ({ role, content }));

        const res = await sendChatMessage({
          messages: apiMessages,
          site: site
            ? { pages: site.pages, activePage: site.activePage, industry: site.industry }
            : null,
        });

        if (res.intent === "create" && Array.isArray(res.elements)) {
          const pageId = `page_${Date.now()}`;
          setSite({
            pages: [
              {
                id: pageId,
                name: "Home",
                slug: "/",
                elements: res.elements,
                bgColor: "#ffffff",
                bgType: "solid",
              },
            ],
            activePage: pageId,
            industry: res.industry || "general",
          });
        } else if (res.intent === "edit" && Array.isArray(res.elements)) {
          setSite((prev) =>
            prev
              ? {
                  ...prev,
                  pages: prev.pages.map((p) =>
                    p.id === prev.activePage ? { ...p, elements: res.elements } : p
                  ),
                }
              : prev
          );
        }

        pushAssistant({ content: res.reply || "Done — take a look at the preview." });
      } catch (e) {
        pushAssistant({
          kind: "error",
          content:
            e.status === 401
              ? "Session expired — please log in again to keep building."
              : e.message || "Something went wrong on my end. Please try that again.",
        });
      } finally {
        setSending(false);
      }
    },
    [messages, site, sending, pushAssistant]
  );

  // ── New chat ────────────────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setMessages([]);
    setSite(null);
    setSiteId(null);
    setPublishedUrl(null);
    setDomainOpen(false);
  }, []);

  // ── Open in Studio (full editor) ────────────────────────────────────────────
  const handleOpenStudio = useCallback(() => {
    if (!site?.pages?.length) return;
    const portfolioData = {
      // `name` is required by the Portfolio model — without it the DB save fails.
      name: "AI Site",
      template: "custom",
      themeBg: "#ffffff",
      customLayout: {
        pages: site.pages,
        activePage: site.activePage,
        canvasWidth: 1200,
      },
    };
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    navigate("/customize/custom");
  }, [site, navigate]);

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!site?.pages?.length || publishing) return;
    setPublishing(true);
    try {
      let id = siteId;
      if (!id) {
        const created = await createCustomWebsite({
          title: "AI Site",
          industry: site.industry || "general",
          pages: site.pages,
          activePage: site.activePage,
        });
        id = created?.site?._id;
        if (!id) throw new Error("Could not create the website record.");
        setSiteId(id);
      }
      await saveCustomWebsite(id, {
        pages: site.pages,
        activePage: site.activePage,
        industry: site.industry,
      });
      const pub = await publishCustomWebsite(id);
      setPublishedUrl(pub.publishedUrl || null);
      pushAssistant({
        kind: "link",
        url: pub.publishedUrl,
        content: "Your site is live! Here's your public link:",
      });
    } catch (e) {
      pushAssistant({
        kind: "error",
        content:
          e.status === 401
            ? "Session expired — please log in again, then hit Publish once more."
            : e.message || "Publishing failed. Please try again in a moment.",
      });
    } finally {
      setPublishing(false);
    }
  }, [site, siteId, publishing, pushAssistant]);

  // ── Layout ──────────────────────────────────────────────────────────────────
  const shell = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    background:
      "radial-gradient(1200px 600px at 80% -10%, rgba(99,102,241,0.14), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(124,58,237,0.10), transparent 60%), #0a0a12",
    color: "#e2e8f0",
    fontFamily: "Outfit, system-ui, sans-serif",
  };

  return (
    <div style={shell}>
      <style>{KEYFRAMES}</style>

      {/* Mobile: preview stacks on top (40vh), chat fills the rest */}
      {isMobile && (
        <div style={{ height: "40vh", minHeight: 220, flexShrink: 0, display: "flex" }}>
          <PreviewPane
            site={site}
            publishedUrl={publishedUrl}
            publishing={publishing}
            onOpenStudio={handleOpenStudio}
            onPublish={handlePublish}
            onConnectDomain={() => setDomainOpen(true)}
            compact
          />
        </div>
      )}

      <ChatPanel
        messages={messages}
        sending={sending}
        onSend={handleSend}
        onNewChat={handleNewChat}
        isMobile={isMobile}
      />

      {!isMobile && (
        <PreviewPane
          site={site}
          publishedUrl={publishedUrl}
          publishing={publishing}
          onOpenStudio={handleOpenStudio}
          onPublish={handlePublish}
          onConnectDomain={() => setDomainOpen(true)}
        />
      )}

      {domainOpen && siteId && (
        <DomainModal siteId={siteId} onClose={() => setDomainOpen(false)} />
      )}
    </div>
  );
}
