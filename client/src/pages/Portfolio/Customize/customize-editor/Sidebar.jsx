// src/pages/Customize/customize-editor/Sidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Settings2, Palette, Save, Rocket, RotateCcw,
  Briefcase, Globe, Lock, LayoutTemplate, Type,
  PanelRight, PanelLeft, Check, X, Eye, EyeOff,
  ChevronDown, Sparkles, Menu, Moon, Sun
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { useAuth } from "../../../../context/AuthContext";
import UpgradePopup from "../../../../components/UpgradePopup";
import TalentVisibilityPopup from "../TalentVisibilityPopup";
import { saveOrUpdatePortfolio } from "../../../../api/portfolioAPI";
import { TEMPLATE_LIST } from "../../Templates";

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

const FONT_OPTIONS = [
  { label: "Switzer",   value: "Switzer, sans-serif",         type: "Default"  },
  { label: "Inter",     value: '"Inter", sans-serif',          type: "Clean"    },
  { label: "Playfair",  value: '"Playfair Display", serif',    type: "Serif"    },
  { label: "Space",     value: '"Space Grotesk", sans-serif',  type: "Tech"     },
  { label: "Outfit",    value: '"Outfit", sans-serif',         type: "Modern"   },
  { label: "Oswald",    value: '"Oswald", sans-serif',         type: "Bold"     },
  { label: "Fira Code", value: '"Fira Code", monospace',       type: "Code"     },
  { label: "Syne",      value: '"Syne", sans-serif',           type: "Artistic" },
];

/* ── Tooltip ── */
const Tip = ({ label, side = "right", children }) => (
  <div className="relative group/tip flex items-center w-full">
    {children}
    <div className={`
      pointer-events-none absolute z-[9999] whitespace-nowrap
      px-2.5 py-1.5 rounded-lg text-[11px] font-medium
      bg-gray-900 text-white shadow-xl
      opacity-0 group-hover/tip:opacity-100
      scale-95 group-hover/tip:scale-100
      transition-all duration-150
      ${side === "right"
        ? "left-[calc(100%+10px)] top-1/2 -translate-y-1/2"
        : "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"}
    `}>
      {label}
      <span className={`
        absolute top-1/2 -translate-y-1/2 border-4 border-transparent
        ${side === "right" ? "-left-2 border-r-gray-900" : "-right-2 border-l-gray-900"}
      `} />
    </div>
  </div>
);

/* ── Sidebar nav button ── */
const NavBtn = ({ icon: Icon, label, onClick, active, badge, side = "right", accent = false, danger = false }) => (
  <Tip label={label} side={side}>
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-[4px]
        w-full py-3 px-1 rounded-xl transition-all duration-200 select-none group
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
      <Icon size={18} strokeWidth={active ? 2.2 : 1.7} />
      <span className={`text-[8px] font-bold tracking-wide leading-none uppercase
        ${active ? "text-gray-300" : danger ? "text-red-400" : "text-gray-400"}
      `}>
        {label}
      </span>
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-white animate-pulse" />
      )}
      {active && (
        <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-violet-500 rounded-full" />
      )}
    </button>
  </Tip>
);

/* ── Thin divider ── */
const Divider = () => <div className="w-8 h-px bg-gray-100 mx-auto my-1" />;

/* ── Section label ── */
const SectionLabel = ({ label }) => (
  <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest text-center mb-1 mt-1 select-none">
    {label}
  </p>
);

/* ── Panel section heading ── */
const PanelSection = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 mb-3">
    {Icon && <Icon size={11} className="text-gray-400" />}
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

/* ════════════════════════════════════════
   STYLE FLY-OUT PANEL
════════════════════════════════════════ */
const StylePanel = ({ portfolioData, onColorChange, onFontChange, onReset, onClose, side }) => {
  const panelPos = side === "right" ? "right-[calc(100%+8px)]" : "left-[calc(100%+8px)]";
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className={`
        absolute top-0 ${panelPos}
        w-[300px] bg-white rounded-2xl z-[600]
        shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] border border-gray-100
        animate-in fade-in zoom-in-95 slide-in-from-bottom-1 duration-200
        overflow-hidden
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <Palette size={12} className="text-violet-600" />
          </div>
          <span className="text-[13px] font-bold text-gray-800">Site Design</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all"
          >
            <RotateCcw size={10} /> Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

        {/* Colors */}
        <div>
          <PanelSection icon={Palette} label="Colors" />
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "themeBg",   label: "Background", hint: "Page background color" },
              { key: "themeFont", label: "Text Color",  hint: "All body text color"  },
            ].map(({ key, label, hint }) => (
              <label
                key={key}
                className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-600">{label}</span>
                  <div
                    className="w-7 h-7 rounded-lg border-2 border-white shadow-md overflow-hidden relative ring-1 ring-gray-200"
                    style={{ backgroundColor: portfolioData?.[key] || "#fff" }}
                  >
                    <input
                      type="color"
                      value={portfolioData?.[key] || "#ffffff"}
                      onChange={(e) => onColorChange(key, e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: portfolioData?.[key] || "#fff", border: "1px solid #e5e7eb" }} />
                  <span className="text-[9px] text-gray-400 font-mono">{portfolioData?.[key] || "#ffffff"}</span>
                </div>
                <span className="text-[9px] text-gray-400">{hint}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <PanelSection icon={Type} label="Font Family" />
          <div className="grid grid-cols-2 gap-1.5">
            {FONT_OPTIONS.map((font) => {
              const isActive = portfolioData?.themeFontFamily === font.value;
              return (
                <button
                  type="button"
                  key={font.label}
                  onClick={() => onFontChange(font.value)}
                  className={`
                    px-3 py-2.5 rounded-xl text-left border transition-all relative overflow-hidden
                    ${isActive
                      ? "border-gray-900 bg-gray-900 text-white shadow-md"
                      : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-600"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check size={9} className="text-white" />
                    </span>
                  )}
                  <span className="block text-[12px] font-semibold leading-none mb-1" style={{ fontFamily: font.value }}>
                    {font.label}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wide font-bold ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                    {font.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live preview strip */}
        <div>
          <PanelSection label="Preview" />
          <div
            className="rounded-xl p-3 border border-gray-100 text-center transition-all"
            style={{
              backgroundColor: portfolioData?.themeBg || "#ffffff",
              fontFamily: portfolioData?.themeFontFamily || "Switzer, sans-serif",
            }}
          >
            <p className="text-[11px] font-bold mb-0.5" style={{ color: portfolioData?.themeFont || "#000000" }}>
              John Doe — Designer
            </p>
            <p className="text-[9px] opacity-60" style={{ color: portfolioData?.themeFont || "#000000" }}>
              Building beautiful interfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MOBILE BOTTOM BAR
════════════════════════════════════════ */
const MobileBar = ({ isPanelOpen, togglePanel, onOpenThemes, onSave, onPreview, saveState, portfolioData, toggleVisibility }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 z-[500] bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
    <div className="flex items-center justify-around px-2 py-2 safe-area-pb">

      {/* Editor */}
      <button
        type="button"
        onClick={togglePanel}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isPanelOpen ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
      >
        <Settings2 size={18} strokeWidth={1.7} />
        <span className="text-[8px] font-bold uppercase tracking-wide">Editor</span>
      </button>

      {/* Style */}
      <button
        type="button"
        onClick={onOpenThemes}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
      >
        <Palette size={18} strokeWidth={1.7} />
        <span className="text-[8px] font-bold uppercase tracking-wide">Style</span>
      </button>

      {/* Save — center, prominent */}
      <button
        type="button"
        onClick={onSave}
        className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all shadow-sm
          ${saveState === "done" ? "bg-emerald-500 text-white" : "bg-gray-900 text-white hover:bg-gray-700"}
        `}
      >
        {saveState === "saving"
          ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          : saveState === "done"
          ? <Check size={18} />
          : <Save size={18} strokeWidth={1.7} />
        }
        <span className="text-[8px] font-bold uppercase tracking-wide">
          {saveState === "saving" ? "Saving" : saveState === "done" ? "Saved!" : "Save"}
        </span>
      </button>

      {/* Visibility */}
      <button
        type="button"
        onClick={toggleVisibility}
        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${portfolioData?.isPublic ? "text-emerald-500 bg-emerald-50" : "text-gray-500 hover:bg-gray-100"}`}
      >
        {portfolioData?.isPublic ? <Globe size={18} /> : <Lock size={18} strokeWidth={1.7} />}
        <span className="text-[8px] font-bold uppercase tracking-wide">{portfolioData?.isPublic ? "Public" : "Private"}</span>
      </button>

      {/* Deploy */}
      <button
        type="button"
        onClick={onPreview}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-sm"
      >
        <Rocket size={18} strokeWidth={1.5} />
        <span className="text-[8px] font-bold uppercase tracking-wide">Deploy</span>
      </button>

    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN SIDEBAR
════════════════════════════════════════ */
const Sidebar = ({ isPanelOpen, togglePanel, onOpenThemes, onSave, onPreview, sidebarSide, onToggleSide }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();

  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showUpgrade, setShowUpgrade]       = useState(false);
  const [showTalentPopup, setShowTalentPopup] = useState(false);
  const [upgradeReason, setUpgradeReason]   = useState("premium_template");
  const [saveState, setSaveState]           = useState("idle"); // idle | saving | done

  const isFreeUser = (user?.plan || "free") === "free";
  const tipSide    = sidebarSide === "right" ? "left" : "right";
  const isPremium  = PREMIUM_TEMPLATES.includes(portfolioData?.template);

  const posClass = sidebarSide === "right"
    ? "right-0 border-l border-gray-100 shadow-[-4px_0_24px_-6px_rgba(0,0,0,0.10)]"
    : "left-0 border-r border-gray-100 shadow-[4px_0_24px_-6px_rgba(0,0,0,0.10)]";

  // Close style panel on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowStylePanel(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSaveClick = async () => {
    if (isFreeUser && isPremium) {
      setUpgradeReason("premium_template");
      setShowUpgrade(true);
      return;
    }
    setSaveState("saving");
    await onSave();
    setSaveState("done");
    setTimeout(() => setSaveState("idle"), 2500);
  };

  const handleColorChange = (key, value) => {
    setPortfolioData(prev => ({ ...prev, [key]: value }));
  };

  const handleFontChange = (fontValue) => {
    setPortfolioData(prev => ({ ...prev, themeFontFamily: fontValue }));
  };

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
      />

      {/* ── Desktop Sidebar ── */}
      <div className={`
        hidden md:flex fixed top-14 bottom-0 w-[64px] bg-white/98 backdrop-blur-sm z-[500]
        flex-col items-center pt-2 pb-3 gap-0
        ${posClass}
      `}>

        {/* CONTENT */}
        <div className="w-full px-2 mb-0.5">
          <SectionLabel label="Content" />
          <NavBtn
            icon={Settings2}
            label="Editor"
            onClick={togglePanel}
            active={isPanelOpen}
            side={tipSide}
            accent
          />
        </div>

        <Divider />

        {/* DESIGN */}
        <div className="w-full px-2 mt-0.5">
          <SectionLabel label="Design" />

          {/* Style fly-out trigger */}
          <div className="relative w-full">
            <NavBtn
              icon={Palette}
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
            icon={LayoutTemplate}
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

          <NavBtn
            icon={Briefcase}
            label="Talent"
            onClick={() => setShowTalentPopup(true)}
            side={tipSide}
          />
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
              {sidebarSide === "left"
                ? <PanelRight size={14} strokeWidth={1.5} />
                : <PanelLeft size={14} strokeWidth={1.5} />
              }
              <span className="text-[7px] font-bold tracking-widest uppercase text-gray-300">Dock</span>
            </button>
          </Tip>
        </div>

        <Divider />

        {/* SAVE */}
        <div className="w-full px-2">
          <Tip label="Save your changes (Ctrl+S)" side={tipSide}>
            <button
              type="button"
              onClick={handleSaveClick}
              className={`
                flex flex-col items-center justify-center gap-[4px]
                w-full py-3 rounded-xl transition-all text-[8px] font-black uppercase tracking-wide
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
                ? <Check size={16} className="text-emerald-500" />
                : <Save size={16} strokeWidth={1.7} />
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
                if (isFreeUser && isPremium) {
                  setUpgradeReason("premium_template");
                  setShowUpgrade(true);
                  return;
                }
                onPreview();
              }}
              className={`
                w-full py-3.5 rounded-xl flex flex-col items-center justify-center gap-1.5
                transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                ${isPremium
                  ? "bg-gradient-to-b from-amber-400 to-amber-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              <Rocket size={16} strokeWidth={1.5} />
              <span className="text-[7.5px] font-black tracking-widest uppercase">
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