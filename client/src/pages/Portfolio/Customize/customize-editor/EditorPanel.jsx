// src/pages/Customize/customize-editor/EditorPanel.jsx
import React from "react";
import { LayoutTemplate, X } from "lucide-react";
import LeftPanel from "../leftpanel/index"; // Adjust import path if needed

const EditorPanel = ({
  width,
  isVisible,
  isPanelOpen,
  onClose,
  isDragging,
  // Props passed to LeftPanel
  portfolioData, setPortfolioData,
  handleGenerateBio, handleSave, handlePreview,
  formLogic, // From our custom hook
  themeBg, setThemeBg,
  themeFont, setThemeFont
}) => {
  
  return (
    <div
      style={{
        width: width,
        transition: isDragging ? "none" : "width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none", // Prevents interaction when hidden
      }}
      className="flex flex-col bg-white border-r border-gray-200  z-30 min-h-0 h-full"
    >
      {/* Header */}
      <div className="flex-none flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <LayoutTemplate size={18} className="text-purple-600" />
          Editor
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content - The Fix for Freezing */}
      <div className="flex-1  overscroll-contain touch-pan-y scroll-smooth relative">
        <LeftPanel
          width={width}
          portfolioData={portfolioData}
          setPortfolioData={setPortfolioData}
          handleChange={formLogic.handleChange}
          handleGenerateBio={handleGenerateBio}
          handleSave={handleSave}
          handlePreview={handlePreview}
          {...formLogic} // Spreads all skills/project handlers
          themeBg={themeBg} setThemeBg={setThemeBg}
          themeFont={themeFont} setThemeFont={setThemeFont}
        />
      </div>
    </div>
  );
};

export default EditorPanel;