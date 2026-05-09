// src/pages/Customize/customize-editor/EditHeader.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../../context/PortfolioContext";
import { saveOrUpdatePortfolio } from "../../../api/portfolioAPI";
import { useAuth } from "../../../context/AuthContext";
import UserProfileMenu from "../../../components/UserProfileMenu";
import {
  Monitor, Smartphone, Save, Rocket, Loader2, Check, AlertCircle,
  Sparkles, HelpCircle, Eye, EyeOff, Menu, X, Palette, LayoutTemplate,
  Globe, Lock, Crown, QrCode
} from "lucide-react";
import { useSplash } from "../../../context/SplashContext";

import ThemePopup from "./ThemePopup";
import ElementPopup from "./ElementPopup";
import ChatbotPromoPopup from "./ChatbotPromoPopup";
import UpgradePopup from "../../../components/UpgradePopup";
import FyxCardPopup from "./FyxCardPopup";
import DomainPopup from "./DomainPopup";
import OnboardingTutorial from "./customize-editor/OnboardingTutorial";

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

const PlanBadge = ({ plan }) => {
  const isPro = plan === "max";
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase select-none border ${
      isPro ? "border-amber-300 text-amber-600 bg-amber-50" : "border-gray-200 text-gray-400 bg-gray-50"
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
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
      active ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    }`}
  >
    <Icon size={13} strokeWidth={active ? 2.5 : 1.8} />
    {label}
  </button>
);

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

  const isFreeUser = (user?.plan || "free") === "free";
  const isPremium  = PREMIUM_TEMPLATES.includes(portfolioData?.template);

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
  // Sidebar does: setSaveState("saving") → await onSave() → setSaveState("done")
  // We do the same but own the API call directly (no parent prop needed).
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

  // ── Publish — save with normalization first, then open DomainPopup ─────────
  // DomainPopup makes its own PUT; by normalizing + saving into context first,
  // it always reads clean data (no "Cast to embedded" 500 error).
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

  const onDomainSaved = (savedData) => {
    setPortfolioData(savedData);
    setShowDomainPopup(false);
    const targetId = savedData.username || savedData._id;
    showSplash(1200, () => navigate(`/portfolio/${targetId}`));
  };

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
    saveState === "done"  ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
    saveState === "error" ? "bg-red-50 text-red-500 border-red-200"             :
    "text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50";

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

      {/* ── Top Bar ── */}
      <header className="w-full h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 gap-3 relative z-50">

        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img src="/studiox.svg" alt="Foliofy" className="h-32 w-auto" />
        </div>

        {/* Desktop: view toggle */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <ViewBtn icon={Monitor}    label="Desktop" active={viewMode === "desktop" || viewMode === "dual"} onClick={() => setViewMode("dual")}   />
          <ViewBtn icon={Smartphone} label="Mobile"  active={viewMode === "mobile"}                         onClick={() => setViewMode("mobile")} />
        </div>

        {/* Desktop: right actions */}
        <div className="hidden md:flex items-center gap-2">

          {/* AI chatbot toggle */}
          <button
            type="button"
            onClick={toggleChatbot}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${
              portfolioData.enableChatbot
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {isFreeUser && !portfolioData.enableChatbot && <Crown size={11} className="text-amber-400" />}
            <img src="/iconlogo/ai.png" alt="AI" className={`w-4 ${portfolioData.enableChatbot ? "filter brightness-0 invert" : "opacity-50"}`} />
            {portfolioData.enableChatbot ? "AI On" : "AI Off"}
          </button>

          {/* Visibility toggle */}
          <button
            type="button"
            onClick={toggleVisibility}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${
              portfolioData.isPublic
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {portfolioData.isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
            {portfolioData.isPublic ? "Public" : "Private"}
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === "saving"}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all border disabled:opacity-60 ${saveCls}`}
          >
            <SaveIcon size={14} className={saveState === "saving" ? "animate-spin" : ""} />
            {saveLabel}
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={handleDeployClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold bg-gray-900 text-white hover:bg-gray-700 transition-all shadow-sm"
          >
            <Rocket size={14} /> Publish
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Help / onboarding */}
          <button
            type="button"
            onClick={() => { localStorage.removeItem("fyx_onboarding_seen"); setShowOnboarding(true); }}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            title="Take a tour"
          >
            <HelpCircle size={15} />
          </button>

          <PlanBadge plan={user?.plan} />
          {saveState === "done" && (
            <span className="hidden lg:block text-[9px] text-gray-400 whitespace-nowrap">
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
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${saveCls}`}
          >
            <SaveIcon size={14} className={saveState === "saving" ? "animate-spin" : ""} />
            {saveLabel}
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={handleDeployClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold bg-gray-900 text-white shadow-sm"
          >
            <Rocket size={13} /> Publish
          </button>

          {/* Menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(o => !o)}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 transition-all"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <div className="hidden md:block"><UserProfileMenu /></div>
      </header>

      {/* ── Mobile dropdown menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-[500] bg-white border-b border-gray-200 shadow-xl">
          <div className="p-4 flex flex-col gap-3">

            {/* View mode */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Preview Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setViewMode("dual"); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                    viewMode === "dual" || viewMode === "desktop" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Monitor size={14} /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => { setViewMode("mobile"); setMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                    viewMode === "mobile" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Smartphone size={14} /> Mobile
                </button>
              </div>
            </div>

            {/* Design */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Design</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setShowThemePopup(true); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <LayoutTemplate size={14} /> Templates
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCardPopup(true); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold bg-gray-900 text-white transition-all"
                >
                  <QrCode size={14} /> FYX Card
                </button>
              </div>
            </div>

            {/* Settings */}
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Settings</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                    portfolioData.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {portfolioData.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  {portfolioData.isPublic ? "Public" : "Private"}
                </button>
                <button
                  type="button"
                  onClick={toggleChatbot}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                    portfolioData.enableChatbot ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isFreeUser && !portfolioData.enableChatbot && <Crown size={11} className="text-amber-400" />}
                  <img src="iconlogo\ai.png" alt="AI" className={`w-3 ${portfolioData.enableChatbot ? "filter brightness-0 invert" : "opacity-50"}`} />
                  {portfolioData.enableChatbot ? "AI On" : "AI Off"}
                </button>
              </div>
            </div>

            {/* Help + Profile */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("fyx_onboarding_seen");
                  setShowOnboarding(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
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