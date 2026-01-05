import React from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react"; // Added Sparkles icon for extra shine effect

const TryMaxPopup = ({ onClose, onLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
    >
      {/* CONTAINER FOR THE POPUP & ITS GLOW */}
      <div className="relative w-full max-w-[400px]">
        
        {/* === THE OUTER SHINE GLOW (Behind the card) === */}
        {/* This blurred div creates the ambient light radiating from the popup */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600/60 via-purple-600/60 to-pink-600/60 rounded-[40px] blur-2xl opacity-70 animate-pulse-slow pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full overflow-hidden rounded-[32px] shadow-[0_0_50px_-12px_rgb(168_85_247_/_0.5)] border border-white/10"
        >
          {/* === TOP HALF: SHINING HOLOGRAPHIC GRADIENT === */}
          <div className="relative h-52 w-full overflow-hidden flex items-center justify-center">
            {/* Radiant Background Layers */}
            <div className="absolute inset-0 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-pink-500"></div>
            {/* A bright spotlight effect on top right */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4)_0%,transparent_60%)] mix-blend-overlay"></div>
            
            {/* Subtle animated grain/sparkle overlay (optional, removes flatness) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light"></div>

            {/* Close button */}
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
            >
                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="text-center relative z-10 px-6">
                {/* Small glowing icon above text */}
                <div className="mb-3 flex justify-center">
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                         <Sparkles className="text-white" size={20} />
                    </div>
                </div>
                {/* Main Text with Glow Shadow */}
                <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                  Try Max, Free
                </h2>
            </div>
          </div>

          {/* === BOTTOM HALF: DARK CONTENT === */}
          {/* Added a slight gradient sheen to the dark background */}
          <div className="bg-gradient-to-b from-[#18181b] to-[#0f0f11] p-8 text-center relative">
             {/* Subtle top border highlight separating sections */}
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <p className="text-neutral-400 text-[15px] leading-relaxed mb-8">
                Log in to see if you qualify for <span className="text-white font-medium drop-shadow-sm">unlimited projects</span>, 
                premium templates, and AI assistant features with a Max plan — <span className="text-white font-medium drop-shadow-sm">all free for students</span>.
            </p>

            <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Maybe later
                </button>
                {/* SHINING PRIMARY BUTTON */}
                <button
                  onClick={onLogin}
                  className="relative group px-8 py-3 rounded-full text-sm font-bold text-black overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                >
                   {/* Button background that shines on hover */}
                   <div className="absolute inset-0 bg-white transition-all group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-indigo-100 group-hover:to-white"></div>
                  <span className="relative z-10">Log in</span>
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TryMaxPopup;