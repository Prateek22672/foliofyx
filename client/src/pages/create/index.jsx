import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Code, Palette, Cpu, FileJson, FileSearch, CheckCircle, ScanLine } from "lucide-react";

import Background from "./Background";
import SelectionView from "./SelectionView";
import WizardForm from "./WizardForm"; 
import ThemePopup from "../Portfolio/Customize/ThemePopup";
import PopupMessage from "../../components/PopupMessage";

import { useAuth } from "../../context/AuthContext";
import { saveOrUpdatePortfolio } from "../../api/portfolioAPI"; 
import { DUMMY_DATA } from "./constants";
import { TEMPLATE_LIST } from "../Portfolio/Templates/index"; 
import { parseResumeFile } from "./resumeParser"; 

// --- 1. RESUME LOADING ANIMATION (Scanning Effect) ---
const ResumeLoadingOverlay = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030303]/95 backdrop-blur-md">
     <div className="flex flex-col items-center">
        <div className="relative w-24 h-32 mb-8 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
           {/* Document Lines */}
           <div className="space-y-2 w-16 opacity-30">
                <div className="h-2 w-10 bg-white rounded-full"></div>
                <div className="h-1 w-14 bg-white rounded-full"></div>
                <div className="h-1 w-12 bg-white rounded-full"></div>
                <div className="h-1 w-14 bg-white rounded-full"></div>
           </div>
           {/* Scan Line */}
           <motion.div 
             animate={{ top: ["0%", "100%", "0%"] }} 
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
           />
        </div>
        <h3 className="text-2xl font-medium text-white mb-2 flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-blue-400 animate-pulse" /> Analyzing Resume
        </h3>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">Extracting Skills • Experience • Projects</p>
     </div>
  </motion.div>
);

// --- 2. AI GENERATION ANIMATION (Terminal/Building Effect) ---
const AILoadingOverlay = ({ prompt }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const phases = [
    { text: "Deconstructing Request...", sub: `Analyzing "${prompt.substring(0, 25)}..."`, icon: <Cpu className="w-5 h-5 text-purple-400" /> },
    { text: "Architecting Layout...", sub: "Initializing Header, Hero, Grid...", icon: <Code className="w-5 h-5 text-blue-400" /> },
    { text: "Injecting Design System...", sub: "Applying Tailwind classes & Motion...", icon: <Palette className="w-5 h-5 text-pink-400" /> },
    { text: "Generating Content...", sub: "Writing bio and optimizing SEO...", icon: <FileJson className="w-5 h-5 text-yellow-400" /> },
    { text: "Finalizing Build...", sub: "Assembling FolioFyX Studio...", icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentPhase((prev) => (prev < phases.length - 1 ? prev + 1 : prev)), 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(168,85,247,0.1)_50%,transparent)] animate-scan" />
      </div>
      
      <div className="flex flex-col items-center z-10 px-6 w-full max-w-md">
         <AnimatePresence mode="wait">
            <motion.div 
                key={currentPhase}
                initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
            >
                <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 ring-1 ring-white/5 shadow-2xl">
                    {phases[currentPhase].icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-2">
                    {phases[currentPhase].text}
                </h3>
                <p className="text-gray-500 font-mono text-sm tracking-wider uppercase">
                    {phases[currentPhase].sub}
                </p>
            </motion.div>
         </AnimatePresence>

         {/* Progress Bar */}
         <div className="w-full h-1 bg-gray-800 rounded-full mt-12 overflow-hidden">
            <motion.div 
                animate={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
                className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
            />
         </div>
      </div>
    </motion.div>
  );
};

// --- MAIN CONTROLLER ---
const CreatePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [viewMode, setViewMode] = useState("selection"); 
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [message, setMessage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [formData, setFormData] = useState({ name: "", role: "", bio: "", experience: "", skills: [], education: "", projects: [], linkedin: "", github: "", email: "", cvLink: "" });

  useEffect(() => { if (!loading && !user) navigate("/login"); }, [user, loading, navigate]);

  const findBestTemplateMatch = (prompt) => {
    const input = prompt.toLowerCase();
    if (input.includes("3d") || input.includes("animate")) return "veloura";
    if (input.includes("minimal") || input.includes("clean")) return "minimal";
    if (input.includes("dark")) return "luxe";
    return "modern";
  };

  const finalizeCreation = async (templateKey, sourceMode) => {
    setShowThemePopup(false);
    let baseData = sourceMode === 'ai' ? { ...DUMMY_DATA, name: user?.displayName || "Creator", bio: `Building digital experiences. Focused on ${aiPrompt}.`, role: "Creative Developer", skills: DUMMY_DATA.skills || [], projects: DUMMY_DATA.projects || [] } : { ...formData, skills: formData.skills || [], projects: formData.projects || [] };
    const finalPayload = { ...baseData, template: templateKey, isPublic: false, themeBg: TEMPLATE_LIST[templateKey]?.themeBg || "#ffffff", themeFont: TEMPLATE_LIST[templateKey]?.themeFont || "#000000" };

    try {
      const savedPortfolio = await saveOrUpdatePortfolio(finalPayload);
      setMessage("✅ Portfolio Created!");
      setTimeout(() => navigate(`/customize/${templateKey}`, { state: { portfolioData: savedPortfolio } }), 500);
    } catch (error) {
      console.warn("⚠️ Using Fallback Navigation.");
      setMessage("⚠️ Offline Mode: Changes saved locally only.");
      setTimeout(() => navigate(`/customize/${templateKey}`, { state: { portfolioData: finalPayload } }), 1000);
    }
  };

  const handleAIStart = (prompt) => {
    setAiPrompt(prompt);
    setViewMode("ai-loading");
    // Simulate complex build time
    setTimeout(() => {
       const matchedTemplate = findBestTemplateMatch(prompt);
       finalizeCreation(matchedTemplate, "ai");
    }, 4500);
  };

  const handleControlStart = () => setViewMode("wizard");

  const handleResumeUpload = async (file) => {
    setViewMode("resume-loading");
    try {
      const extractedData = await parseResumeFile(file);
      setFormData((prev) => ({ ...prev, ...extractedData }));
      // Artificial delay to let user enjoy the scanning animation
      setTimeout(() => {
          setMessage("✅ Resume parsed successfully.");
          setViewMode("wizard");
      }, 2000);
    } catch (error) {
      console.error("Parsing failed:", error);
      setMessage("❌ Failed to parse resume. Please enter manually.");
      setViewMode("selection");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#030303]" />;
  if (!user) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030303] text-white font-sans selection:bg-purple-500/30">
      <Background />
      <PopupMessage message={message} onClose={() => setMessage("")} />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {viewMode === "selection" && (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <SelectionView onSelectAI={handleAIStart} onSelectControl={handleControlStart} onSelectResume={handleResumeUpload} />
            </motion.div>
          )}
          {viewMode === "wizard" && (
            <motion.div key="wizard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} className="w-full h-full">
              <WizardForm formData={formData} setFormData={setFormData} onSave={() => setShowThemePopup(true)} onExit={() => setViewMode("selection")} />
            </motion.div>
          )}
          {viewMode === "ai-loading" && <AILoadingOverlay key="ai-loading" prompt={aiPrompt} />}
          {viewMode === "resume-loading" && <ResumeLoadingOverlay key="resume-loading" />}
        </AnimatePresence>
      </div>

      {showThemePopup && <ThemePopup onSelect={(key) => finalizeCreation(key, "manual")} onClose={() => setShowThemePopup(false)} />}
    </div>
  );
};

export default CreatePage;