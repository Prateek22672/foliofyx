// src/pages/Customize/customize-editor/Sidebar.jsx
import React, { useState } from "react";
import { 
  Settings2, Palette, PaintBucket, Save, Rocket, RotateCcw, 
  AlertCircle, Briefcase, Globe, Lock, LayoutTemplate, Type
} from "lucide-react"; 
import { usePortfolio } from "../../../../context/PortfolioContext"; 
import { useAuth } from "../../../../context/AuthContext"; 
import UpgradePopup from "../../../../components/UpgradePopup"; 
import TalentVisibilityPopup from "../TalentVisibilityPopup"; 
import { saveOrUpdatePortfolio } from "../../../../api/portfolioAPI"; 
import { TEMPLATE_LIST } from "../../Templates"; 

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

const FONT_OPTIONS = [
  { label: 'Switzer', value: 'Switzer, sans-serif', type: 'Default' },
  { label: 'Inter', value: '"Inter", sans-serif', type: 'Clean' },
  { label: 'Playfair', value: '"Playfair Display", serif', type: 'Serif' },
  { label: 'Space', value: '"Space Grotesk", sans-serif', type: 'Tech' },
  { label: 'Outfit', value: '"Outfit", sans-serif', type: 'Modern' },
  { label: 'Oswald', value: '"Oswald", sans-serif', type: 'Bold' },
  { label: 'Fira Code', value: '"Fira Code", monospace', type: 'Code' },
  { label: 'Syne', value: '"Syne", sans-serif', type: 'Artistic' }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, onClick, active, color = "hover:bg-gray-50 hover:text-gray-900", className="" }) => {
  return (
    <button 
      type="button" // ✅ FIX: Prevents form submission/reload
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center gap-[6px] w-[56px] py-3 rounded-xl transition-all duration-200
        ${active ? "bg-black text-white shadow-md transform scale-105" : `text-gray-400 ${color}`}
        ${className}
      `}
    >
      <Icon size={20} strokeWidth={active ? 2 : 1.5} className={`transition-transform duration-200 ${active ? "scale-100" : "group-hover:scale-110"}`} />
      <span className={`text-[9px] font-medium tracking-wide leading-none ${active ? "text-gray-100" : "text-gray-500 group-hover:text-gray-800"}`}>
        {label}
      </span>
    </button>
  );
};

const SectionLabel = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={12} className="text-gray-400" />}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
);

// --- Main Sidebar ---

const Sidebar = ({ isPanelOpen, togglePanel, onOpenThemes, onSave, onPreview }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();
  
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTalentPopup, setShowTalentPopup] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("premium_template");
  const [premiumToast, setPremiumToast] = useState(null); 

  const isFreeUser = (user?.plan || 'free') === 'free';

  const handleRestrictedAction = (action) => {
    if (isFreeUser) {
        if (PREMIUM_TEMPLATES.includes(portfolioData.template)) { setUpgradeReason("premium_template"); setShowUpgrade(true); return; }
        if (portfolioData.themeBg !== "#000000" && portfolioData.themeBg !== "#ffffff") { setUpgradeReason("premium_feature"); setShowUpgrade(true); return; }
        if (portfolioData.enableChatbot) { setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return; }
    }
    action();
  };

  const handleColorChange = (key, value) => {
    setPortfolioData((prev) => ({ ...prev, [key]: value }));
    if (isFreeUser && value !== "#000000" && value !== "#ffffff") {
        setPremiumToast("Premium Feature Active"); setTimeout(() => setPremiumToast(null), 3000);
    }
  };

  const handleFontChange = (fontValue) => {
    setPortfolioData((prev) => ({ ...prev, themeFontFamily: fontValue }));
  };

  const resetColors = () => {
    const currentTemplateId = portfolioData.template || "modern";
    const templateConfig = TEMPLATE_LIST[currentTemplateId] || {};
    setPortfolioData((prev) => ({ 
        ...prev, 
        themeBg: templateConfig.themeBg || "#000000", 
        themeFont: templateConfig.themeFont || "#ffffff",
        themeFontFamily: "Switzer, sans-serif"
    }));
    setPremiumToast("Style Reset"); setTimeout(() => setPremiumToast(null), 2000);
  };

  const toggleVisibility = async () => {
      const newStatus = !portfolioData.isPublic;
      setPortfolioData(prev => ({ ...prev, isPublic: newStatus }));
      try { await saveOrUpdatePortfolio({ ...portfolioData, isPublic: newStatus }); } catch(e) { console.error(e); }
  };

  return (
    <>
    <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason={upgradeReason} />
    {showTalentPopup && <TalentVisibilityPopup isOpen={showTalentPopup} onClose={() => setShowTalentPopup(false)} portfolioData={portfolioData} setPortfolioData={setPortfolioData} />}
    
    {premiumToast && (
        <div className="fixed bottom-24 left-20 bg-gray-900 text-white text-[11px] font-medium px-4 py-2 rounded-full shadow-2xl z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
            <AlertCircle size={14} className="text-[#D4AF37]" /> {premiumToast}
        </div>
    )}

    {/* --- SIDEBAR CONTAINER --- */}
    <div className="hidden md:flex fixed md:top-16 left-0 bottom-0 w-[72px] bg-white border-r border-gray-100 z-[1000] flex-col items-center py-4 gap-2 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
      
      {/* 1. Main Tools */}
      <SidebarItem icon={Settings2} label="Editor" onClick={togglePanel} active={isPanelOpen} />

      {/* 2. Design Button -> Opens Styles Panel */}
      <div className="relative">
        <SidebarItem 
            icon={PaintBucket} 
            label="Design" 
            onClick={() => setShowStylePanel(!showStylePanel)} 
            active={showStylePanel} 
        />

        {/* --- FLOATING STYLE PANEL --- */}
        {showStylePanel && (
          <div className="absolute left-[60px] top-[-20px] ml-4 w-[280px] bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col gap-6 z-50 animate-in fade-in zoom-in-95 duration-200 slide-in-from-left-4">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[12px] font-semibold text-gray-900">Site Design</span>
                <button type="button" onClick={resetColors} className="text-gray-400 hover:text-black transition-colors" title="Reset Default"><RotateCcw size={12} /></button>
              </div>
              
              {/* Colors */}
              <div>
                  <SectionLabel icon={Palette} label="Color Palette" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors shadow-sm group">
                        <span className="text-[11px] font-medium text-gray-500">Backdrop</span>
                        <div className="relative w-6 h-6 rounded-full border border-gray-200 shadow-inner overflow-hidden" style={{ backgroundColor: portfolioData?.themeBg || "#ffffff" }}>
                            <input type="color" value={portfolioData?.themeBg || "#ffffff"} onChange={(e) => handleColorChange("themeBg", e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors shadow-sm group">
                        <span className="text-[11px] font-medium text-gray-500">Text</span>
                        <div className="relative w-6 h-6 rounded-full bg-white border border-gray-200 shadow-inner overflow-hidden flex items-center justify-center">
                            <span style={{ color: portfolioData?.themeFont || "#000000", fontWeight: 'bold', fontSize: '10px' }}>Aa</span>
                            <input type="color" value={portfolioData?.themeFont || "#000000"} onChange={(e) => handleColorChange("themeFont", e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                        </div>
                    </div>
                  </div>
              </div>

              {/* Typography */}
              <div>
                  <SectionLabel icon={Type} label="Typography" />
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                       {FONT_OPTIONS.map((font) => (
                           <button
                              type="button"
                              key={font.label}
                              onClick={() => handleFontChange(font.value)}
                              className={`
                                  px-3 py-2 rounded-lg text-left border transition-all duration-200 text-[11px]
                                  ${portfolioData?.themeFontFamily === font.value 
                                      ? "border-black bg-black text-white shadow-md" 
                                      : "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 text-gray-600"}
                              `}
                           >
                               <span className="block leading-none font-medium mb-0.5" style={{ fontFamily: font.value }}>{font.label}</span>
                               <span className={`text-[8px] ${portfolioData?.themeFontFamily === font.value ? "text-gray-400" : "text-gray-400"}`}>{font.type}</span>
                           </button>
                       ))}
                  </div>
              </div>
          </div>
        )}
      </div>

      {/* 3. NEW: Templates Button (Dedicated) */}
      <SidebarItem 
        icon={LayoutTemplate} 
        label="Templates" 
        onClick={onOpenThemes} 
      />

      <div className="w-8 h-[1px] bg-gray-100 my-1"></div>

      {/* 4. Visibility & Talent */}
      <SidebarItem 
        icon={portfolioData?.isPublic ? Globe : Lock} 
        label={portfolioData?.isPublic ? "Public" : "Private"} 
        onClick={toggleVisibility} 
        active={portfolioData?.isPublic} 
        className={portfolioData?.isPublic ? "!text-blue-600" : ""} 
      />
      
      <SidebarItem icon={Briefcase} label="Talent" onClick={() => setShowTalentPopup(true)} />

      <div className="flex-1"></div>

      {/* 5. Footer Actions */}
      <SidebarItem icon={Save} label="Save" onClick={() => handleRestrictedAction(onSave)} color="hover:bg-green-50 hover:text-green-600" />
      
      <div className="pb-2 pt-1 w-full px-2">
        <button 
            type="button"
            onClick={() => handleRestrictedAction(onPreview)} 
            className={`
                w-full py-3 rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
                ${PREMIUM_TEMPLATES.includes(portfolioData.template) 
                    ? "bg-gradient-to-b from-[#D4AF37] to-[#B39028] text-white" 
                    : "bg-gray-900 text-white"}
            `}
        >
            <Rocket size={16} strokeWidth={1.5} />
            <span className="text-[9px] font-bold tracking-wider leading-none">DEPLOY</span>
        </button>
      </div>

    </div>
    </>
  );
};

export default Sidebar;