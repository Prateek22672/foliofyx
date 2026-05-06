import React, { useEffect, useState } from "react";
import { getAllPortfolios, deletePortfolio } from "../api/portfolioAPI";
import { useNavigate } from "react-router-dom";
import {
  Trash2, PencilLine, Copy, Plus, ExternalLink,
  Lock, Loader2, Sparkles, LayoutTemplate, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PopupMessage from "../components/PopupMessage";
import { useSplash } from "../context/SplashContext";
import { TEMPLATE_LIST } from "../pages/Portfolio/Templates";
import Footer from "../components/Footer";
import UpgradePopup from "../components/UpgradePopup";
import { useAuth } from "../context/AuthContext";
import DashboardTutorial from "./DashboardTutorial";
import ThemePreviewModal from "./themes/components/ThemePreviewModal";

// ── Pick 3 recommended template keys to show ─────────────────────────────────
const RECOMMENDED_KEYS = Object.keys(TEMPLATE_LIST).slice(0, 3);

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSplash } = useSplash();

  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // ── Theme preview modal state ─────────────────────────────────────────────
  const [previewTheme, setPreviewTheme] = useState(null);

  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (loading) return;
    if (!user && !token) { navigate("/login"); return; }
    if (!user && token) return;

    let isMounted = true;
    (async () => {
      try {
        const res = await getAllPortfolios();
        if (isMounted) {
          setPortfolios(Array.isArray(res) ? res : []);
          const hasSeen = localStorage.getItem("dashboardTutorialSeen");
          if (!hasSeen) {
            setTimeout(() => setShowTutorial(true), 700);
            localStorage.setItem("dashboardTutorialSeen", "true");
          }
        }
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
        if (err.response?.status === 401) { logout(); navigate("/login"); }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [user, loading, logout, navigate]);

  const confirmDelete = async () => {
    try {
      await deletePortfolio(selectedPortfolio._id);
      setPortfolios((prev) => prev.filter((p) => p._id !== selectedPortfolio._id));
      setMessage("🗑️ Portfolio deleted successfully!");
      setSelectedPortfolio(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete portfolio:", err);
      setMessage("❌ Failed to delete portfolio. Try again.");
    }
  };

  const userPlan = user?.plan || "free";
  const isCreationLocked = userPlan === "free" && portfolios.length >= 1;

  const handleCreateClick = () => {
    if (isCreationLocked) setShowUpgrade(true);
    else navigate("/create");
  };

  // Open ThemePreviewModal with a template key
  const handleOpenPreview = (key) => {
    const tpl = TEMPLATE_LIST[key];
    if (!tpl) return;
    setPreviewTheme({ name: tpl.label || key, themeKey: key });
  };

  // "Use Template" from inside the modal
  const handleStartFromPreview = (themeKey) => {
    if (isCreationLocked) { setPreviewTheme(null); setShowUpgrade(true); return; }
    setPreviewTheme(null);
    showSplash(1500, () => navigate(`/customize/${themeKey}`), "Loading template...");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.09 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.35 } },
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-black" />
          <p className="text-neutral-500 font-medium">Loading your studio...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="relative min-h-screen bg-white text-black pt-32 overflow-hidden">

      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason="limit" />

      {/* ── ThemePreviewModal ── */}
      <ThemePreviewModal
        theme={previewTheme}
        onClose={() => setPreviewTheme(null)}
        onStart={handleStartFromPreview}
      />

      <div className="relative z-10 px-4 sm:px-10 pb-20">

        {/* ════════════════════════════════════
            HERO HEADER — personal greeting
        ════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto mb-12">

          {/* Top row: greeting + plan badge + tutorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-neutral-400 text-sm font-medium mb-1 tracking-wide uppercase">
                Your creative studio
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight flex flex-wrap items-center gap-3">
                Hi, {firstName}

                <span className={`text-[10px] md:text-xs align-middle px-3 py-1 rounded-full uppercase tracking-wider border font-bold
                  ${userPlan === "max"
                    ? "bg-black text-[#D4AF37] border-[#D4AF37]"
                    : userPlan === "plus"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {userPlan} Plan
                </span>

                <button
                  onClick={() => setShowTutorial(true)}
                  title="Show dashboard tutorial"
                  className="w-15 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-[13px] font-bold transition-all flex items-center justify-center flex-shrink-0"
                >
                  Help ?
                </button>
              </h1>
              <p className="text-neutral-500 mt-2 text-lg">
                Here's your work — build, manage, and share your digital presence.
              </p>
            </div>

            {/* ── Two clear CTA buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {/* Browse Templates */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/create")}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border-2 border-black text-black font-semibold text-sm hover:bg-black hover:text-white transition-all duration-200 shadow-sm"
              >
                <LayoutTemplate size={17} />
                View Templates
              </motion.button>

              {/* Start Creating */}
              <motion.button
                id="create-btn"
                whileHover={{ scale: isCreationLocked ? 1 : 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateClick}
                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-xl
                  ${isCreationLocked
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                    : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
                  }`}
              >
                {isCreationLocked ? <Lock size={17} /> : <Plus size={17} className="group-hover:rotate-90 transition-transform" />}
                Start Creating
              </motion.button>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Portfolios", value: portfolios.length },
              { label: "Plan", value: userPlan.charAt(0).toUpperCase() + userPlan.slice(1) },
              { label: "Templates", value: Object.keys(TEMPLATE_LIST).length + "+" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="text-2xl font-bold text-black">{value}</span>
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <PopupMessage message={message} onClose={() => setMessage("")} />

        {/* ── Delete Modal ── */}
        <AnimatePresence>
          {selectedPortfolio && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[60] p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white border border-neutral-100 rounded-[2rem] p-8 text-center shadow-2xl max-w-sm w-full"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Delete Project?</h2>
                <p className="text-neutral-500 mb-8 text-sm leading-relaxed">
                  This action is permanent. <br />
                  Are you sure you want to remove{" "}
                  <span className="font-bold text-black">{selectedPortfolio.name}</span>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPortfolio(null)}
                    className="flex-1 px-4 py-3.5 rounded-2xl font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3.5 rounded-2xl font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════
            MY PORTFOLIOS SECTION
        ════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black tracking-tight">My Portfolios</h2>
            <span className="text-sm text-neutral-400">{portfolios.length} project{portfolios.length !== 1 ? "s" : ""}</span>
          </div>

          {/* ── Empty State ── */}
          {portfolios.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-neutral-200 rounded-[2.5rem] bg-neutral-50/50"
            >
              <motion.button
                onClick={handleCreateClick}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-sm
                  ${isCreationLocked
                    ? "bg-neutral-100 border border-neutral-200 cursor-not-allowed text-neutral-300"
                    : "bg-white border border-neutral-200 hover:border-black hover:shadow-xl hover:bg-black group cursor-pointer text-neutral-300 hover:text-white"
                  }`}
              >
                <Plus size={36} className="transition-all duration-300 group-hover:rotate-90" />
              </motion.button>

              <p className="text-neutral-900 text-xl font-semibold">No portfolios yet.</p>
              <p className="text-neutral-400 mt-1 mb-6">Your journey begins here.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/create")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-black text-black text-sm font-semibold hover:bg-black hover:text-white transition-all"
                >
                  <LayoutTemplate size={15} /> Browse Templates
                </button>
                <button
                  onClick={handleCreateClick}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-all"
                >
                  <Plus size={15} /> Start Creating
                </button>
              </div>
            </motion.div>

          ) : (
            /* ── Portfolios Grid ── */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {portfolios.map((p, index) => (
                <motion.div
                  key={p._id}
                  id={index === 0 ? "first-card" : undefined}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                  className="group relative flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-500"
                >
                  {/* Window bar */}
                  <div className="absolute top-4 left-4 right-4 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div
                      id={index === 0 ? "card-actions" : undefined}
                      className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300"
                    >
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/portfolio/${p._id}`);
                          setMessage("✅ Copied link!");
                          setTimeout(() => setMessage(""), 2500);
                        }}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Copy Link"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedPortfolio(p)}
                        className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        title="Delete Portfolio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Preview image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                    <img
                      src={TEMPLATE_LIST[p.template]?.preview}
                      alt={p.template}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-widest mb-3">
                        {TEMPLATE_LIST[p.template]?.label || "Modern"} Theme
                      </span>
                      <h3 className="text-white font-bold text-2xl leading-tight truncate">
                        {p.name || "Untitled Portfolio"}
                      </h3>
                      <p className="text-white/50 text-sm mt-1 truncate">
                        {p.role || "Full Stack Developer"}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex gap-3">
                    <button
                      id={index === 0 ? "view-btn" : undefined}
                      onClick={() => showSplash(2500, () => navigate(`/portfolio/${p._id}`))}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-2xl font-bold text-sm hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    >
                      <ExternalLink size={16} /> View Live
                    </button>
                    <button
                      id={index === 0 ? "edit-btn" : undefined}
                      onClick={() => showSplash(2500, () => navigate(`/customize/${p.template}`, { state: { portfolioData: p } }))}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white border border-white/10 py-3 rounded-2xl font-semibold text-sm hover:bg-[#252525] hover:border-white/20 active:scale-95 transition-all duration-200"
                    >
                      <PencilLine size={16} /> Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ════════════════════════════════════
            RECOMMENDED TEMPLATES SECTION
        ════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto mb-16">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-black tracking-tight">Recommended for You</h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                  Handpicked templates — click to preview, then start building.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/designs")}
              className="flex items-center gap-2 text-sm font-semibold text-black hover:text-neutral-600 transition-colors whitespace-nowrap"
            >
              See all templates <ArrowRight size={15} />
            </button>
          </div>

          {/* Template recommendation cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {RECOMMENDED_KEYS.map((key, i) => {
              const tpl = TEMPLATE_LIST[key];
              if (!tpl) return null;

              return (
                <motion.div
                  key={key}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 280 } }}
                  className="group relative rounded-[1.75rem] overflow-hidden border border-neutral-100 bg-white shadow-sm hover:shadow-xl hover:shadow-black/10 transition-shadow duration-400 cursor-pointer"
                  onClick={() => handleOpenPreview(key)}
                >
                  {/* Preview thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    <img
                      src={tpl.preview}
                      alt={tpl.label}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Hover overlay with "Preview" CTA */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <span className="flex items-center gap-2 bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full shadow-xl">
                          <ExternalLink size={14} />
                          Preview Template
                        </span>
                      </motion.div>
                    </div>

                    {/* "Popular" badge on first card */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles size={9} /> Popular
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-black text-[15px] leading-tight">
                        {tpl.label || key}
                      </h3>
                      <p className="text-neutral-400 text-xs mt-0.5">Portfolio Template</p>
                    </div>

                    <div className="flex gap-2">
                      {/* Quick-use button */}
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartFromPreview(key);
                        }}
                        className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-neutral-800 transition-all"
                      >
                        <Plus size={12} /> Use
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* ── Video CTA ── */}
      <div className="relative w-full px-4 sm:px-10 mb-10">
        <div className="relative w-full h-40 md:h-64 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.05]">
            <source src="/dbv.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div className="relative">
        <Footer />
      </div>

      {/* ── Tutorial overlay ── */}
      {showTutorial && (
        <DashboardTutorial onClose={() => setShowTutorial(false)} />
      )}

    </div>
  );
};

export default Dashboard;