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
    /*
      The parent in Customize.jsx already controls width with a transition wrapper.
      This component just fills 100% of that wrapper.

      Critical rules:
      - overflow: hidden on the outer shell — nothing bleeds out
      - flex flex-col so the scroll area can take flex-1 min-h-0
      - The scroll div gets overflow-y-auto and min-h-0 (without min-h-0,
        flex children don't shrink and the div grows past its container)
    */
    <div
      style={{
        width: "100%",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: isDragging ? "none" : "opacity 0.2s ease",
      }}
      className="flex flex-col bg-white border-l border-gray-100 z-30 h-full overflow-hidden shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.04)]"
    >
      {/* ── Sticky header ── */}
      <div className="flex-none flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-[13px] min-w-0">
          <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <LayoutTemplate size={13} className="text-violet-600" />
          </span>
          <span className="truncate">Editor</span>
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all flex items-center justify-center shrink-0 ml-2"
          aria-label="Close editor"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
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
          themeBg={themeBg}
          setThemeBg={setThemeBg}
          themeFont={themeFont}
          setThemeFont={setThemeFont}
        />
      </div>
    </div>
  );
};

export default EditorPanel;