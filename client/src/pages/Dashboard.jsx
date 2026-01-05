import React, { useEffect, useState } from "react";
import { getAllPortfolios, deletePortfolio } from "../api/portfolioAPI";
import { useNavigate } from "react-router-dom";
import { Trash2, PencilLine, Copy, Plus, ExternalLink, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PopupMessage from "../components/PopupMessage";
import { useSplash } from "../context/SplashContext";
import { TEMPLATE_LIST } from "../pages/Portfolio/Templates";
import Footer from "../components/Footer";
import UpgradePopup from "../components/UpgradePopup";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSplash } = useSplash();

  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // 1. Check for token in storage manually to prevent premature redirect
    const token = localStorage.getItem("accessToken");

    // ⏳ If Auth Context is still loading, do nothing yet.
    if (loading) return;

    // 🔒 If no user AND no token in storage, then redirect to login.
    if (!user && !token) {
      navigate("/login");
      return;
    }

    // ⏳ If we have a token but 'user' is null, wait (Auth Context is likely restoring session)
    if (!user && token) {
      return; 
    }

    // ✅ Only fetch data if we have a user
    let isMounted = true;

    (async () => {
      try {
        const res = await getAllPortfolios(); 

        if (isMounted) {
          setPortfolios(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);

        if (err.response?.status === 401) {
          // Only logout if the server explicitly rejects the token
          logout(); 
          navigate("/login");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user, loading, logout, navigate]);


  // Handle delete
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

  const userPlan = user?.plan || 'free'; 
  const isCreationLocked = userPlan === 'free' && portfolios.length >= 1;

  const handleCreateClick = () => {
    if (isCreationLocked) {
        setShowUpgrade(true);
    } else {
        showSplash(2500, () => navigate("/create"));
    }
  };

  // ... Variants ...
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const cardVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } } };

  // ✅ LOADING VIEW
  // Show loader if fetching portfolios OR if we are waiting for Auth to initialize
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

  return (
    <div className="relative min-h-screen bg-white text-black pt-32 overflow-hidden">
      
      <UpgradePopup isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} reason="limit" />

      <div className="relative z-10 px-4 sm:px-10 pb-20">
        
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 max-w-7xl mx-auto">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight flex items-center gap-3 justify-center md:justify-start">
                My Portfolios
                <span className={`text-[10px] md:text-xs align-middle px-3 py-1 rounded-full uppercase tracking-wider border font-bold ${userPlan === 'max' ? 'bg-black text-[#D4AF37] border-[#D4AF37]' : userPlan === 'plus' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {userPlan} Plan
                </span>
              </h1>
              <p className="text-neutral-500 mt-2 text-lg">
                Manage your digital presence.
              </p>
            </div>

            <button
              onClick={handleCreateClick}
              className={`
                group relative flex items-center justify-center gap-3
                px-8 py-3.5 rounded-full
                font-medium text-base
                transition-all duration-300
                shadow-xl
                ${isCreationLocked 
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200 hover:bg-neutral-100" 
                  : "bg-black text-white hover:scale-105 hover:shadow-2xl hover:bg-neutral-900 active:scale-95 shadow-black/20"}
              `}
            >
              {isCreationLocked ? <Lock size={20} /> : <Plus size={20} className="text-white group-hover:rotate-90 transition-transform duration-300" />}
              <span>Create Website</span>
            </button>
          </div>

          <PopupMessage message={message} onClose={() => setMessage("")} />

          {/* Delete Confirmation Modal */}
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
                    This action is permanent. <br/>Are you sure you want to remove <span className="font-bold text-black">{selectedPortfolio.name}</span>?
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedPortfolio(null)} className="flex-1 px-4 py-3.5 rounded-2xl font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 px-4 py-3.5 rounded-2xl font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition">Delete</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolios Grid */}
          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-neutral-200 rounded-[2.5rem] bg-neutral-50/50 max-w-7xl mx-auto">
               <div className="w-20 h-20 bg-white shadow-sm border border-neutral-100 rounded-full flex items-center justify-center mb-6 text-neutral-300">
                  <Plus size={40} />
               </div>
               <p className="text-neutral-900 text-xl font-semibold">No portfolios created yet.</p>
               <p className="text-neutral-400 mt-1">Your journey begins here.</p>
               <button onClick={handleCreateClick} className="mt-6 text-blue-600 font-bold hover:underline">Start Creating &rarr;</button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {portfolios.map((p) => (
                <motion.div
                  key={p._id}
                  variants={cardVariants}
                  className="group relative flex flex-col bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Floating Window Header */}
                  <div className="absolute top-4 left-4 right-4 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                      <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
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

                  {/* Preview Image */}
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

                  {/* Actions Footer */}
                  <div className="p-4 bg-[#0a0a0a] border-t border-white/5 flex gap-3">
                    <button 
                      onClick={() => showSplash(2500, () => navigate(`/portfolio/${p._id}`))}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-2xl font-bold text-sm hover:bg-neutral-200 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                    >
                      <ExternalLink size={16} /> View Live
                    </button>

                    <button 
                      onClick={() => showSplash(2500, () => navigate(`/customize/${p.template}`, { state: p }))}
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

      {/* Video CTA */}
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

    </div>
  );
};

export default Dashboard;