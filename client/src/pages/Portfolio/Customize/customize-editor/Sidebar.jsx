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

/* Hoisted icon components — previously defined inline as `icon={() => <img/>}`
   which created a brand-new component type on every render and remounted the
   <img> each time. Static components mount once. */
const StyleImgIcon = () => (
  <img src="/iconlogo/style-effect3.png" alt="Style" className="w-5 h-5 rounded-sm object-cover" />
);
const ThemesImgIcon = () => (
  <img src="/iconlogo/theme-logo.png" alt="Themes" className="w-5 h-5 rounded-sm object-cover" />
);

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
        bg-[#262626] text-white border border-white/10 shadow-xl shadow-black/40
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
          ${side === "right" ? "-left-2 border-r-[#262626]" : "-right-2 border-l-[#262626]"}
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
        w-full py-2.5 px-1 rounded-lg transition-all duration-200 select-none
        ${active
          ? "bg-white/10 text-white shadow-md"
          : danger
            ? "text-red-400 hover:bg-red-400/10 hover:text-red-300"
            : accent
              ? "text-violet-400 hover:bg-violet-500/10"
              : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5"
        }
      `}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
      <span className={`text-[7.5px] font-bold tracking-wide leading-none uppercase
        ${active ? "text-neutral-300" : danger ? "text-red-400" : "text-neutral-500"}
      `}>
        {label}
      </span>
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-[#0f0f0f] animate-pulse" />
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
const Divider = () => <div className="w-8 h-px bg-white/10 mx-auto my-1" />;

const SectionLabel = ({ label }) => (
  <p className="text-[6.5px] font-black text-neutral-600 uppercase tracking-widest text-center mb-1 mt-1 select-none">
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
      background: "#0f0f0f",
      borderTop: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 -2px 16px -4px rgba(0,0,0,0.5)",
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
        title="Toggle editor panel"
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-xl transition-all min-w-[52px]"
        style={
          isPanelOpen
            ? { background: "rgba(255,255,255,0.12)", color: "#ffffff" }
            : { color: "#8a8a8a" }
        }
      >
        <Settings2 size={19} strokeWidth={isPanelOpen ? 2.2 : 1.7} />
        <span
          className="text-[9px] font-bold uppercase tracking-wide leading-none"
          style={{ color: isPanelOpen ? "#d4d4d4" : "#737373" }}
        >
          Editor
        </span>
      </button>

      {/* ── Style ── */}
      <button
        type="button"
        onClick={onOpenStyle}
        title="Open style panel"
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-xl transition-all min-w-[52px]"
        style={{ color: "#8a8a8a" }}
      >
        <Palette size={19} strokeWidth={1.7} />
        <span className="text-[9px] font-bold uppercase tracking-wide leading-none" style={{ color: "#737373" }}>
          Style
        </span>
      </button>

      {/* ── Save (prominent center pill) ── */}
      <button
        type="button"
        onClick={onSave}
        title="Save your changes"
        className="flex flex-col items-center gap-[5px] rounded-xl transition-all min-w-[60px] shadow-md"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
          background:
            saveState === "done"
              ? "#10b981"
              : saveState === "saving"
              ? "#404040"
              : "#ffffff",
          color: saveState === "idle" ? "#0a0a0a" : "#ffffff",
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
        title={portfolioData?.isPublic ? "Make private" : "Make public"}
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-xl transition-all min-w-[52px]"
        style={
          portfolioData?.isPublic
            ? { color: "#34d399" }
            : { color: "#8a8a8a" }
        }
      >
        {portfolioData?.isPublic ? (
          <Globe size={19} />
        ) : (
          <Lock size={19} strokeWidth={1.7} />
        )}
        <span
          className="text-[9px] font-bold uppercase tracking-wide leading-none"
          style={{ color: portfolioData?.isPublic ? "#34d399" : "#737373" }}
        >
          {portfolioData?.isPublic ? "Public" : "Private"}
        </span>
      </button>

      {/* ── Deploy ── */}
      <button
        type="button"
        onClick={onPreview}
        title="Deploy your portfolio"
        className="flex flex-col items-center gap-[5px] px-2 py-1.5 rounded-xl transition-all min-w-[52px] shadow-sm"
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
    ? "right-0 border-l border-white/10"
    : "left-0 border-r border-white/10";

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
          hidden md:flex fixed top-14 bottom-0 w-[64px] bg-[#0f0f0f] z-[500]
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
              icon={StyleImgIcon}
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
            icon={ThemesImgIcon}
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
              className="flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all"
            >
              {sidebarSide === "left" ? <PanelRight size={14} strokeWidth={1.5} /> : <PanelLeft size={14} strokeWidth={1.5} />}
              <span className="text-[6.5px] font-bold tracking-widest uppercase text-neutral-600">Dock</span>
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
                w-full py-2.5 rounded-lg transition-all text-[7.5px] font-black uppercase tracking-wide
                ${saveState === "done"
                  ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30"
                  : saveState === "saving"
                    ? "bg-white/5 text-neutral-500"
                    : "text-neutral-500 hover:text-emerald-300 hover:bg-emerald-400/10"
                }
              `}
            >
              {saveState === "saving"
                ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                : saveState === "done"
                  ? <Check size={15} className="text-emerald-400" />
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
                w-full py-3 rounded-lg flex flex-col items-center justify-center gap-1.5
                transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                ${isPremium
                  ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white"
                  : "bg-white text-black hover:bg-neutral-200"
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
