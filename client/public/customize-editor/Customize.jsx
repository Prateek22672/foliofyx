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
import StudioFooter from "./StudioFooter";

const SIDEBAR_W = 64; // px — must match the sidebar's w-[64px]

/* ════════════════════════════════════════
   "Open Editor" hint
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

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [viewMode, setViewMode] = useState("dual");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  const [sidebarSide, setSidebarSide] = useState("left");

  const [themeBg, setThemeBg] = useState("#000000");
  const [themeFont, setThemeFont] = useState("#FFFFFF");

  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const seen = localStorage.getItem("fyx_onboarding_seen");
    if (!seen) {
      const t = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const formLogic = useCustomizeForm(portfolioData, setPortfolioData);
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const latestX = useRef(0);

  // ── Data loading ──
  useEffect(() => {
    async function load() {
      if (location.state?.portfolioData) {
        setPortfolioData(location.state.portfolioData);
        if (location.state.portfolioData.themeBg) setThemeBg(location.state.portfolioData.themeBg);
        if (location.state.portfolioData.themeFont) setThemeFont(location.state.portfolioData.themeFont);
        isLoadedRef.current = true;
        return;
      }
      if (portfolioData?._id) {
        isLoadedRef.current = true;
        if (portfolioData.themeBg) setThemeBg(portfolioData.themeBg);
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
        if (restored.themeBg) setThemeBg(restored.themeBg);
        if (restored.themeFont) setThemeFont(restored.themeFont);
      } catch (err) {
        console.error("Load failed", err);
      }
    }
    load();
  }, [location.state, template, setPortfolioData]);

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
  // The drag calculates from the RAW window edge, then we subtract
  // the sidebar width so the percentage is relative to the workspace,
  // not the full viewport.
  const processFrame = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
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
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  const startDragging = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleGenerateBio = () => {
    if (!portfolioData) return;
    const { name, role, education, experience, skills, projects } = portfolioData;
    const skillList = Array.isArray(skills) ? skills.map((s) => (typeof s === "string" ? s : s.name)).join(", ") : "";
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
        ? data.skills.map(s => typeof s === "string" ? { name: s, level: "Intermediate" } : s)
        : []
    };
  };

  const handleSave = async () => {
    try {
      const saved = await saveOrUpdatePortfolio(formatPortfolioData(portfolioData));
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
      const saved = await saveOrUpdatePortfolio(formatPortfolioData(portfolioData));
      setPortfolioData(saved);
      setMessage("Redirecting…");
      setTimeout(() => navigate(`/portfolio/${saved._id}`), 1000);
    } catch (err) {
      console.error("Preview Error:", err);
      setMessage("Failed.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // ── Layout math ──
  const isDesktop = windowWidth >= 768;
  const sidebarVisible = isDesktop && !showPreviewMobile && viewMode !== "desktop";

  /*
    Key fix:
    The workspace container has `paddingLeft` (or Right) = SIDEBAR_W so content
    never slides under the fixed sidebar. The editor-panel width is expressed as
    a percentage of the workspace (container minus sidebar), not the full viewport,
    so there are NO gaps between the editor panel and the preview area.
  */
  const workspacePaddingStyle = sidebarVisible
    ? sidebarSide === "left"
      ? { paddingLeft: SIDEBAR_W }
      : { paddingRight: SIDEBAR_W }
    : {};

  let editorWidthStr = "0%";
  let isEditorVisible = false;

  if (showPreviewMobile) {
    editorWidthStr = "0%"; isEditorVisible = false;
  } else if (!isDesktop) {
    editorWidthStr = "100%"; isEditorVisible = true;
  } else if (viewMode === "desktop") {
    editorWidthStr = "0%"; isEditorVisible = false;
  } else {
    // Width is a percentage of the flex container (which already has sidebar
    // offset via padding), so no extra math needed here.
    editorWidthStr = isPanelOpen ? `${rightPanelWidth}%` : "0px";
    isEditorVisible = isPanelOpen;
  }

  const isMobileSim = viewMode === "mobile";

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

      {showOnboarding && (
        <OnboardingTutorial onComplete={() => {
          localStorage.setItem("fyx_onboarding_seen", "1");
          setShowOnboarding(false);
        }} />
      )}

      {/* Top header — full width, sits above the sidebar */}
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
          const active = isPreview ? showPreviewMobile : !showPreviewMobile;
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

      {/*
        Fixed sidebar — only on desktop.
        Rendered OUTSIDE the workspace container so it floats fixed over the page.
        The workspace container compensates with paddingLeft/Right = SIDEBAR_W.
      */}
      {sidebarVisible && (
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

      {/*
        Mobile bottom bar — Sidebar renders this internally via md:hidden.
        No extra wrapper needed here; Sidebar.jsx handles it.
      */}
      {!isDesktop && (
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

      {/* Open editor hint (desktop only) */}
      {!isPanelOpen && !showPreviewMobile && viewMode !== "desktop" && isDesktop && (
        <EditorHint onClick={togglePanel} sidebarSide={sidebarSide} />
      )}

      {/*
        MAIN WORKSPACE
        ─────────────────────────────────────────────────────────────
        padding-left/right = SIDEBAR_W  →  workspace never slides
        under the fixed sidebar.

        The flex row inside:
          [preview: flex-1]  [resizer: 4px]  [editor: rightPanelWidth%]

        Because the editor is on the RIGHT and preview takes flex-1,
        there is zero gap — they are adjacent flex siblings.
        ─────────────────────────────────────────────────────────────
      */}
      <div
        ref={containerRef}
        className="flex flex-1 relative w-full min-w-0 overflow-x-hidden items-stretch"
        style={workspacePaddingStyle}
      >
        {/* ── PREVIEW (flex-1 = fills all remaining space) ── */}
        <div
          className={`
            flex-1 min-w-0 relative bg-white overflow-x-hidden
            ${showPreviewMobile ? "block w-full" : "hidden"}
            md:block
          `}
          style={{ minHeight: "100vh" }}
        >
          <div
            className={`
              h-full w-full transition-colors duration-300
              ${isMobileSim ? "bg-gray-200/80 py-10 flex items-start justify-center" : "bg-white"}
            `}
          >
            {/* Drag overlay — prevents iframe/canvas from stealing events */}
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

        {/* ── RESIZER (desktop dual mode only) ── */}
        {viewMode === "dual" && isPanelOpen && !showPreviewMobile && isDesktop && (
          <Resizer onMouseDown={startDragging} isDragging={isDragging} />
        )}

        {/* ── EDITOR PANEL (desktop) ── */}
        {!showPreviewMobile && viewMode !== "desktop" && isDesktop && (
          <div
            style={{
              width: editorWidthStr,
              flexShrink: 0,
              transition: isDragging ? "none" : "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "width",
              overflow: "hidden",
              // Ensure no gap on the right when sidebar is right-docked
              minWidth: isPanelOpen ? undefined : 0,
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

        {/* ── EDITOR PANEL (mobile — full width, behind tab toggle) ── */}
        {!showPreviewMobile && !isDesktop && (
          <div className="w-full" style={{ paddingBottom: 72 }}>
            <EditorPanel
              width="100%"
              isVisible={true}
              isPanelOpen={true}
              onClose={() => { }}
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
      <StudioFooter
        isMobileSim={isMobileSim}
        showPreviewMobile={showPreviewMobile}
        windowWidth={windowWidth}
      />

    </div>
  );
};

export default Customize;