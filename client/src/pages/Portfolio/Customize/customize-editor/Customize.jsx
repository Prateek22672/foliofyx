// src/pages/Customize/customize-editor/Customize.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { saveOrUpdatePortfolio, getPortfolio } from "../../../../api/portfolioAPI";
import PopupMessage from "../../../../components/PopupMessage";

// Sub Components
import EditHeader from "../EditHeader";
import RightPanel from "../RightPanel";
import ThemePopup from "../ThemePopup";
import { TEMPLATE_LIST } from "../../Templates";

// New Refactored Components
import Sidebar from "./Sidebar";
import EditorPanel from "./EditorPanel";
import Resizer from "./Resizer";
import { useCustomizeForm } from "./useCustomizeForm";

const Customize = () => {
  // --- 1. Core State ---
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { template } = useParams();
  const { portfolioData, setPortfolioData } = usePortfolio();
  const isLoadedRef = useRef(false);

  // UI State
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [viewMode, setViewMode] = useState("dual"); 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Panel & Layout State
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);

  // Theme Colors
  const [themeBg, setThemeBg] = useState("#000000");
  const [themeFont, setThemeFont] = useState("#FFFFFF");

  // --- 2. Custom Hook for Form Logic ---
  const formLogic = useCustomizeForm(portfolioData, setPortfolioData);

  // --- 3. Data Loading (CRITICAL FIX HERE) ---
  useEffect(() => {
    async function load() {
      // 1. PRIORITY: Check if data was passed from Wizard/Create Page via Navigation State
      // If yes, we overwrite whatever is in context immediately.
      if (location.state && location.state.portfolioData) {
        console.log("📥 Loading fresh data from Wizard:", location.state.portfolioData);
        setPortfolioData(location.state.portfolioData);
        
        // Update local theme state
        if (location.state.portfolioData.themeBg) setThemeBg(location.state.portfolioData.themeBg);
        if (location.state.portfolioData.themeFont) setThemeFont(location.state.portfolioData.themeFont);
        
        isLoadedRef.current = true;
        
        // Optional: Clear state so a refresh doesn't reload this specific state if you don't want it to
        // window.history.replaceState({}, document.title);
        return;
      }

      // 2. SECONDARY: If no new data, check if Context already has data
      if (portfolioData && portfolioData._id) {
        isLoadedRef.current = true;
        // Sync local theme state with context
        if (portfolioData.themeBg) setThemeBg(portfolioData.themeBg);
        if (portfolioData.themeFont) setThemeFont(portfolioData.themeFont);
        return;
      }

      // 3. FALLBACK: Fetch from API using ID or LocalStorage
      try {
        let restored = {};
        const savedLocal = localStorage.getItem("portfolioData");
        
        if (savedLocal) {
            restored = JSON.parse(savedLocal);
        }

        // If ID exists in local storage or we can derive it, fetch fresh
        if (restored._id) {
          const fresh = await getPortfolio(restored._id);
          if (fresh) restored = { ...fresh };
        }

        if (!restored.template) {
          restored.template = template || "modern";
        }

        setPortfolioData(restored);
        isLoadedRef.current = true;
        if (restored.themeBg) setThemeBg(restored.themeBg);
        if (restored.themeFont) setThemeFont(restored.themeFont);
      } catch (err) {
        console.error("Load failed", err);
      }
    }
    load();
    // Add location.state to dependency array to trigger re-run when navigation sends new data
  }, [location.state, template, setPortfolioData]); 

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 4. Drag & Layout Logic ---
  const togglePanel = () => {
    if (isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setLeftPanelWidth(30);
      setIsPanelOpen(true);
    }
  };

  const startDragging = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const stopDragging = () => setIsDragging(false);

  const handleDragging = (e) => {
    if (!isDragging) return;
    const container = document.querySelector(".customize-container-inner");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newWidth > 15 && newWidth < 70) setLeftPanelWidth(newWidth);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragging);
      window.addEventListener("mouseup", stopDragging);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("mouseup", stopDragging);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
    return () => {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("mouseup", stopDragging);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDragging]);

  // --- 5. Action Handlers ---
  const handleGenerateBio = () => {
    if (!portfolioData) return;
    const { name, role, education, experience, skills, projects } = portfolioData;

    const skillList = Array.isArray(skills) 
      ? skills.map((s) => (typeof s === "string" ? s : s.name)).join(", ") 
      : "";

    const projectList = Array.isArray(projects) 
      ? projects.map((p) => p.title).join(", ") 
      : "";

    let experienceText = "professional experience";
    if (Array.isArray(experience) && experience.length > 0) {
      const companies = experience.map(e => e.company).filter(Boolean).join(", ");
      experienceText = `a professional background at ${companies}`;
    }

    const autoBio = `I'm ${name || "a Creator"}, working as ${role || "a Developer"} with ${experienceText}. I hold a degree in ${education || "Tech"} and specialize in ${skillList}. I've worked on projects like ${projectList}, focusing on innovation.`.trim();

    setPortfolioData({ ...portfolioData, bio: autoBio });
    setMessage("✨ Bio generated successfully!");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleSave = async () => {
    try {
      const saved = await saveOrUpdatePortfolio(portfolioData);
      setPortfolioData(saved);
      setMessage("✅ Portfolio saved successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save portfolio.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handlePreview = async () => {
    try {
      const saved = await saveOrUpdatePortfolio(portfolioData);
      setPortfolioData(saved);
      setMessage("🚀 Portfolio saved! Redirecting...");
      setTimeout(() => navigate(`/portfolio/${saved._id}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to preview portfolio.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // --- 6. Layout Width Calculation ---
  let editorWidth = "0%";
  let isEditorVisible = false;

  if (showPreviewMobile) {
    editorWidth = "0%";
    isEditorVisible = false;
  } else if (windowWidth < 768) {
    editorWidth = "100%";
    isEditorVisible = true;
  } else if (viewMode === "mobile") {
    editorWidth = isPanelOpen ? "30%" : "0%";
    isEditorVisible = isPanelOpen;
  } else if (viewMode === "desktop") {
     editorWidth = "0%"; 
     isEditorVisible = false;
  } else {
    editorWidth = isPanelOpen ? `${leftPanelWidth}%` : "0px";
    isEditorVisible = isPanelOpen;
  }

  const isMobileSim = viewMode === "mobile";

  // Prevent crash if data isn't loaded yet
  if (!portfolioData) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading Data...</div>;

  return (
<div className="flex flex-col min-h-screen bg-white text-white customize-container relative overflow-x-hidden overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex-none sticky top-0 z-[60] bg-white">
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

      {/* Mobile Toggle */}
      <div className="md:hidden flex-none flex justify-between items-center p-4 bg-[#111] border-b border-gray-800 z-40 sticky top-[60px]">
        <button
          type="button" // ✅ FIX: Added type="button"
          onClick={() => setShowPreviewMobile(false)}
          className={`px-5 py-2 rounded-full font-bold text-xs transition-all ${!showPreviewMobile ? "bg-white text-black" : "bg-[#222] text-gray-400"}`}
        >
          Editor
        </button>
        <button
          type="button" // ✅ FIX: Added type="button"
          onClick={() => setShowPreviewMobile(true)}
          className={`px-5 py-2 rounded-full font-bold text-xs transition-all ${showPreviewMobile ? "bg-purple-600 text-white" : "bg-[#222] text-gray-400"}`}
        >
          Preview
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 relative w-full items-stretch customize-container-inner">
        
        {/* Left Sidebar (Icons) */}
        {!showPreviewMobile && viewMode !== "desktop" && (
          <div className="sticky top-[60px] h-[calc(100vh-60px)] z-30"> 
             <Sidebar
               isPanelOpen={isPanelOpen}
               togglePanel={togglePanel}
               onOpenThemes={() => setShowThemeModal(true)}
               onSave={handleSave}
               onPreview={handlePreview}
             />
          </div>
        )}

        {/* EDITOR PANEL */}
        <div 
            className={`transition-all duration-300 ${!showPreviewMobile && viewMode !== "desktop" ? 'md:ml-[60px]' : ''}`} 
            style={{ width: editorWidth, minHeight: '80vh' }}
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

        {/* Drag Handle */}
        {viewMode === "dual" && isPanelOpen && !showPreviewMobile && (
          <Resizer onMouseDown={startDragging} isDragging={isDragging} />
        )}

        {/* === RIGHT PREVIEW PANEL === */}
        <div className={`flex-1 min-h-screen relative ${showPreviewMobile ? "block w-full bg-white" : "hidden"} md:block`}>
          <div className={`h-full w-full transition-colors duration-300 ${isMobileSim ? 'bg-gray-100/90 py-10' : 'bg-white'}`}>
              {isDragging && <div className="absolute inset-0 bg-transparent z-50"></div>}
              <div 
                className={`
                    transition-all duration-500 ease-in-out mx-auto bg-white overflow-hidden relative
                    ${isMobileSim 
                        ? "w-[375px] h-[812px] rounded-[40px] border-[12px] border-black shadow-2xl overflow-y-auto no-scrollbar" 
                        : "w-full h-full border-none rounded-none"
                    }
                `}
              >
                  {isMobileSim && (
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-50 pointer-events-none"></div>
                  )}
                  <RightPanel portfolioData={portfolioData} />
              </div>
          </div>
        </div>
      </div>

      {/* Footer / Studio Text */}
      {!isMobileSim && (!showPreviewMobile || windowWidth >= 768) && (
          <div className="relative w-full bg-black mt-40 pt-20 border-t border-white/5 z-30 pb-10">
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-gray-500 mb-4 px-4 text-center">
                <span>Designed & Built by <span className="text-white"><img className="w-20 sm:w-40 absolute" src="/logow.png" alt="logo"/></span></span>
            </div>
            <div className="w-full overflow-hidden leading-none select-none pointer-events-none flex justify-center">
                <h1 
                  className="text-[35vw] font-black text-white text-center transform origin-bottom"
                  style={{ fontFamily: 'Switzer, sans-serif' }}
                >
                    Studio
                </h1>
            </div>
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-[10px] md:text-xs tracking-tighter">
                    FY<span className="text-purple-600">X</span>
                </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default Customize;