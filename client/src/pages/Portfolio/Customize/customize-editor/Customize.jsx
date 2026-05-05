// src/pages/Customize/customize-editor/Customize.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { saveOrUpdatePortfolio, getPortfolio } from "../../../../api/portfolioAPI";
import PopupMessage from "../../../../components/PopupMessage";
import { Edit3 } from "lucide-react";

// Sub Components
import EditHeader from "../EditHeader";
import RightPanel from "../RightPanel";
import ThemePopup from "../ThemePopup";
import { TEMPLATE_LIST } from "../../Templates";

// Refactored Components
import Sidebar from "./Sidebar";
import EditorPanel from "./EditorPanel";
import Resizer from "./Resizer";
import { useCustomizeForm } from "./useCustomizeForm";
import OnboardingTutorial from "./OnboardingTutorial";

/* ════════════════════════════════════════
   "Open Editor" hint when panel is closed
════════════════════════════════════════ */
const EditorHint = ({ onClick, sidebarSide }) => {
  const posClass = sidebarSide === "left" ? "left-[80px]" : "right-[80px]";
  return (
    <div
      className={`
        hidden md:flex fixed bottom-8 ${posClass} z-[400]
        items-center gap-3
        bg-white border border-gray-200 shadow-2xl
        px-4 py-3 rounded-2xl cursor-pointer
        hover:shadow-3xl hover:-translate-y-0.5 active:translate-y-0
        transition-all duration-200 group
        animate-in fade-in slide-in-from-bottom-2 duration-500
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <span className="relative flex h-2.5 w-2.5 flex-none">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500" />
      </span>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold text-gray-900 leading-tight">Open Editor</span>
        <span className="text-[10px] text-gray-400 leading-tight">Click to edit your content</span>
      </div>
      <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors flex-none">
        <Edit3 size={13} className="text-violet-600" />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const Customize = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { template } = useParams();
  const { portfolioData, setPortfolioData } = usePortfolio();
  const isLoadedRef = useRef(false);

  const [showThemeModal, setShowThemeModal]       = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [viewMode, setViewMode]                   = useState("dual");
  const [windowWidth, setWindowWidth]             = useState(window.innerWidth);

  const [isPanelOpen, setIsPanelOpen]         = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(35);
  const [isDragging, setIsDragging]           = useState(false);

  const [sidebarSide, setSidebarSide] = useState("left");

  const [themeBg, setThemeBg]     = useState("#000000");
  const [themeFont, setThemeFont] = useState("#FFFFFF");

  // Onboarding: show on first visit
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("fyx_onboarding_seen");
    if (!seen) {
      // Small delay so the editor loads first, then show tutorial
      const t = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const formLogic    = useCustomizeForm(portfolioData, setPortfolioData);
  const rafRef       = useRef(null);
  const containerRef = useRef(null);
  const latestX      = useRef(0);

  // ── Data loading ──
  useEffect(() => {
    async function load() {
      if (location.state?.portfolioData) {
        setPortfolioData(location.state.portfolioData);
        if (location.state.portfolioData.themeBg)   setThemeBg(location.state.portfolioData.themeBg);
        if (location.state.portfolioData.themeFont) setThemeFont(location.state.portfolioData.themeFont);
        isLoadedRef.current = true;
        return;
      }
      if (portfolioData?._id) {
        isLoadedRef.current = true;
        if (portfolioData.themeBg)   setThemeBg(portfolioData.themeBg);
        if (portfolioData.themeFont) setThemeFont(portfolioData.themeFont);
        return;
      }
      try {
        let restored = {};
        const savedLocal = localStorage.getItem("portfolioData");
        if (savedLocal) restored = JSON.parse(savedLocal);
        if (restored._id) {
          const fresh = await getPortfolio(restored._id);
          if (fresh) restored = { ...fresh };
        }
        if (!restored.template) restored.template = template || "modern";
        setPortfolioData(restored);
        isLoadedRef.current = true;
        if (restored.themeBg)   setThemeBg(restored.themeBg);
        if (restored.themeFont) setThemeFont(restored.themeFont);
      } catch (err) {
        console.error("Load failed", err);
      }
    }
    load();
  }, [location.state, template, setPortfolioData]);

  // ── Window resize ──
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => {
      if (!prev) setRightPanelWidth(35);
      return !prev;
    });
  }, []);

  // ── RAF-based drag ──
  const processFrame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect    = container.getBoundingClientRect();
    const fromRight = ((rect.right - latestX.current) / rect.width) * 100;
    setRightPanelWidth(Math.max(20, Math.min(60, fromRight)));
    rafRef.current = null;
  }, []);

  const onMouseMove = useCallback((e) => {
    latestX.current = e.clientX;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(processFrame);
  }, [processFrame]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    document.body.style.cursor     = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseup",   onMouseUp);
      document.body.style.cursor     = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const startDragging = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // ── Action handlers ──
  const handleGenerateBio = () => {
    if (!portfolioData) return;
    const { name, role, education, experience, skills, projects } = portfolioData;
    const skillList   = Array.isArray(skills)   ? skills.map((s) => (typeof s === "string" ? s : s.name)).join(", ") : "";
    const projectList = Array.isArray(projects) ? projects.map((p) => p.title).join(", ") : "";
    let expText = "professional experience";
    if (Array.isArray(experience) && experience.length > 0)
      expText = `a professional background at ${experience.map((e) => e.company).filter(Boolean).join(", ")}`;
    const autoBio = `I'm ${name || "a Creator"}, working as ${role || "a Developer"} with ${expText}. I hold a degree in ${education || "Tech"} and specialize in ${skillList}. I've worked on projects like ${projectList}, focusing on innovation.`.trim();
    setPortfolioData({ ...portfolioData, bio: autoBio });
    setMessage("Bio generated!");
    setTimeout(() => setMessage(""), 2500);
  };

  const formatPortfolioData = (data) => {
    if (!data) return data;
    return {
      ...data,
      skills: Array.isArray(data.skills)
        ? data.skills.map(s => {
            if (typeof s === "string") return { name: s, level: "Intermediate" };
            return s;
          })
        : []
    };
  };

  const handleSave = async () => {
    try {
      const dataToSave = formatPortfolioData(portfolioData);
      const saved = await saveOrUpdatePortfolio(dataToSave);
      setPortfolioData(saved);
      setMessage("Saved!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Save Error:", err);
      setMessage("Save failed.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handlePreview = async () => {
    try {
      const dataToSave = formatPortfolioData(portfolioData);
      const saved = await saveOrUpdatePortfolio(dataToSave);
      setPortfolioData(saved);
      setMessage("Redirecting…");
      setTimeout(() => navigate(`/portfolio/${saved._id}`), 1000);
    } catch (err) {
      console.error("Preview Error:", err);
      setMessage("Failed.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // ── Layout calculation ──
  let editorWidthStr  = "0%";
  let isEditorVisible = false;

  if (showPreviewMobile) {
    editorWidthStr = "0%"; isEditorVisible = false;
  } else if (windowWidth < 768) {
    editorWidthStr = "100%"; isEditorVisible = true;
  } else if (viewMode === "desktop") {
    editorWidthStr = "0%"; isEditorVisible = false;
  } else {
    editorWidthStr  = isPanelOpen ? `${rightPanelWidth}%` : "0px";
    isEditorVisible = isPanelOpen;
  }

  const isMobileSim        = viewMode === "mobile";
  const sidebarOffsetClass = sidebarSide === "left" ? "md:ml-[64px]" : "md:mr-[64px]";

  if (!portfolioData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading workspace…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 relative overflow-x-hidden overflow-y-auto">

      {/* Onboarding tutorial (first visit only) */}
      {showOnboarding && (
        <OnboardingTutorial onComplete={() => {
          localStorage.setItem("fyx_onboarding_seen", "1");
          setShowOnboarding(false);
        }} />
      )}

      {/* Top header */}
      <div className="flex-none sticky top-0 z-[600] bg-white border-b border-gray-100">
        <EditHeader
          setViewMode={setViewMode}
          viewMode={viewMode}
          onOpenThemes={() => setShowThemeModal(true)}
        />
      </div>

      <PopupMessage message={message} onClose={() => setMessage("")} />

      {showThemeModal && (
        <ThemePopup
          onClose={() => setShowThemeModal(false)}
          onSelect={(k) => {
            setPortfolioData((prev) => ({ ...prev, template: k }));
            window.history.replaceState(null, "", `/customize/${k}`);
            setMessage(`Theme changed to ${TEMPLATE_LIST?.[k]?.label || k}`);
            setTimeout(() => setMessage(""), 2000);
          }}
        />
      )}

      {/* Mobile tab toggle */}
      <div className="md:hidden flex-none flex justify-between items-center px-4 py-2.5 bg-white border-b border-gray-100 sticky top-[56px] z-40">
        {["Editor", "Preview"].map((tab) => {
          const isPreview = tab === "Preview";
          const active    = isPreview ? showPreviewMobile : !showPreviewMobile;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setShowPreviewMobile(isPreview)}
              className={`
                flex-1 py-2 rounded-xl text-xs font-semibold transition-all mx-1
                ${active
                  ? isPreview
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-gray-900 text-white shadow-md"
                  : "text-gray-400 bg-gray-50"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Floating sidebar (desktop) */}
      {!showPreviewMobile && viewMode !== "desktop" && (
        <Sidebar
          isPanelOpen={isPanelOpen}
          togglePanel={togglePanel}
          onOpenThemes={() => setShowThemeModal(true)}
          onSave={handleSave}
          onPreview={handlePreview}
          sidebarSide={sidebarSide}
          onToggleSide={() => setSidebarSide((s) => (s === "left" ? "right" : "left"))}
        />
      )}

      {/* Open editor hint */}
      {!isPanelOpen && !showPreviewMobile && viewMode !== "desktop" && windowWidth >= 768 && (
        <EditorHint onClick={togglePanel} sidebarSide={sidebarSide} />
      )}

      {/* MAIN WORKSPACE */}
      <div
        ref={containerRef}
        className={`flex flex-1 relative w-full min-w-0 overflow-x-hidden items-stretch ${sidebarOffsetClass}`}
      >
        {/* PREVIEW */}
        <div
          className={`
            flex-1 min-w-0 min-h-screen relative bg-white overflow-x-hidden
            ${showPreviewMobile ? "block w-full" : "hidden"}
            md:block
          `}
        >
          <div
            className={`
              h-full w-full transition-colors duration-300
              ${isMobileSim ? "bg-gray-200/80 py-10 flex items-start justify-center" : "bg-white"}
            `}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-transparent z-50 cursor-col-resize" />
            )}
            <div
              className={`
                transition-all duration-500 ease-in-out mx-auto bg-white relative
                ${isMobileSim
                  ? "w-[375px] h-[812px] rounded-[44px] border-[12px] border-gray-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden"
                  : "w-full h-full overflow-y-auto"
                }
              `}
            >
              {isMobileSim && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[22px] bg-gray-900 rounded-b-2xl z-50 pointer-events-none" />
              )}
              <RightPanel portfolioData={portfolioData} />
            </div>
          </div>
        </div>

        {/* RESIZER */}
        {viewMode === "dual" && isPanelOpen && !showPreviewMobile && windowWidth >= 768 && (
          <Resizer onMouseDown={startDragging} isDragging={isDragging} />
        )}

        {/* EDITOR PANEL */}
        {!showPreviewMobile && viewMode !== "desktop" && (
          <div
            style={{
              width: editorWidthStr,
              flexShrink: 0,
              transition: isDragging ? "none" : "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "width",
              overflow: "hidden",
            }}
            className="h-full"
          >
            <EditorPanel
              width="100%"
              isVisible={isEditorVisible}
              isPanelOpen={isPanelOpen}
              onClose={() => setIsPanelOpen(false)}
              isDragging={isDragging}
              portfolioData={portfolioData}
              setPortfolioData={setPortfolioData}
              handleGenerateBio={handleGenerateBio}
              handleSave={handleSave}
              handlePreview={handlePreview}
              formLogic={formLogic}
              themeBg={themeBg} setThemeBg={setThemeBg}
              themeFont={themeFont} setThemeFont={setThemeFont}
            />
          </div>
        )}

        {/* Mobile editor */}
        {!showPreviewMobile && windowWidth < 768 && (
          <div className="w-full">
            <EditorPanel
              width="100%"
              isVisible={true}
              isPanelOpen={true}
              onClose={() => {}}
              isDragging={false}
              portfolioData={portfolioData}
              setPortfolioData={setPortfolioData}
              handleGenerateBio={handleGenerateBio}
              handleSave={handleSave}
              handlePreview={handlePreview}
              formLogic={formLogic}
              themeBg={themeBg} setThemeBg={setThemeBg}
              themeFont={themeFont} setThemeFont={setThemeFont}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      {!isMobileSim && (!showPreviewMobile || windowWidth >= 768) && (
        <div className={`relative w-full bg-black mt-40 pt-20 border-t border-white/5 z-30 pb-10 ${sidebarOffsetClass}`}>
          <div className="w-full flex items-center justify-center text-[10px] font-medium tracking-[0.2em] uppercase text-gray-500 mb-4 px-4 text-center">
            <span>Designed &amp; Built by{" "}
              <img className="w-20 sm:w-32 inline-block ml-2 align-middle" src="/logow.png" alt="logo" />
            </span>
          </div>
          <div className="w-full overflow-hidden leading-none select-none pointer-events-none flex justify-center">
            <h1 className="text-[35vw] font-black text-white text-center" style={{ fontFamily: "Switzer, sans-serif" }}>
              Studio
            </h1>
          </div>
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-[10px] tracking-tighter">
              FY<span className="text-violet-600">X</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customize;