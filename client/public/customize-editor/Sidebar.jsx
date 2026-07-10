// src/pages/Customize/customize-editor/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Settings2, Palette, Save, Rocket,
  Briefcase, Globe, Lock, LayoutTemplate,
  PanelRight, PanelLeft, Check,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { useAuth } from "../../../../context/AuthContext";
import UpgradePopup from "../../../../components/UpgradePopup";
import TalentVisibilityPopup from "../TalentVisibilityPopup";
import { saveOrUpdatePortfolio } from "../../../../api/portfolioAPI";
import { TEMPLATE_LIST } from "../../Templates";
import StylePanel from "./StylePanel";

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

/* ─────────────────────────────────────────
   Tooltip wrapper
───────────────────────────────────────── */
const Tip = ({ label, side = "right", children }) => (
  <div className="relative group/tip flex items-center w-full">
    {children}
    <div
      className={`
        pointer-events-none absolute z-[9999] whitespace-nowrap
        px-2.5 py-1.5 rounded-lg text-[11px] font-medium
        bg-gray-900 text-white shadow-xl
        opacity-0 group-hover/tip:opacity-100
        scale-95 group-hover/tip:scale-100
        transition-all duration-150
        ${side === "right"
          ? "left-[calc(100%+10px)] top-1/2 -translate-y-1/2"
          : "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"}
      `}
    >
      {label}
      <span
        className={`
          absolute top-1/2 -translate-y-1/2 border-4 border-transparent
          ${side === "right" ? "-left-2 border-r-gray-900" : "-right-2 border-l-gray-900"}
        `}
      />
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Icon nav button
───────────────────────────────────────── */
const NavBtn = ({ icon: Icon, label, onClick, active, badge, side = "right", accent = false, danger = false }) => (
  <Tip label={label} side={side}>
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-[3px]
        w-full py-2.5 px-1 rounded-xl transition-all duration-200 select-none
        ${active
          ? "bg-gray-900 text-white shadow-md"
          : danger
            ? "text-red-400 hover:bg-red-50 hover:text-red-500"
            : accent
              ? "text-violet-500 hover:bg-violet-50"
              : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
      <span className={`text-[7.5px] font-bold tracking-wide leading-none uppercase
        ${active ? "text-gray-300" : danger ? "text-red-400" : "text-gray-400"}
      `}>
        {label}
      </span>
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-white animate-pulse" />
      )}
      {active && (
        <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-500 rounded-full" />
      )}
    </button>
  </Tip>
);

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const Divider = () => <div className="w-8 h-px bg-gray-100 mx-auto my-1" />;

const SectionLabel = ({ label }) => (
  <p className="text-[6.5px] font-black text-gray-300 uppercase tracking-widest text-center mb-1 mt-1 select-none">
    {label}
  </p>
);

/* ─────────────────────────────────────────
   Mobile bottom bar
   – always visible (no md:hidden)
   – shown inside the preview iframe too via fixed positioning
───────────────────────────────────────── */
const MobileBar = ({
  isPanelOpen,
  togglePanel,
  onOpenThemes,
  onSave,
  onPreview,
  saveState,
  portfolioData,
  toggleVisibility,
  onOpenStyle,
}) => (
  <div
    className="fixed bottom-0 left-0 right-0 z-[500] md:hidden"
    style={{
      background: "#ffffff",
      borderTop: "1px solid #f0f0f0",
      boxShadow: "0 -2px 16px -4px rgba(0,0,0,0.10)",
    }}
  >
    <div
      className="flex items-end justify-around px-1"
      style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))", paddingTop: "8px" }}
    >

      {/* ── Editor ── */}
      <button
        type="button"
        onClick={togglePanel}
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-2xl transition-all min-w-[52px]"
        style={
          isPanelOpen
            ? { background: "#111827", color: "#ffffff" }
            : { color: "#6b7280" }
        }
      >
        <Settings2 size={19} strokeWidth={isPanelOpen ? 2.2 : 1.7} />
        <span
          className="text-[9px] font-bold uppercase tracking-wide leading-none"
          style={{ color: isPanelOpen ? "#d1d5db" : "#9ca3af" }}
        >
          Editor
        </span>
      </button>

      {/* ── Style ── */}
      <button
        type="button"
        onClick={onOpenStyle}
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-2xl transition-all min-w-[52px]"
        style={{ color: "#6b7280" }}
      >
        <Palette size={19} strokeWidth={1.7} />
        <span className="text-[9px] font-bold uppercase tracking-wide leading-none text-[#9ca3af]">
          Style
        </span>
      </button>

      {/* ── Save (prominent center pill) ── */}
      <button
        type="button"
        onClick={onSave}
        className="flex flex-col items-center gap-[5px] rounded-2xl transition-all min-w-[60px] shadow-md"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
          background:
            saveState === "done"
              ? "#10b981"
              : saveState === "saving"
              ? "#374151"
              : "#111827",
          color: "#ffffff",
          transform: "translateY(-4px)",
        }}
      >
        {saveState === "saving" ? (
          <div className="w-[19px] h-[19px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : saveState === "done" ? (
          <Check size={19} />
        ) : (
          <Save size={19} strokeWidth={1.7} />
        )}
        <span className="text-[9px] font-bold uppercase tracking-wide leading-none">
          {saveState === "saving" ? "Saving" : saveState === "done" ? "Saved!" : "Save"}
        </span>
      </button>

      {/* ── Private / Public ── */}
      <button
        type="button"
        onClick={toggleVisibility}
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-2xl transition-all min-w-[52px]"
        style={
          portfolioData?.isPublic
            ? { color: "#059669" }
            : { color: "#6b7280" }
        }
      >
        {portfolioData?.isPublic ? (
          <Globe size={19} />
        ) : (
          <Lock size={19} strokeWidth={1.7} />
        )}
        <span
          className="text-[9px] font-bold uppercase tracking-wide leading-none"
          style={{ color: portfolioData?.isPublic ? "#059669" : "#9ca3af" }}
        >
          {portfolioData?.isPublic ? "Public" : "Private"}
        </span>
      </button>

      {/* ── Deploy ── */}
      <button
        type="button"
        onClick={onPreview}
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-2xl transition-all min-w-[52px] shadow-sm"
        style={{ background: "#7c3aed", color: "#ffffff" }}
      >
        <Rocket size={19} strokeWidth={1.5} />
        <span className="text-[9px] font-bold uppercase tracking-wide leading-none">
          Deploy
        </span>
      </button>

    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN SIDEBAR
═══════════════════════════════════════════ */
const Sidebar = ({ isPanelOpen, togglePanel, onOpenThemes, onSave, onPreview, sidebarSide, onToggleSide }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();

  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTalentPopup, setShowTalentPopup] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("premium_template");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | done

  const isFreeUser = (user?.plan || "free") === "free";
  const tipSide = sidebarSide === "right" ? "left" : "right";
  const isPremium = PREMIUM_TEMPLATES.includes(portfolioData?.template);

  const posClass = sidebarSide === "right"
    ? "right-0 border-l border-gray-100 shadow-[-4px_0_24px_-6px_rgba(0,0,0,0.10)]"
    : "left-0 border-r border-gray-100 shadow-[4px_0_24px_-6px_rgba(0,0,0,0.10)]";

  /* Close style panel on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowStylePanel(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSaveClick = async () => {
    if (isFreeUser && isPremium) { setUpgradeReason("premium_template"); setShowUpgrade(true); return; }
    setSaveState("saving");
    await onSave();
    setSaveState("done");
    setTimeout(() => setSaveState("idle"), 2500);
  };

  const handleColorChange = (key, value) => setPortfolioData(prev => ({ ...prev, [key]: value }));
  const handleFontChange = (fontValue) => setPortfolioData(prev => ({ ...prev, themeFontFamily: fontValue }));

  const resetColors = () => {
    const tpl = TEMPLATE_LIST[portfolioData?.template || "modern"] || {};
    setPortfolioData(prev => ({
      ...prev,
      themeBg: tpl.themeBg || "#000000",
      themeFont: tpl.themeFont || "#ffffff",
      themeFontFamily: "Switzer, sans-serif",
    }));
  };

  const toggleVisibility = async () => {
    const next = !portfolioData?.isPublic;
    setPortfolioData(prev => ({ ...prev, isPublic: next }));
    try { await saveOrUpdatePortfolio({ ...portfolioData, isPublic: next }); }
    catch (e) { console.error(e); }
  };

  return (
    <>
      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason={upgradeReason} />
      {showTalentPopup && (
        <TalentVisibilityPopup
          isOpen={showTalentPopup}
          onClose={() => setShowTalentPopup(false)}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
        />
      )}

      {/* ── Mobile Bottom Bar ── */}
      <MobileBar
        isPanelOpen={isPanelOpen}
        togglePanel={togglePanel}
        onOpenThemes={onOpenThemes}
        onSave={handleSaveClick}
        onPreview={onPreview}
        saveState={saveState}
        portfolioData={portfolioData}
        toggleVisibility={toggleVisibility}
        onOpenStyle={() => setShowStylePanel(p => !p)}
      />

      {/* ── Desktop Sidebar ── */}
      <div
        className={`
          hidden md:flex fixed top-14 bottom-0 w-[64px] bg-white/98 backdrop-blur-sm z-[500]
          flex-col items-center pt-2 pb-3 gap-0
          ${posClass}
        `}
      >
        {/* CONTENT */}
        <div className="w-full px-2 mb-0.5">
          <SectionLabel label="Content" />
          <NavBtn icon={Settings2} label="Editor" onClick={togglePanel} active={isPanelOpen} side={tipSide} accent />
        </div>

        <Divider />

        {/* DESIGN */}
        <div className="w-full px-2 mt-0.5">
          <SectionLabel label="Design" />

          {/* Style flyout */}
          <div className="relative w-full">
            <NavBtn
              icon={() => (
                <img
                  src="/iconlogo/style-effect3.png"
                  alt="Style"
                  className="w-5 h-5 rounded-sm object-cover"
                />
              )}
              label="Style"
              onClick={() => setShowStylePanel(p => !p)}
              active={showStylePanel}
              side={tipSide}
            />
            {showStylePanel && (
              <StylePanel
                portfolioData={portfolioData}
                onColorChange={handleColorChange}
                onFontChange={handleFontChange}
                onReset={resetColors}
                onClose={() => setShowStylePanel(false)}
                side={sidebarSide}
              />
            )}
          </div>

          <NavBtn
            icon={() => (
              <img
                src="/iconlogo/theme-logo.png"
                alt="Themes"
                className="w-5 h-5 rounded-sm object-cover"
              />
            )}
            label="Themes"
            onClick={onOpenThemes}
            side={tipSide}
          />
        </div>

        <Divider />

        {/* SETTINGS */}
        <div className="w-full px-2 mt-0.5">
          <SectionLabel label="Settings" />
          <NavBtn
            icon={portfolioData?.isPublic ? Globe : Lock}
            label={portfolioData?.isPublic ? "Public" : "Private"}
            onClick={toggleVisibility}
            active={portfolioData?.isPublic}
            side={tipSide}
            badge={portfolioData?.isPublic}
          />
          <NavBtn icon={Briefcase} label="Talent" onClick={() => setShowTalentPopup(true)} side={tipSide} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* DOCK TOGGLE */}
        <div className="w-full px-2">
          <Tip label={sidebarSide === "left" ? "Move sidebar right" : "Move sidebar left"} side={tipSide}>
            <button
              type="button"
              onClick={onToggleSide}
              className="flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-xl text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all"
            >
              {sidebarSide === "left" ? <PanelRight size={14} strokeWidth={1.5} /> : <PanelLeft size={14} strokeWidth={1.5} />}
              <span className="text-[6.5px] font-bold tracking-widest uppercase text-gray-300">Dock</span>
            </button>
          </Tip>
        </div>

        <Divider />

        {/* SAVE */}
        <div className="w-full px-2">
          <Tip label="Save your changes" side={tipSide}>
            <button
              type="button"
              onClick={handleSaveClick}
              className={`
                flex flex-col items-center justify-center gap-[4px]
                w-full py-2.5 rounded-xl transition-all text-[7.5px] font-black uppercase tracking-wide
                ${saveState === "done"
                  ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                  : saveState === "saving"
                    ? "bg-gray-50 text-gray-400"
                    : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                }
              `}
            >
              {saveState === "saving"
                ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                : saveState === "done"
                  ? <Check size={15} className="text-emerald-500" />
                  : <Save size={15} strokeWidth={1.7} />
              }
              {saveState === "saving" ? "Saving…" : saveState === "done" ? "Saved!" : "Save"}
            </button>
          </Tip>
        </div>

        {/* DEPLOY */}
        <div className="w-full px-2 pb-1">
          <Tip label="Publish portfolio live" side={tipSide}>
            <button
              type="button"
              onClick={() => {
                if (isFreeUser && isPremium) { setUpgradeReason("premium_template"); setShowUpgrade(true); return; }
                onPreview();
              }}
              className={`
                w-full py-3 rounded-xl flex flex-col items-center justify-center gap-1.5
                transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                ${isPremium
                  ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              <Rocket size={15} strokeWidth={1.5} />
              <span className="text-[7px] font-black tracking-widest uppercase">
                {isPremium ? "Pro Deploy" : "Deploy"}
              </span>
            </button>
          </Tip>
        </div>
      </div>
    </>
  );
};

export default Sidebar;