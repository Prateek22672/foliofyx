import React, { useEffect, useState } from "react";
import { X, ArrowRight, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Import the new Asset Manager
import { getThemeAssets } from "./ThemeAssets"; 

const ThemePreviewModal = ({ theme, onClose, onStart }) => {
  const [viewMode, setViewMode] = useState("desktop"); // 'desktop' | 'mobile'

  // === 1. LOCK BODY SCROLL ===
  useEffect(() => {
    if (theme) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [theme]);

  // Reset to desktop when theme changes
  useEffect(() => {
    if (theme) setViewMode("desktop");
  }, [theme]);

  if (!theme) return null;

  // === 2. FETCH ASSETS FROM ASSET MANAGER ===
  // We use the themeKey (e.g., 'thegrandera') to get the specific images
  const { desktop, mobile } = getThemeAssets(theme.themeKey);

  // Generate Demo URL
  const urlKey = theme.themeKey || theme.name?.toLowerCase().replace(/\s+/g, "") || "modern";
  const demoUrl = `/demo/${urlKey}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-6">
        
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onTouchMove={(e) => e.preventDefault()} 
        />

        {/* Modal Window */}
        <motion.div 
            initial={{ opacity: 0, y: "100%" }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FAFAFA] w-full sm:w-[95%] max-w-7xl 
                       rounded-t-3xl sm:rounded-3xl 
                       shadow-2xl z-10 
                       flex flex-col 
                       h-[92dvh] sm:h-auto sm:max-h-[85vh] 
                       overflow-hidden relative"
        >
          
          {/* === HEADER === */}
          <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-200 bg-white flex flex-col md:flex-row justify-between items-center gap-4 z-20">
            
            {/* Title Block */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                  {theme.name ? theme.name.charAt(0) : "T"}
               </div>
               <div>
                 <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-none">
                    {theme.name}
                 </h2>
                 <p className="text-gray-500 text-[10px] sm:text-xs mt-1 font-medium uppercase tracking-wider">
                    Portfolio Template
                 </p>
               </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button 
                    onClick={() => setViewMode("desktop")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        viewMode === "desktop" 
                        ? "bg-white text-black shadow-sm" 
                        : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                    }`}
                >
                    <Monitor size={16} />
                    <span className="hidden sm:inline">Desktop</span>
                </button>
                <button 
                    onClick={() => setViewMode("mobile")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        viewMode === "mobile" 
                        ? "bg-white text-black shadow-sm" 
                        : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                    }`}
                >
                    <Smartphone size={16} />
                    <span className="hidden sm:inline">Mobile</span>
                </button>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 sm:static w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* === BODY (Scrollable) === */}
          <div 
            className="flex-1 overflow-y-auto p-4 sm:p-10 bg-[#F8F9FA] custom-scrollbar overscroll-contain touch-pan-y"
            onWheel={(e) => e.stopPropagation()} 
            onTouchMove={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
                
                {/* --- DESKTOP VIEW --- */}
                {viewMode === "desktop" && (
                    <motion.div 
                        key="desktop"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-center"
                    >
                        <div className="relative w-[full] max-w-xl group perspective-1000">
                            {/* Browser Frame */}
                            <div className="bg-gray-900 rounded-t-xl sm:rounded-t-2xl p-1.5 sm:p-3 pb-0 shadow-2xl">
                                <div className="flex gap-1.5 absolute top-3 sm:top-4 left-4">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF5F56]" />
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#27C93F]" />
                                </div>
                                <div className="bg-white rounded-t sm:rounded-t-lg overflow-hidden aspect-[16/7.5] relative">
                                    <img 
                                      src={desktop} 
                                      alt={`${theme.name} Desktop`} 
                                      className="w-full h-auto object-cover object-top hover:object-bottom transition-all duration-[4s] ease-in-out cursor-ns-resize" 
                                    />
                                </div>
                            </div>
                            {/* Stand base */}
                            <div className="bg-gray-800 h-2 sm:h-4 rounded-b-lg shadow-lg mx-[2%] relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-1 sm:h-2 bg-gray-700 rounded-b-md"></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- MOBILE VIEW --- */}
                {viewMode === "mobile" && (
                    <motion.div 
                        key="mobile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                         {mobile && mobile.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
                                {mobile.map((img, index) => (
                                    <div key={index} className="relative w-full max-w-[200px] group">
                                        <div className="bg-gray-900 rounded-[2rem] p-2 shadow-xl border-4 border-gray-800 ring-1 ring-gray-900/50">
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20"></div>
                                            <div className="bg-white rounded-[1.5rem] overflow-hidden aspect-[9/19] relative">
                                                <img 
                                                    src={img} 
                                                    alt={`Mobile Screen ${index + 1}`} 
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <Smartphone size={48} className="mb-4 opacity-30" />
                                <h3 className="text-lg font-semibold text-gray-500">Mobile Previews Coming Soon</h3>
                                <p className="text-sm">This template is fully responsive.</p>
                            </div>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>
          </div>

          {/* === FOOTER === */}
          <div className="flex-shrink-0 p-4 sm:p-6 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-8 sm:pb-6">
             <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Template ID</span>
                <span className="text-sm font-bold text-gray-800">{theme.themeKey || "FYX-001"}</span>
             </div>

             <div className="flex w-full sm:w-auto gap-3">
                <a 
                   href={demoUrl} 
                    
                   rel="noopener noreferrer"
                   className="flex-1 sm:flex-none px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
                >
                   <ExternalLink size={16} />
                   Live Demo
                </a>

                <button 
                  onClick={() => onStart(theme.themeKey)}
                  className="flex-1 sm:flex-none px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                >
                  Use Template
                  <ArrowRight size={16} />
                </button>
             </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ThemePreviewModal;