// src/pages/Customize/customize-editor/EditorPanel.jsx
import React from "react";
import { LayoutTemplate, X } from "lucide-react";
import LeftPanel from "../leftpanel/index";

const EditorPanel = ({
  width,
  isVisible,
  isPanelOpen,
  onClose,
  isDragging,
  portfolioData, setPortfolioData,
  handleGenerateBio, handleSave, handlePreview,
  formLogic,
  themeBg, setThemeBg,
  themeFont, setThemeFont,
}) => {
  return (
    <div
      style={{
        width: width,
        transition: isDragging ? "none" : "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        willChange: "width",
      }}
      className="flex flex-col bg-white border-l border-gray-100 z-30 min-h-0 h-full shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.04)]"
    >
      {/* ── Header ── */}
      <div className="flex-none flex justify-between items-center px-5 py-3.5 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-[13px]">
          <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <LayoutTemplate size={13} className="text-violet-600" />
          </span>
          Editor
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all flex items-center justify-center"
          aria-label="Close editor"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain touch-pan-y"
        style={{ scrollBehavior: "smooth" }}
      >
        <LeftPanel
          width={width}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          handleChange={formLogic.handleChange}
          handleGenerateBio={handleGenerateBio}
          handleSave={handleSave}
          handlePreview={handlePreview}
          {...formLogic}
          themeBg={themeBg} setThemeBg={setThemeBg}
          themeFont={themeFont} setThemeFont={setThemeFont}
        />
      </div>
    </div>
  );
};

export default EditorPanel;