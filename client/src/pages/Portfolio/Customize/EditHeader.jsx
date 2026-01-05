import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePortfolio } from "../../../context/PortfolioContext";
import { saveOrUpdatePortfolio } from "../../../api/portfolioAPI";
import { useAuth } from "../../../context/AuthContext";
import UserProfileMenu from "../../../components/UserProfileMenu";
import { 
  Monitor, Columns2, Smartphone, Menu, X, Palette, Plus, Save, Rocket, 
  Crown, QrCode, Globe, Lock, Loader2, Check, AlertCircle, Sparkles,
  User, RefreshCcw, PaintBucket
} from "lucide-react"; 
import { useSplash } from "../../../context/SplashContext";

// Popups
import ThemePopup from "./ThemePopup";
import ElementPopup from "./ElementPopup";
import ChatbotPromoPopup from "./ChatbotPromoPopup"; 
import UpgradePopup from "../../../components/UpgradePopup";
import TalentVisibilityPopup from "./TalentVisibilityPopup";
import FyxCardPopup from "./FyxCardPopup"; 
import DomainPopup from "./DomainPopup"; 

import { TEMPLATE_LIST } from "../Templates"; 

const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

// ✅ NEW: Plan Badge Component (Minimalist Outline)
const PlanBadge = ({ plan }) => {
  const isPro = plan === 'max';
  
  return (
    <div className={`
      flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase select-none border backdrop-blur-sm
      ${isPro 
        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5" 
        : "border-neutral-300 text-neutral-500"
      }
    `}>
      {isPro && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_5px_#D4AF37]" />} 
      {isPro ? "Max Active" : "Free Plan"}
    </div>
  );
};

const HeaderBtn = ({ icon: Icon, onClick, active, label, isPremium }) => (
  <div className="group relative flex items-center">
    <button 
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${active ? "bg-black/5 text-black" : "text-gray-500 hover:bg-black/5 hover:text-black"}`}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      {isPremium && <Crown size={10} className="absolute top-1 right-1 text-[#D4AF37] fill-[#D4AF37]" />}
    </button>
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
      {label}
    </span>
  </div>
);

function EditHeader({ setViewMode, viewMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSplash } = useSplash();
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [showElementPopup, setShowElementPopup] = useState(false);
  const [showTalentPopup, setShowTalentPopup] = useState(false);
  
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [showDomainPopup, setShowDomainPopup] = useState(false); 

  const [showAiPromo, setShowAiPromo] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("premium_template");

  const [saveStatus, setSaveStatus] = useState("idle"); 
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const isCustomizePage = location.pathname.includes("/customize");
  const isFreeUser = user?.plan === 'free';

  const checkRestrictions = () => {
    if (isFreeUser && PREMIUM_TEMPLATES.includes(portfolioData.template)) {
      setUpgradeReason("premium_template"); setShowUpgrade(true); return false;
    }
    const isCustomColor = (portfolioData.themeBg && portfolioData.themeBg !== "#000000" && portfolioData.themeBg !== "#ffffff");
    if (isFreeUser && isCustomColor) {
      setUpgradeReason("premium_feature"); setShowUpgrade(true); return false;
    }
    if (isFreeUser && portfolioData.enableChatbot) {
      setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return false;
    }
    return true;
  };

  const buildCleanData = () => ({
    ...portfolioData,
    template: portfolioData.template || "modern",
    skills: Array.isArray(portfolioData.skills) ? portfolioData.skills : [],
    projects: Array.isArray(portfolioData.projects) ? portfolioData.projects : [],
    enableChatbot: portfolioData.enableChatbot || false,
  });

  const handleSave = async () => {
    if (!checkRestrictions()) return; 
    setSaveStatus("saving"); 
    try {
      const cleanData = buildCleanData();
      const saved = await saveOrUpdatePortfolio(cleanData);
      setPortfolioData(saved);
      setSaveStatus("success");
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(timeString);
      setTimeout(() => setSaveStatus("idle"), 3000);
      setMenuOpen(false);
    } catch (err) { 
      console.error("Save Failed:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleDeployClick = async () => {
    if (!checkRestrictions()) return;
    setShowDomainPopup(true);
  };

  const onDomainSaved = (savedData) => {
      setPortfolioData(savedData);
      setShowDomainPopup(false);
      const targetId = savedData.username || savedData._id;
      showSplash(1200, () => navigate(`/portfolio/${targetId}`));
  };

  const toggleChatbot = async () => {
    if (portfolioData.enableChatbot) {
      const updatedData = { ...buildCleanData(), enableChatbot: false };
      setPortfolioData(updatedData); 
      try { await saveOrUpdatePortfolio(updatedData); } catch (err) {}
      return;
    }
    setShowAiPromo(true);
    setMenuOpen(false);
  };

  const handleConfirmEnableAi = async () => {
    setShowAiPromo(false);
    if (isFreeUser) { setUpgradeReason("ai_chatbot"); setShowUpgrade(true); return; }
    const updatedData = { ...buildCleanData(), enableChatbot: true };
    setPortfolioData(updatedData);
    try { await saveOrUpdatePortfolio(updatedData); showSplash(1000); } catch (err) {}
  };

  const toggleVisibility = async () => {
      const newStatus = !portfolioData.isPublic;
      setPortfolioData(prev => ({ ...prev, isPublic: newStatus }));
      try { await saveOrUpdatePortfolio({ ...portfolioData, isPublic: newStatus }); } catch(e) {}
  };

  const handleColorChange = (key, val) => {
      setPortfolioData(prev => ({ ...prev, [key]: val }));
  };

  const resetColors = () => {
      setPortfolioData(prev => ({ ...prev, themeBg: "#ffffff", themeFont: "#000000" }));
  };

  return (
    <>
      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason={upgradeReason} />

      {showCardPopup && <FyxCardPopup onClose={() => setShowCardPopup(false)} portfolioData={portfolioData} />}
      {showDomainPopup && <DomainPopup isOpen={showDomainPopup} onClose={() => setShowDomainPopup(false)} portfolioData={portfolioData} onSaveSuccess={onDomainSaved} />}

      <header className={`${isCustomizePage ? "relative" : "fixed top-0 left-0 z-50"} w-full h-16 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100 flex items-center justify-between px-6 transition-all`}>
        
        <div className="flex items-center">
          <img src="/studiox.svg" alt="Foliofy Logo" className="h-35 w-auto cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate("/")} />
        </div>

        {/* DESKTOP TOOLBAR */}
        <div className="hidden md:flex items-center justify-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
            <button onClick={toggleVisibility} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all mr-1 ${portfolioData.isPublic ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
               {portfolioData.isPublic ? <Globe size={14} /> : <Lock size={14} />}
               <span>{portfolioData.isPublic ? "Public" : "Private"}</span>
            </button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <HeaderBtn icon={Palette} label="Templates" onClick={() => setShowThemePopup(true)} />
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <HeaderBtn icon={Smartphone} label="Mobile View" active={viewMode === "mobile"} onClick={() => setViewMode("mobile")} />
            <HeaderBtn icon={Columns2} label="Split View" active={viewMode === "dual"} onClick={() => setViewMode("dual")} />
            <HeaderBtn icon={Monitor} label="Desktop View" active={viewMode === "desktop"} onClick={() => setViewMode("desktop")} />
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <HeaderBtn icon={QrCode} label="FYX Card" onClick={() => setShowCardPopup(true)} />
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <HeaderBtn icon={Plus} label="Add Element" onClick={() => setShowElementPopup(true)} />
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button onClick={toggleChatbot} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm border ${portfolioData.enableChatbot ? "bg-blue-600 text-white border-blue-500 shadow-blue-200 hover:bg-blue-700" : "bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-300"}`}>
              {!portfolioData.enableChatbot && user?.plan === 'free' && <Crown size={10} className="text-yellow-500 mr-[-4px]" />}
              {portfolioData.enableChatbot ? <Sparkles size={12} className="text-white fill-white" /> : <img src="/fyxlogow.png" alt="FYX" className="w-3.5 h-auto object-contain opacity-40 brightness-0" />}
              <div className={`w-[1px] h-3 ${portfolioData.enableChatbot ? "bg-white/30" : "bg-gray-200"}`}></div>
              <span className="tracking-wide">{portfolioData.enableChatbot ? "AI Active" : "Enable AI"}</span>
            </button>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end justify-center">
             <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
               <button onClick={handleSave} disabled={saveStatus === "saving"} className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${saveStatus === "error" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-black/5"}`}>
                  {saveStatus === "saving" && <Loader2 size={16} className="animate-spin text-gray-500" />}
                  {saveStatus === "success" && <Check size={16} className="text-green-600" />}
                  {saveStatus === "error" && <AlertCircle size={16} className="text-red-600" />}
                  {saveStatus === "idle" && <Save size={16} />}
                  <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved" : saveStatus === "error" ? "Failed" : "Save"}</span>
               </button>
               <button onClick={handleDeployClick} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all bg-black text-white hover:bg-gray-800 shadow-sm">
                  <Rocket size={14} /><span>Publish</span>{PREMIUM_TEMPLATES.includes(portfolioData.template) && <Crown size={10} className="text-[#D4AF37] fill-[#D4AF37] ml-1" />}
               </button>
             </div>
             {lastSavedTime && <span className="text-[9px] text-gray-400 font-medium mt-1 mr-1">Last saved {lastSavedTime}</span>}
          </div>
          
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* ✅ PLAN BADGE ADDED HERE */}
          <div className="hidden md:block">
             <PlanBadge plan={user?.plan} />
          </div>

          <div className="pl-2"><UserProfileMenu /></div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div className={`md:hidden fixed top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden z-40 ${menuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          
          {/* ✅ Mobile Plan Badge */}
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold text-gray-400">YOUR PLAN</span>
             <PlanBadge plan={user?.plan} />
          </div>

          {/* 1. View Modes */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setViewMode("mobile"); setMenuOpen(false); }} className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${viewMode === "mobile" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-500"}`}><Smartphone size={16} /> Mobile</button>
            <button onClick={() => { setViewMode("desktop"); setMenuOpen(false); }} className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${viewMode === "desktop" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-500"}`}><Monitor size={16} /> Desktop</button>
          </div>

          {/* 2. Visibility & Talent Page */}
          <div className="grid grid-cols-2 gap-3">
             <button onClick={toggleVisibility} className={`py-3 border rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${portfolioData.isPublic ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {portfolioData.isPublic ? <Globe size={16} /> : <Lock size={16} />}
                {portfolioData.isPublic ? "Public" : "Private"}
             </button>
             <button onClick={() => { setShowTalentPopup(true); setMenuOpen(false); }} className="py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                <User size={16} /> Talent Page
             </button>
          </div>

          {/* 3. Templates & FYX Card */}
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => { setShowThemePopup(true); setMenuOpen(false); }} className="py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                <Palette size={16} /> Templates
             </button>
             <button onClick={() => { setShowCardPopup(true); setMenuOpen(false); }} className="py-3 bg-black text-white border border-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                <QrCode size={16} /> FYX Card
             </button>
          </div>

          {/* 4. Color Controls */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PaintBucket size={14} className="text-gray-400"/>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Theme Colors</span>
                </div>
                <button onClick={resetColors} className="text-[10px] font-bold text-red-500 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                    <RefreshCcw size={10} /> Reset
                </button>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-400">Background</label>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <input type="color" value={portfolioData.themeBg || "#ffffff"} onChange={(e) => handleColorChange("themeBg", e.target.value)} className="w-8 h-8 rounded border-none p-0 cursor-pointer" />
                        <span className="text-[10px] font-mono text-gray-500">{portfolioData.themeBg || "#fff"}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-400">Text Color</label>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <input type="color" value={portfolioData.themeFont || "#000000"} onChange={(e) => handleColorChange("themeFont", e.target.value)} className="w-8 h-8 rounded border-none p-0 cursor-pointer" />
                        <span className="text-[10px] font-mono text-gray-500">{portfolioData.themeFont || "#000"}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* 5. AI Button */}
          <button
              onClick={toggleChatbot}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${
                portfolioData.enableChatbot 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
               {portfolioData.enableChatbot ? <Sparkles size={16} /> : <img src="/fyxlogow.png" alt="logo" className="w-4 h-4 opacity-40 brightness-0"/>}
               {portfolioData.enableChatbot ? "AI Assistant Active" : "Enable AI Assistant"}
          </button>
          
          {/* 6. Save & Publish */}
          <div className="flex gap-3 pt-2 mt-auto border-t border-gray-100">
            <button onClick={handleSave} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm">
                {saveStatus === "saving" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saveStatus === "saving" ? "Saving..." : "Save"}
            </button>
            <button onClick={handleDeployClick} className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-lg">
                <Rocket size={16} /> Publish
            </button>
          </div>
        </div>
      </div>

      {/* Popups Rendering */}
      {showThemePopup && <ThemePopup onSelect={(k) => { setPortfolioData({ ...portfolioData, template: k }); navigate(`/customize/${k}`); setShowThemePopup(false); }} onClose={() => setShowThemePopup(false)} />}
      {showElementPopup && <ElementPopup onClose={() => setShowElementPopup(false)} />}
      {showTalentPopup && <TalentVisibilityPopup isOpen={showTalentPopup} onClose={() => setShowTalentPopup(false)} portfolioData={portfolioData} setPortfolioData={setPortfolioData} />}
      {showAiPromo && <ChatbotPromoPopup onClose={() => setShowAiPromo(false)} onEnable={handleConfirmEnableAi} />}
    </>
  );
}

export default EditHeader;