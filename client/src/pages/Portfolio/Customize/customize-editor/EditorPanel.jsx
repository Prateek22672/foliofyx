// src/pages/Customize/customize-editor/EditorPanel.jsx
import React from "react";
import { LayoutTemplate, X } from "lucide-react";
import LeftPanel from "../leftpanel/index";
import CustomEditorPanel from "../../../Customize/customize-editor/custom/CustomEditorPanel";

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
  customSelectedId,        // ← was missing from destructuring — that caused the crash
}) => {
  const isCustomTemplate = portfolioData?.template === "custom";

  return (
    <div
      style={{
        width: "100%",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: isDragging ? "none" : "opacity 0.2s ease",
      }}
      className="flex flex-col bg-[#0f0f0f] border-l border-white/10 z-30 h-full overflow-hidden"
    >
      {/* Sticky header */}
      <div className="flex-none flex justify-between items-center px-4 py-3 border-b border-white/10 bg-[#141414]">
        <h3 className="font-semibold text-neutral-200 flex items-center gap-2 text-[13px] min-w-0">
          <span className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center shrink-0">
            <LayoutTemplate size={13} className="text-violet-400" />
          </span>
          <span className="truncate">
            {isCustomTemplate ? "Custom Builder" : "Editor"}
          </span>
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-md hover:bg-white/10 text-neutral-500 hover:text-white transition-all flex items-center justify-center shrink-0 ml-2"
          aria-label="Close editor"
          title="Close editor"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto overscroll-contain ${isCustomTemplate ? "" : "bg-white"}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isCustomTemplate ? (
          <CustomEditorPanel selectedId={customSelectedId} />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
