import React, { useState } from "react";
import { 
  Settings2, Palette, PaintBucket, Save, Rocket, RotateCcw, 
  AlertCircle, Briefcase, Globe, Lock
} from "lucide-react"; 
import { usePortfolio } from "../../../../context/PortfolioContext"; 
import { useAuth } from "../../../../context/AuthContext"; 
import UpgradePopup from "../../../../components/UpgradePopup"; 
import TalentVisibilityPopup from "../TalentVisibilityPopup"; 
import { saveOrUpdatePortfolio } from "../../../../api/portfolioAPI"; 
import { TEMPLATE_LIST } from "../../Templates"; 

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

// === Sidebar Item (Minimalist & Light) ===
const SidebarItem = ({ icon: Icon, label, onClick, active, color = "hover:bg-gray-50", className="" }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center gap-1.5 w-[50px] py-2 rounded-lg transition-all duration-200 ease-out
        ${active 
          ? "bg-black text-white shadow-sm" 
          : `text-gray-400 ${color} hover:text-gray-900`}
        ${className}
      `}
    >
      <Icon size={18} strokeWidth={1.5} className={`transition-transform duration-200 ${active ? "scale-100" : "group-hover:scale-110"}`} />
      <span className={`text-[9px] font-medium tracking-wide leading-none ${active ? "text-gray-200" : "text-gray-400 group-hover:text-gray-800"}`}>
        {label}
      </span>
    </button>
  );
};

// === MAIN COMPONENT ===
const Sidebar = ({ isPanelOpen, togglePanel, onOpenThemes, onSave, onPreview }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();
  
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTalentPopup, setShowTalentPopup] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("premium_template");
  const [premiumToast, setPremiumToast] = useState(null); 

  const isFreeUser = (user?.plan || 'free') === 'free';

  // --- Logic Helpers ---
  const handleRestrictedAction = (action) => {
    if (isFreeUser) {
        if (PREMIUM_TEMPLATES.includes(portfolioData.template)) {
            setUpgradeReason("premium_template"); setShowUpgrade(true); return;
        }
        if (portfolioData.themeBg !== "#000000" && portfolioData.themeBg !== "#ffffff") {
             setUpgradeReason("premium_feature"); setShowUpgrade(true); return;
        }
        if (portfolioData.enableChatbot) {
            setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return;
        }
    }
    action();
  };

  const handleColorChange = (key, value) => {
    setPortfolioData((prev) => ({ ...prev, [key]: value }));
    if (isFreeUser && value !== "#000000" && value !== "#ffffff") {
        setPremiumToast("Premium Feature Active"); setTimeout(() => setPremiumToast(null), 3000);
    }
  };

  const resetColors = () => {
    const currentTemplateId = portfolioData.template || "modern";
    const templateConfig = TEMPLATE_LIST[currentTemplateId] || {};
    const defaultBg = templateConfig.themeBg || "#000000";
    const defaultFont = templateConfig.themeFont || "#ffffff";

    setPortfolioData((prev) => ({ 
        ...prev, 
        themeBg: defaultBg, 
        themeFont: defaultFont 
    }));
    setPremiumToast("Colors Reset");
    setTimeout(() => setPremiumToast(null), 2000);
  };

  const toggleVisibility = async () => {
      const newStatus = !portfolioData.isPublic;
      setPortfolioData(prev => ({ ...prev, isPublic: newStatus }));
      try { await saveOrUpdatePortfolio({ ...portfolioData, isPublic: newStatus }); } catch(e) { console.error(e); }
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
    
    {premiumToast && (
        <div className="fixed bottom-20 left-4 bg-gray-900/90 backdrop-blur text-white text-[10px] font-medium px-3 py-2 rounded-lg shadow-xl z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle size={12} className="text-[#D4AF37]" /> {premiumToast}
        </div>
    )}

    {/* === SIDEBAR CONTAINER === */}
    {/* FIXED: 
        1. 'md:top-16' added to push sidebar down below the header (approx 64px). 
        2. 'hidden md:flex' ensures it is hidden on mobile screens.
    */}
    <div className="hidden md:flex fixed  md:top-16 left-0 bottom-0 w-[64px] bg-white border-r border-gray-100 flex-col items-center py-4 gap-1 z-1000 shadow-[2px_0_15px_-5px_rgba(0,0,0,0.03)]">
      
      {/* 1. Editor Toggle */}
      <SidebarItem 
        icon={Settings2} 
        label="Editor" 
        onClick={togglePanel} 
        active={isPanelOpen} 
      />

      {/* 2. Templates */}
      <SidebarItem 
        icon={Palette} 
        label="Themes" 
        onClick={onOpenThemes} 
      />

      {/* 3. Colors (with popover) */}
      <div className="relative flex justify-center w-full">
        <SidebarItem 
          icon={PaintBucket} 
          label="Colors" 
          onClick={() => setShowColorPopup(!showColorPopup)} 
          active={showColorPopup} 
        />
        
        {/* Sleek Color Popover */}
        {showColorPopup && (
          <div className="absolute left-[54px] top-0 ml-2 w-48 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-3 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Style</span>
                <button onClick={resetColors} className="text-gray-300 hover:text-black transition-colors" title="Reset">
                    <RotateCcw size={12} />
                </button>
              </div>
              
              {/* Background Picker */}
              <div className="flex items-center justify-between group">
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-800">Background</span>
                <div className="relative w-5 h-5 rounded-full border border-gray-200 shadow-sm overflow-hidden hover:scale-110 transition-transform" style={{ backgroundColor: portfolioData?.themeBg || "#ffffff" }}>
                    <input type="color" value={portfolioData?.themeBg || "#ffffff"} onChange={(e) => handleColorChange("themeBg", e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>

              {/* Text Picker */}
              <div className="flex items-center justify-between group">
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-800">Text</span>
                <div className="relative w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden hover:scale-110 transition-transform flex items-center justify-center">
                    <span style={{ color: portfolioData?.themeFont || "#000000", fontWeight: 'bold', fontSize: '9px' }}>A</span>
                    <input type="color" value={portfolioData?.themeFont || "#000000"} onChange={(e) => handleColorChange("themeFont", e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>
          </div>
        )}
      </div>

      <div className="w-8 h-[1px] bg-gray-100 my-2"></div>

      {/* 4. Visibility Toggle */}
      <SidebarItem 
         icon={portfolioData?.isPublic ? Globe : Lock} 
         label={portfolioData?.isPublic ? "Public" : "Private"}
         onClick={toggleVisibility}
         active={portfolioData?.isPublic}
         className={portfolioData?.isPublic ? "!bg-blue-50 !text-blue-600 shadow-none" : ""}
      />

      {/* 5. Talent Settings */}
      <SidebarItem 
        icon={Briefcase} 
        label="Talent" 
        onClick={() => setShowTalentPopup(true)} 
      />

      <div className="flex-1"></div>

      {/* 6. Save */}
      <SidebarItem 
        icon={Save} 
        label="Save" 
        onClick={() => handleRestrictedAction(onSave)} 
        color="hover:bg-green-50 hover:text-green-600" 
      />

      {/* 7. Deploy */}
      <div className="pb-4 pt-1 w-full px-2">
        <button 
        
          onClick={() => handleRestrictedAction(onPreview)}
          className={`
            w-full py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
            ${PREMIUM_TEMPLATES.includes(portfolioData.template) 
              ? "bg-gradient-to-b from-[#D4AF37] to-[#B39028] text-white" 
              : "bg-gray-900 text-white"}
          `}
        >
            <Rocket size={16} strokeWidth={1.5}
            label="Deploy" 
             />
        </button>
      </div>

    </div>
    </>
  );
};

export default Sidebar;