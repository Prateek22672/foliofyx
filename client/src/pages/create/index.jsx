import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Code, Palette, Cpu, FileJson, ScanLine, AlertTriangle, RefreshCw } from "lucide-react";

import Background from "./Background";
import SelectionView from "./SelectionView";
import WizardForm from "./WizardForm";
import ThemePopup from "../Portfolio/Customize/ThemePopup";
import PopupMessage from "../../components/PopupMessage";
import ResumePreviewModal from "./ResumePreviewModal";

import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { saveOrUpdatePortfolio } from "../../api/portfolioAPI";
import { DUMMY_DATA } from "./constants";
import { TEMPLATE_LIST } from "../Portfolio/Templates/index";
import { parseResumeFile } from "./resumeParser";

// ─── LOADERS ─────────────────────────────────────────────────────────────────

const ResumeLoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030303]/95 backdrop-blur-md"
  >
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-32 mb-8 bg-white/5 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="space-y-2 w-16 opacity-30">
          <div className="h-2 w-10 bg-white rounded-full" />
          <div className="h-1 w-14 bg-white rounded-full" />
          <div className="h-1 w-12 bg-white rounded-full" />
          <div className="h-1 w-14 bg-white rounded-full" />
        </div>
        <motion.div
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
        />
      </div>
      <h3 className="text-2xl font-medium text-white mb-2 flex items-center gap-2">
        <ScanLine className="w-5 h-5 text-blue-400 animate-pulse" /> Analyzing Resume
      </h3>
      <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
        AI is extracting all data from your resume...
      </p>
    </div>
  </motion.div>
);

const ResumeErrorOverlay = ({ message, onRetry, onManual, onBack }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030303]/95 backdrop-blur-md px-6"
  >
    <div className="flex flex-col items-center text-center max-w-md">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-2xl font-medium text-white mb-3">Resume Analysis Failed</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">
        {message || "We could not extract data from that file."}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          <RefreshCw size={14} /> Try Again
        </button>
        <button
          onClick={onManual}
          className="px-6 py-3 rounded-full border border-white/20 text-gray-200 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
        >
          Fill In Manually
        </button>
      </div>
      <button
        onClick={onBack}
        className="mt-6 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
      >
        Back to Options
      </button>
    </div>
  </motion.div>
);

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
    const interval = setInterval(() =>
      setCurrentPhase((prev) => (prev < phases.length - 1 ? prev + 1 : prev)), 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
    >
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
            <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10">
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

const SuccessView = () => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
  >
    <motion.div
      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <svg className="w-12 h-12 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M20 6L9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      </svg>
    </motion.div>
    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl font-bold text-white mb-2">
      Setup Complete
    </motion.h2>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-gray-400">
      Launching customization studio...
    </motion.p>
  </motion.div>
);

// ─── KEYWORD & BLACKLIST CONFIG ───────────────────────────────────────────────

const KEYWORD_MAP = {
  dark: ["Dark"],
  developer: ["Developer"],
  minimal: ["Minimal", "Clean", "Simple"],
  resume: ["Resume", "Professional"],
  creative: ["Creative", "Animated"],
  photographer: ["Hero", "Creative", "Bright"],
  student: ["Student", "Beginner", "Simple"],
  corporate: ["Business", "Corporate", "Formal"],
  startup: ["Modern", "Bold", "Dark"],
  saas: ["Modern", "Clean", "Dark", "Bold"],
  luxury: ["Premium", "Editorial", "Boutique"],
  personal: ["Personal", "Personal Brand"],
  animated: ["Animated", "Gradient", "Smooth UI"],
  cinematic: ["Cinematic", "Bold", "Dark"],
  editorial: ["Editorial", "Boutique", "Minimal"],
  bright: ["Bright"],
  portfolio: ["Portfolio", "Modern", "Hero"],
};

const TEMPLATE_BLACKLIST = {
  student: ["modern", "business", "thegrandera", "luxe", "plexis", "neonix"],
  corporate: ["studentbright", "neonix", "pulse", "canvas"],
  luxury: ["studentbright", "minimal", "canvas"],
};

const STUDENT_TRIGGER_WORDS = ["student", "beginner", "starter", "college", "university", "fresher", "graduate", "intern"];
const CORPORATE_TRIGGER_WORDS = ["corporate", "enterprise", "formal", "executive", "law", "finance", "banking"];
const LUXURY_TRIGGER_WORDS = ["luxury", "boutique", "premium", "high-end", "exclusive", "editorial"];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const CreatePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { setPortfolioData } = usePortfolio();

  const [viewMode, setViewMode] = useState("selection");
  const [showThemePopup, setShowThemePopup] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [message, setMessage] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [resumeError, setResumeError] = useState("");
  const lastResumeFile = React.useRef(null);
  const [formData, setFormData] = useState({
    // experience must be an ARRAY of { company, role, period, desc } —
    // WizardForm, ResumePreviewModal and the parsed resume payload all use
    // that shape (it was previously initialised as "").
    name: "", role: "", bio: "", experience: [], skills: [],
    education: "", projects: [], linkedin: "", github: "",
    email: "", cvLink: ""
  });

  useEffect(() => { if (!loading && !user) navigate("/login"); }, [user, loading, navigate]);

  // ─── TEMPLATE MATCHING ───────────────────────────────────────────────────

  const findBestTemplateMatch = (prompt) => {
    const words = prompt.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    // Resolve which blacklist category applies (if any)
    const blacklisted = new Set();
    if (words.some(w => STUDENT_TRIGGER_WORDS.includes(w))) {
      TEMPLATE_BLACKLIST.student.forEach(k => blacklisted.add(k));
    }
    if (words.some(w => CORPORATE_TRIGGER_WORDS.includes(w))) {
      TEMPLATE_BLACKLIST.corporate.forEach(k => blacklisted.add(k));
    }
    if (words.some(w => LUXURY_TRIGGER_WORDS.includes(w))) {
      TEMPLATE_BLACKLIST.luxury.forEach(k => blacklisted.add(k));
    }

    const scores = {};

    Object.entries(TEMPLATE_LIST).forEach(([key, tmpl]) => {
      if (blacklisted.has(key)) return; // skip blacklisted templates

      let score = 0;
      const tagLower = tmpl.tags.map(t => t.toLowerCase());
      words.forEach(word => {
        tagLower.forEach(tag => { if (tag.includes(word) || word.includes(tag)) score += 2; });
        (KEYWORD_MAP[word] || []).forEach(hint => {
          if (tagLower.some(t => t.includes(hint.toLowerCase()))) score += 1;
        });
      });
      scores[key] = score;
    });

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

    // Fallback: for students default to studentbright, otherwise minimal
    if (!best || best[1] === 0) {
      return words.some(w => STUDENT_TRIGGER_WORDS.includes(w)) ? "studentbright" : "minimal";
    }
    return best[0];
  };

  // ─── FINALIZE & NAVIGATE ─────────────────────────────────────────────────

  const finalizeCreation = async (templateKey, sourceMode) => {
    setShowThemePopup(false);

    let baseData =
      sourceMode === "ai"
        ? { ...DUMMY_DATA, name: user?.displayName || "Creator", bio: `Building digital experiences. Focused on ${aiPrompt}.`, role: "Creative Developer", skills: DUMMY_DATA.skills || [], projects: DUMMY_DATA.projects || [] }
        : { ...formData, skills: formData.skills || [], projects: formData.projects || [] };

    const finalPayload = {
      ...baseData,
      template: templateKey,
      isPublic: false,
      themeBg: TEMPLATE_LIST[templateKey]?.themeBg || "#ffffff",
      themeFont: TEMPLATE_LIST[templateKey]?.themeFont || "#000000",
    };

    try {
      const savedPortfolio = await saveOrUpdatePortfolio(finalPayload);
      setPortfolioData(savedPortfolio);
      setViewMode("success");
      setTimeout(() => navigate(`/customize/${templateKey}`, { state: { portfolioData: savedPortfolio } }), 2500);
    } catch {
      setPortfolioData(finalPayload);
      setViewMode("success");
      setTimeout(() => navigate(`/customize/${templateKey}`, { state: { portfolioData: finalPayload } }), 2500);
    }
  };

  // ─── HANDLERS ────────────────────────────────────────────────────────────

  const handleAIStart = (prompt) => {
    setAiPrompt(prompt);
    setViewMode("ai-loading");
    setTimeout(() => {
      const matchedTemplate = findBestTemplateMatch(prompt);
      finalizeCreation(matchedTemplate, "ai");
    }, 4500);
  };

  const handleControlStart = () => setViewMode("wizard");

  const handleResumeUpload = async (file) => {
    if (!file) return;
    lastResumeFile.current = file;
    setResumeError("");
    setViewMode("resume-loading");
    try {
      const data = await parseResumeFile(file);
      setExtractedData(data);
      setViewMode("selection");
      setShowResumePreview(true);
    } catch (error) {
      // Surface the actual API error with a clear retry path — no silent
      // fallback into the empty wizard.
      console.error("Parsing failed:", error);
      setResumeError(error.message || "Failed to analyze resume.");
      setViewMode("resume-error");
    }
  };

  const handleResumeRetry = () => {
    if (lastResumeFile.current) {
      handleResumeUpload(lastResumeFile.current);
    } else {
      setViewMode("selection");
    }
  };

  const handleResumeConfirm = (confirmedData) => {
    // Everything the parser returns lands in the builder form: identity,
    // links, education, skills[], experience[], projects[].
    setFormData((prev) => ({
      ...prev,
      ...confirmedData,
      skills: Array.isArray(confirmedData.skills) ? confirmedData.skills : [],
      experience: Array.isArray(confirmedData.experience) ? confirmedData.experience : [],
      projects: Array.isArray(confirmedData.projects) ? confirmedData.projects : [],
    }));
    setShowResumePreview(false);
    setViewMode("wizard");
    setMessage("Resume loaded! Review your details and proceed.");
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
          {viewMode === "resume-error" && (
            <ResumeErrorOverlay
              key="resume-error"
              message={resumeError}
              onRetry={handleResumeRetry}
              onManual={() => { setResumeError(""); setViewMode("wizard"); }}
              onBack={() => { setResumeError(""); setViewMode("selection"); }}
            />
          )}
          {viewMode === "success" && <SuccessView key="success" />}
        </AnimatePresence>
      </div>

      {showThemePopup && (
        <ThemePopup onSelect={(key) => finalizeCreation(key, "manual")} onClose={() => setShowThemePopup(false)} />
      )}

      <AnimatePresence>
        {showResumePreview && extractedData && (
          <ResumePreviewModal
            data={extractedData}
            onConfirm={handleResumeConfirm}
            onClose={() => { setShowResumePreview(false); setViewMode("selection"); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePage;