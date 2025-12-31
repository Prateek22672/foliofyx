import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const TryMaxPopup = ({ onClose, onLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[400px] overflow-hidden rounded-[32px] shadow-2xl"
      >
        {/* === TOP HALF: HOLOGRAPHIC GRADIENT === */}
        <div className="relative h-48 w-full bg-gradient-to-tr from-[#6366f1] via-[#a855f7] to-[#ec4899] flex items-center justify-center">
            {/* Close button (Optional, usually these modals force a choice, but X is good UX) */}
            <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors backdrop-blur-md"
            >
                <X size={16} />
            </button>

            <div className="text-center">
                <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                    Try Max, Free
                </h2>
            </div>
        </div>

        {/* === BOTTOM HALF: DARK CONTENT === */}
        <div className="bg-[#18181b] p-8 text-center">
            <p className="text-neutral-400 text-[15px] leading-relaxed mb-8">
                Log in to see if you qualify for <span className="text-white font-medium">unlimited projects</span>, 
                premium templates, and AI assistant features with a Max plan — <span className="text-white font-medium">all free for students</span>.
            </p>

            <div className="flex items-center gap-3 justify-center">
                <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Maybe later
                </button>
                <button
                    onClick={onLogin}
                    className="px-8 py-3 rounded-full text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
                >
                    Log in
                </button>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TryMaxPopup;