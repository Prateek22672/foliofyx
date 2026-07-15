// src/pages/Customize/customize-editor/EditHeader.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../../context/PortfolioContext";
import { saveOrUpdatePortfolio } from "../../../api/portfolioAPI";
import {
  createCustomWebsite,
  saveCustomWebsite,
  publishCustomWebsite,
} from "../../../api/customWebsiteAPI";
import { useAuth } from "../../../context/AuthContext";
import UserProfileMenu from "../../../components/UserProfileMenu";
import {
  Monitor, Smartphone, Save, Rocket, Loader2, Check, AlertCircle,
  HelpCircle, Eye, EyeOff, Menu, X, LayoutTemplate,
  Globe, Lock, Crown, QrCode, Copy, ExternalLink,
} from "lucide-react";
import { useSplash } from "../../../context/SplashContext";

import ThemePopup from "./ThemePopup";
import ElementPopup from "./ElementPopup";
import ChatbotPromoPopup from "./ChatbotPromoPopup";
import UpgradePopup from "../../../components/UpgradePopup";
import FyxCardPopup from "./FyxCardPopup";
import DomainPopup from "./DomainPopup";
import DomainModal from "../../AIBuilder/DomainModal";
import OnboardingTutorial from "./customize-editor/OnboardingTutorial";

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];
const CUSTOM_SITE_ID_KEY = "fyx_custom_site_id";

const PlanBadge = ({ plan }) => {
  const isPro = plan === "max";
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase select-none border ${
      isPro
        ? "border-amber-400/40 text-amber-300 bg-amber-400/10"
        : "border-white/10 text-neutral-500 bg-white/5"
    }`}>
      {isPro && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
      {isPro ? "Pro" : "Free"}
    </div>
  );
};

const ViewBtn = ({ icon: Icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={`${label} preview`}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all ${
      active
        ? "bg-white/10 text-white shadow-sm"
        : "text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
    }`}
  >
    <Icon size={13} strokeWidth={active ? 2.5 : 1.8} />
    {label}
  </button>
);

/* Copyable URL row for the publish-success panel */
const CopyRow = ({ label, url }) => {
  const [copied, setCopied] = useState(false);
  if (!url) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <code className="flex-1 min-w-0 truncate text-[12px] text-neutral-200 bg-[#1a1a1a] border border-white/10 rounded-md px-2.5 py-1.5 font-mono">
          {url}
        </code>
        <button
          type="button"
          onClick={copy}
          title="Copy link"
          className={`p-1.5 rounded-md border border-white/10 transition-colors ${
            copied ? "text-emerald-400 bg-emerald-400/10" : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title="Open in new tab"
          className="p-1.5 rounded-md border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

// Self-contained — no onSave/onPreview props needed.
// Uses the same saveState machine and saveOrUpdatePortfolio call as Sidebar internally.
function EditHeader({ setViewMode, viewMode }) {
  const navigate = useNavigate();
  const { showSplash } = useSplash();
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();

  const [showThemePopup,   setShowThemePopup]   = useState(false);
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [showCardPopup,    setShowCardPopup]    = useState(false);
  const [showDomainPopup,  setShowDomainPopup]  = useState(false);
  const [showAiPromo,      setShowAiPromo]      = useState(false);
  const [showUpgrade,      setShowUpgrade]      = useState(false);
  const [upgradeReason,    setUpgradeReason]    = useState("premium_template");
  const [showOnboarding,   setShowOnboarding]   = useState(false);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);

  // ── Identical saveState machine to Sidebar ─────────────────────────────────
  const [saveState, setSaveState] = useState("idle"); // idle | saving | done | error

  // ── Custom-site publish + domain state (template === "custom") ────────────
  const [customPublishState, setCustomPublishState] = useState("idle"); // idle | publishing | done | error
  const [publishResult, setPublishResult] = useState(null); // { publishedUrl, subdomainUrl, slug }
  const [publishError,  setPublishError]  = useState("");
  const [publishNotice, setPublishNotice] = useState("");
  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [showCustomDomain, setShowCustomDomain] = useState(false);

  const isFreeUser   = (user?.plan || "free") === "free";
  const isPremium    = PREMIUM_TEMPLATES.includes(portfolioData?.template);
  const isCustomSite = portfolioData?.template === "custom";

  // ── Build clean payload ───────────────────────────────────────────────────
  // MongoDB embedded-doc schemas require objects, not plain strings.
  // If skills/projects entries are strings (e.g. "React") we wrap them so
  // the PUT never gets a "Cast to embedded failed" 500 error.
  const normalizeEmbedded = (arr, defaultKey = "name") => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item =>
      item && typeof item === "object" ? item : { [defaultKey]: String(item) }
    );
  };

  const buildCleanData = () => ({
    ...portfolioData,
    template:      portfolioData.template || "modern",
    skills:        normalizeEmbedded(portfolioData.skills,   "name"),
    projects:      normalizeEmbedded(portfolioData.projects, "title"),
    enableChatbot: portfolioData.enableChatbot || false,
  });

  // ── Restriction guard ─────────────────────────────────────────────────────
  const checkRestrictions = () => {
    if (isFreeUser && isPremium) {
      setUpgradeReason("premium_template"); setShowUpgrade(true); return false;
    }
    const isCustomColor =
      portfolioData.themeBg &&
      portfolioData.themeBg !== "#000000" &&
      portfolioData.themeBg !== "#ffffff";
    if (isFreeUser && isCustomColor) {
      setUpgradeReason("premium_feature"); setShowUpgrade(true); return false;
    }
    if (isFreeUser && portfolioData.enableChatbot) {
      setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return false;
    }
    return true;
  };

  // ── Save — same pattern as Sidebar.handleSaveClick ───────────────────────
  const handleSave = async () => {
    if (isFreeUser && isPremium) {
      setUpgradeReason("premium_template"); setShowUpgrade(true); return;
    }
    setSaveState("saving");
    try {
      const saved = await saveOrUpdatePortfolio(buildCleanData());
      setPortfolioData(saved);
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  // ── Publish (legacy templates) — save first, then open DomainPopup ────────
  const handleDeployClick = async () => {
    if (!checkRestrictions()) return;
    setSaveState("saving");
    try {
      const clean = buildCleanData();
      const saved = await saveOrUpdatePortfolio(clean);
      setPortfolioData(saved);          // context now has normalized objects
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
      return;                           // don't open popup if save failed
    }
    setShowDomainPopup(true);
    setMobileMenuOpen(false);
  };

  // ── Custom-site publish flow ───────────────────────────────────────────────
  // Mirrors AIBuilder: create (once) -> save layout -> publish. The created
  // site's _id is persisted in portfolioData._customSiteId + localStorage so a
  // republish UPDATES the same site instead of creating duplicates.
  const getCustomSiteId = () =>
    portfolioData?._customSiteId || localStorage.getItem(CUSTOM_SITE_ID_KEY) || null;

  const handleCustomPublish = useCallback(async () => {
    if (customPublishState === "publishing") return null;
    const layout = portfolioData?.customLayout;
    setShowPublishPanel(true);
    setPublishError("");
    if (!layout?.pages?.length) {
      setPublishError("Add at least one page (Pages tab) before publishing.");
      setCustomPublishState("error");
      return null;
    }
    setCustomPublishState("publishing");
    try {
      let id = portfolioData?._customSiteId || localStorage.getItem(CUSTOM_SITE_ID_KEY) || null;

      // Update the existing site; if it was deleted server-side, fall back to create.
      if (id) {
        try {
          await saveCustomWebsite(id, {
            pages: layout.pages,
            activePage: layout.activePage,
          });
        } catch {
          localStorage.removeItem(CUSTOM_SITE_ID_KEY);
          id = null;
        }
      }

      if (!id) {
        const created = await createCustomWebsite({
          title: portfolioData.name || "My FolioFYX Site",
          industry: portfolioData.industry || "general",
          pages: layout.pages,
          activePage: layout.activePage,
        });
        id = created?.site?._id;
        if (!id) throw new Error("Could not create the website record.");
      }

      const pub = await publishCustomWebsite(id);

      localStorage.setItem(CUSTOM_SITE_ID_KEY, id);
      setPortfolioData(prev => ({ ...prev, _customSiteId: id }));
      setPublishResult({
        publishedUrl: pub.publishedUrl || null,
        subdomainUrl: pub.subdomainUrl || null,
        slug:         pub.slug         || null,
      });
      setCustomPublishState("done");
      setMobileMenuOpen(false);
      return id;
    } catch (e) {
      setPublishError(
        e.message === "HTTP 401"
          ? "Session expired — please log in again, then publish once more."
          : e.message || "Publishing failed. Please try again."
      );
      setCustomPublishState("error");
      return null;
    }
  }, [customPublishState, portfolioData, setPortfolioData]);

  // ── Custom-site domain flow ────────────────────────────────────────────────
  // A live site is required first — if it was never published we publish it
  // (with a visible notice), then open the domain modal.
  const handleCustomDomain = useCallback(async () => {
    let id = getCustomSiteId();
    if (!id) {
      setPublishNotice("Your site needs to be live before connecting a domain — publishing it now.");
      id = await handleCustomPublish();
      if (!id) return; // publish failed; the error is already visible
    }
    setPublishNotice("");
    setShowCustomDomain(true);
    setMobileMenuOpen(false);
  }, [handleCustomPublish]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chatbot toggle ────────────────────────────────────────────────────────
  const toggleChatbot = async () => {
    if (portfolioData.enableChatbot) {
      const updated = { ...buildCleanData(), enableChatbot: false };
      setPortfolioData(updated);
      try { await saveOrUpdatePortfolio(updated); } catch (_) {}
      return;
    }
    setShowAiPromo(true);
    setMobileMenuOpen(false);
  };

  const handleConfirmEnableAi = async () => {
    setShowAiPromo(false);
    if (isFreeUser) { setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return; }
    const updated = { ...buildCleanData(), enableChatbot: true };
    setPortfolioData(updated);
    try { await saveOrUpdatePortfolio(updated); showSplash(1000); } catch (_) {}
  };

  // ── Visibility toggle ─────────────────────────────────────────────────────
  const toggleVisibility = async () => {
    const next = !portfolioData.isPublic;
    setPortfolioData(prev => ({ ...prev, isPublic: next }));
    try { await saveOrUpdatePortfolio({ ...portfolioData, isPublic: next }); } catch (_) {}
    setMobileMenuOpen(false);
  };

  // ── Save button appearance — identical to Sidebar ─────────────────────────
  const SaveIcon =
    saveState === "saving" ? Loader2 :
    saveState === "done"   ? Check   :
    saveState === "error"  ? AlertCircle : Save;

  const saveLabel =
    saveState === "saving" ? "Saving…" :
    saveState === "done"   ? "Saved!"  :
    saveState === "error"  ? "Failed"  : "Save";

  const saveCls =
    saveState === "done"  ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" :
    saveState === "error" ? "bg-red-400/10 text-red-300 border-red-400/30"             :
    "text-neutral-300 bg-[#1a1a1a] border-white/10 hover:border-white/20 hover:bg-white/10";

  // ── Custom publish button appearance ──────────────────────────────────────
  const customPublishLabel =
    customPublishState === "publishing" ? "Publishing…" :
    customPublishState === "done"       ? "Published"   : "Publish";

  const CustomPublishIcon =
    customPublishState === "publishing" ? Loader2 :
    customPublishState === "done"       ? Check   : Rocket;

  return (
    <>
      {/* Popups */}
      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason={upgradeReason} />
      {showCardPopup && (
        <FyxCardPopup onClose={() => setShowCardPopup(false)} portfolioData={portfolioData} />
      )}
      {showDomainPopup && (
        <DomainPopup
          isOpen={showDomainPopup}
          onClose={() => setShowDomainPopup(false)}
          portfolioData={portfolioData}
          onSaveSuccess={(saved) => {
            setPortfolioData(saved);
            setShowDomainPopup(false);
            const targetId = saved.username || saved._id;
            showSplash(1200, () => navigate(`/portfolio/${targetId}`));
          }}
        />
      )}
      {showCustomDomain && getCustomSiteId() && (
        <DomainModal siteId={getCustomSiteId()} onClose={() => setShowCustomDomain(false)} />
      )}
      {showThemePopup && (
        <ThemePopup
          onSelect={(k) => {
            setPortfolioData({ ...portfolioData, template: k });
            navigate(`/customize/${k}`);
            setShowThemePopup(false);
          }}
          onClose={() => setShowThemePopup(false)}
        />
      )}
      {showElementPopup && <ElementPopup onClose={() => setShowElementPopup(false)} />}
      {showAiPromo && (
        <ChatbotPromoPopup onClose={() => setShowAiPromo(false)} onEnable={handleConfirmEnableAi} />
      )}
      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}

      {/* ── Publish result panel (non-blocking) ── */}
      {isCustomSite && showPublishPanel && (customPublishState !== "idle" || publishNotice) && (
        <div className="fixed top-16 right-4 z-[700] w-[min(400px,calc(100vw-32px))] rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/60 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] font-bold text-neutral-200">
              {customPublishState === "publishing" && <Loader2 size={13} className="animate-spin text-violet-400" />}
              {customPublishState === "done"       && <Check size={13} className="text-emerald-400" />}
              {customPublishState === "error"      && <AlertCircle size={13} className="text-red-400" />}
              {customPublishState === "publishing" ? "Publishing your site"
                : customPublishState === "done"    ? "Your site is live"
                : customPublishState === "error"   ? "Publish failed"
                : "Publish"}
            </span>
            <button
              type="button"
              onClick={() => { setShowPublishPanel(false); setPublishNotice(""); }}
              title="Dismiss"
              className="p-1 rounded-md text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          {publishNotice && (
            <p className="text-[11px] leading-relaxed text-amber-300/90 bg-amber-400/10 border border-amber-400/20 rounded-md px-2.5 py-2">
              {publishNotice}
            </p>
          )}

          {customPublishState === "error" && publishError && (
            <p className="text-[11px] leading-relaxed text-red-300 bg-red-400/10 border border-red-400/20 rounded-md px-2.5 py-2">
              {publishError}
            </p>
          )}

          {customPublishState === "done" && publishResult && (
            <>
              <CopyRow label="Published URL" url={publishResult.publishedUrl} />
              <CopyRow label="Subdomain"     url={publishResult.subdomainUrl} />
              <button
                type="button"
                onClick={handleCustomDomain}
                className="mt-1 flex items-center justify-center gap-2 w-full py-2 rounded-md text-[12px] font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                <Globe size={13} /> Connect a custom domain
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Top Bar ── */}
      <header className="w-full h-14 bg-[#0f0f0f] border-b border-white/10 flex items-center justify-between px-4 gap-3 relative z-50">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img src="/studiox.svg" alt="Foliofy" className="h-32 w-auto invert select-none pointer-events-none" />
        </div>

        {/* Desktop: view toggle */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
          <ViewBtn icon={Monitor}    label="Desktop" active={viewMode === "desktop" || viewMode === "dual"} onClick={() => setViewMode("dual")}   />
          <ViewBtn icon={Smartphone} label="Mobile"  active={viewMode === "mobile"}                         onClick={() => setViewMode("mobile")} />
        </div>

        {/* Desktop: right actions */}
        <div className="hidden md:flex items-center gap-2">

          {/* Legacy-template toggles (not relevant to the custom builder) */}
          {!isCustomSite && (
            <>
              {/* AI chatbot toggle */}
              <button
                type="button"
                onClick={toggleChatbot}
                title={portfolioData.enableChatbot ? "Disable AI chatbot" : "Enable AI chatbot"}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-bold transition-all border ${
                  portfolioData.enableChatbot
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-[#1a1a1a] text-neutral-400 border-white/10 hover:border-white/20 hover:text-neutral-200"
                }`}
              >
                {isFreeUser && !portfolioData.enableChatbot && <Crown size={11} className="text-amber-400" />}
                <img src="/iconlogo/ai.png" alt="AI" className={`w-4 ${portfolioData.enableChatbot ? "filter brightness-0 invert" : "opacity-50 invert"}`} />
                {portfolioData.enableChatbot ? "AI On" : "AI Off"}
              </button>

              {/* Visibility toggle */}
              <button
                type="button"
                onClick={toggleVisibility}
                title={portfolioData.isPublic ? "Make portfolio private" : "Make portfolio public"}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-bold transition-all border ${
                  portfolioData.isPublic
                    ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30"
                    : "bg-[#1a1a1a] text-neutral-400 border-white/10 hover:border-white/20 hover:text-neutral-200"
                }`}
              >
                {portfolioData.isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                {portfolioData.isPublic ? "Public" : "Private"}
              </button>
            </>
          )}

          <div className="w-px h-6 bg-white/10" />

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === "saving"}
            title="Save your changes"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-[12px] font-bold transition-all border disabled:opacity-60 ${saveCls}`}
          >
            <SaveIcon size={14} className={saveState === "saving" ? "animate-spin" : ""} />
            {saveLabel}
          </button>

          {isCustomSite ? (
            <>
              {/* Domain — visible + labeled so users discover custom domains */}
              <button
                type="button"
                onClick={handleCustomDomain}
                title="Connect your own domain"
                className="flex items-center gap-2 px-3.5 py-2 rounded-md text-[12px] font-bold border border-white/10 bg-[#1a1a1a] text-neutral-200 hover:border-white/25 hover:bg-white/10 transition-all"
              >
                <Globe size={14} /> Domain
              </button>

              {/* Publish */}
              <button
                type="button"
                onClick={handleCustomPublish}
                disabled={customPublishState === "publishing"}
                title="Publish your site live"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-sm disabled:opacity-60"
              >
                <CustomPublishIcon size={14} className={customPublishState === "publishing" ? "animate-spin" : ""} />
                {customPublishLabel}
              </button>
            </>
          ) : (
            /* Publish (legacy templates) */
            <button
              type="button"
              onClick={handleDeployClick}
              title="Publish your portfolio live"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[12px] font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-sm"
            >
              <Rocket size={14} /> Publish
            </button>
          )}

          <div className="w-px h-6 bg-white/10" />

          {/* Help / onboarding */}
          <button
            type="button"
            onClick={() => { localStorage.removeItem("fyx_onboarding_seen"); setShowOnboarding(true); }}
            className="p-2 rounded-md text-neutral-500 hover:text-white hover:bg-white/10 transition-all"
            title="Take a tour"
          >
            <HelpCircle size={15} />
          </button>

          <PlanBadge plan={user?.plan} />
          {saveState === "done" && (
            <span className="hidden lg:block text-[9px] text-neutral-500 whitespace-nowrap">
              Just saved
            </span>
          )}
        </div>

        {/* Mobile: save + menu */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === "saving"}
            title="Save your changes"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-bold border transition-all ${saveCls}`}
          >
            <SaveIcon size={14} className={saveState === "saving" ? "animate-spin" : ""} />
            {saveLabel}
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={isCustomSite ? handleCustomPublish : handleDeployClick}
            disabled={isCustomSite && customPublishState === "publishing"}
            title="Publish your site live"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-bold bg-white text-black shadow-sm disabled:opacity-60"
          >
            {isCustomSite
              ? <CustomPublishIcon size={13} className={customPublishState === "publishing" ? "animate-spin" : ""} />
              : <Rocket size={13} />}
            {isCustomSite ? customPublishLabel : "Publish"}
          </button>

          {/* Menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(o => !o)}
            title="Menu"
            className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 transition-all"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <div className="hidden md:block"><UserProfileMenu /></div>
      </header>

      {/* ── Mobile dropdown menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-[500] bg-[#0f0f0f] border-b border-white/10 shadow-xl shadow-black/50">
          <div className="p-4 flex flex-col gap-4">

            {/* View mode */}
            <div>
              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">Preview Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setViewMode("dual"); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold transition-all ${
                    viewMode === "dual" || viewMode === "desktop" ? "bg-white text-black" : "bg-white/5 text-neutral-400 border border-white/10"
                  }`}
                >
                  <Monitor size={14} /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => { setViewMode("mobile"); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold transition-all ${
                    viewMode === "mobile" ? "bg-white text-black" : "bg-white/5 text-neutral-400 border border-white/10"
                  }`}
                >
                  <Smartphone size={14} /> Mobile
                </button>
              </div>
            </div>

            {/* Publish + Domain (custom sites) */}
            {isCustomSite && (
              <div>
                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">Go Live</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCustomPublish}
                    disabled={customPublishState === "publishing"}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold bg-white text-black transition-all disabled:opacity-60"
                  >
                    <CustomPublishIcon size={14} className={customPublishState === "publishing" ? "animate-spin" : ""} />
                    {customPublishLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleCustomDomain}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold bg-white/5 text-neutral-200 border border-white/10 transition-all"
                  >
                    <Globe size={14} /> Domain
                  </button>
                </div>
              </div>
            )}

            {/* Design */}
            <div>
              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">Design</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setShowThemePopup(true); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold bg-white/5 text-neutral-200 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <LayoutTemplate size={14} /> Templates
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCardPopup(true); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold bg-white text-black transition-all"
                >
                  <QrCode size={14} /> FYX Card
                </button>
              </div>
            </div>

            {/* Settings (legacy templates) */}
            {!isCustomSite && (
              <div>
                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">Settings</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold transition-all ${
                      portfolioData.isPublic ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30" : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {portfolioData.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                    {portfolioData.isPublic ? "Public" : "Private"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleChatbot}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-[12px] font-bold transition-all ${
                      portfolioData.enableChatbot ? "bg-blue-600 text-white" : "bg-white/5 text-neutral-400 border border-white/10"
                    }`}
                  >
                    {isFreeUser && !portfolioData.enableChatbot && <Crown size={11} className="text-amber-400" />}
                    <img src="/iconlogo/ai.png" alt="AI" className={`w-3 ${portfolioData.enableChatbot ? "filter brightness-0 invert" : "opacity-50 invert"}`} />
                    {portfolioData.enableChatbot ? "AI On" : "AI Off"}
                  </button>
                </div>
              </div>
            )}

            {/* Help + Profile */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("fyx_onboarding_seen");
                  setShowOnboarding(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-[12px] font-semibold text-neutral-400 hover:text-white px-2 py-1.5 rounded-md hover:bg-white/10 transition-all"
              >
                <HelpCircle size={14} /> How to use
              </button>
              <div className="flex items-center gap-2">
                <PlanBadge plan={user?.plan} />
                <UserProfileMenu />
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default EditHeader;
