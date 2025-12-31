import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ArrowRight, X, FileUp, Sparkles } from "lucide-react";

export default function SelectionView({ onSelectAI, onSelectControl, onSelectResume }) {
  const [activeMode, setActiveMode] = useState(null); // 'ai' | null
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  const suggestions = [
    "Minimalist Portfolio for Photographer",
    "3D Interactive Developer Experience",
    "Dark Mode SaaS Landing Page",
    "Clean Resume for Data Scientist"
  ];

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    // Smooth delay to allow exit animations
    setTimeout(() => { onSelectAI(prompt); }, 800);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onSelectResume(file);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center min-h-[80vh] px-4">

      {/* HEADER LOGO */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <div className="relative w-full max-w-7xl mx-auto px-6">
          <img src="/logow.png" alt="Logo" className="w-20 md:w-26 brightness-0 absolute left-4 md:left-10 top-0 pointer-events-auto" />
        </div>
      </motion.nav>

      {/* HEADER - Fades out when AI is active to focus attention */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: activeMode === 'ai' ? 0 : 1, 
          y: activeMode === 'ai' ? -50 : 0,
          scale: activeMode === 'ai' ? 0.9 : 1,
          pointerEvents: activeMode === 'ai' ? "none" : "auto"
        }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="text-center mb-12 z-10"
      >
        
        <h1 className="text-4xl pt-20 sm:pt-0 sm:text-5xl md:text-7xl font-medium tracking-tighter text-white mb-4">
          How do you want to build?
        </h1>
        <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
          Let AI architect your vision, auto-fill from your Resume, or take full manual control.
        </p>
      </motion.div>

      {/* CARDS GRID */}
      <div className={`w-full transition-all duration-500 grid gap-6 ${activeMode === 'ai' ? 'max-w-3xl grid-cols-1' : 'max-w-6xl grid-cols-1 md:grid-cols-3'}`}>
        
        {/* --- CARD 1: AI BUILD (Morphing Card) --- */}
        <motion.div
          layoutId="ai-card"
          onClick={() => !isSubmitting && setActiveMode('ai')}
          className={`relative group overflow-hidden bg-[#0a0a0a] border border-white/10 cursor-pointer backdrop-blur-xl transition-all duration-500
            ${activeMode === 'ai' 
              ? 'rounded-[2rem] p-8 ring-1 ring-purple-500/50 shadow-[0_0_100px_rgba(168,85,247,0.2)] z-50 min-h-[300px] flex flex-col justify-center' 
              : 'rounded-3xl p-8 hover:border-purple-500/30 hover:bg-white/5 flex flex-col justify-between min-h-[320px]'
            }
          `}
        >
          {/* Animated Background Gradient */}
          <div className={`absolute top-0 right-0 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none transition-all duration-700
            ${activeMode === 'ai' ? 'w-full h-full opacity-20' : 'w-40 h-40 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100'}
          `} />

          <AnimatePresence mode="wait">
            {activeMode === 'ai' ? (
               /* --- AI EXPANDED MODE --- */
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                 className="w-full flex flex-col items-center relative z-20"
               >
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); setActiveMode(null); setPrompt(""); }}
                        className="absolute -right-4 -top-4 text-gray-500 p-4 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </motion.button>
                     
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center gap-2 mb-6 justify-center">
                          <img src="/ai.svg"/>
                            <span className="text-sm font-medium text-purple-200 tracking-widest uppercase">FYX AI</span>
                        </div>
                    </motion.div>

                    <form onSubmit={handleAISubmit} className="w-full relative flex items-center">
                        <input 
                            autoFocus 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            placeholder="Describe your dream site... (e.g., 'A dark mode portfolio for a 3D artist')" 
                            className="w-full bg-transparent border-b border-white/20 pb-4 text-2xl md:text-3xl text-white placeholder-gray-600 outline-none focus:border-purple-500 transition-all font-light"
                        />
                        <AnimatePresence>
                            {prompt.length > 0 && (
                                <motion.button 
                                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                    type="submit" 
                                    className="absolute right-0 bottom-4 p-3 bg-white rounded-full text-purple-900 hover:scale-110 transition-transform shadow-lg shadow-white/20"
                                >
                                    <ArrowRight size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </form>

                    {!isSubmitting && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-3 mt-8 justify-center w-full"
                        >
                            {suggestions.map((s, i) => (
                                <motion.button 
                                    key={s} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    onClick={(e)=>{e.stopPropagation(); setPrompt(s)}} 
                                    className="px-4 py-2 bg-white/5 border border-white/5 text-xs md:text-sm text-gray-400 rounded-full hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-white transition-all active:scale-95"
                                >
                                    {s}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
               </motion.div>
            ) : (
              /* --- AI COLLAPSED CARD --- */
              <motion.div layoutId="ai-content" className="h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-4">
                          <img src="/ai.svg" className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-3xl font-medium text-white mb-2 group-hover:text-purple-300 transition-colors">Build with AI</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">Describe your vision. Our AI architect creates the structure, copy, and design instantly.</p>
                </div>
                <div className="flex justify-end mt-4">
                    <ArrowRight className="text-purple-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- CARD 2: UPLOAD RESUME --- */}
        <AnimatePresence>
          {activeMode !== 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: 0.1 }}
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 cursor-pointer hover:border-blue-500/30 hover:bg-blue-900/5 flex flex-col justify-between transition-all duration-500 min-h-[320px]"
            >
              {/* BETA BADGE */}
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold tracking-widest text-white/80 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                BETA
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900/20 to-black border border-blue-500/30 flex items-center justify-center mb-4">
                <FileUp className="text-blue-400 w-7 h-7" />
              </div>
              
              <div>
                <h3 className="text-3xl font-medium text-white mb-2 group-hover:text-blue-300 transition-colors">Upload Resume</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Upload your CV (PDF/Image). We'll extract your skills and experience to auto-fill the builder.
                </p>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
              
              <div className="flex justify-end mt-4">
                <ArrowRight className="text-blue-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- CARD 3: MANUAL CONTROL --- */}
        <AnimatePresence>
          {activeMode !== 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: 0.2 }}
              onClick={onSelectControl}
              className="relative group w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 cursor-pointer hover:border-white/30 hover:bg-white/5 flex flex-col justify-between transition-all duration-500 min-h-[320px]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-800/40 to-black border border-white/20 flex items-center justify-center mb-4">
                <Layers className="text-white w-7 h-7" />
              </div>
              
              <div>
                <h3 className="text-3xl font-medium text-white mb-2">Manual Control</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Start from a blank canvas. Select a template and fill in every detail step-by-step yourself.
                </p>
              </div>
              
              <div className="flex justify-end mt-4">
                <ArrowRight className="text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}