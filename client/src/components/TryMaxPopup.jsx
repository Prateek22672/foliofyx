import React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

// Premium "Try Max" offer card: single dark glass panel with a contained
// aurora glow, benefit list, and a clear CTA pair. `data-native-cursor`
// hands control back to the OS cursor while the popup is open — the custom
// landing cursor made small buttons hard to target.
const PERKS = [
  "Unlimited projects",
  "Premium template collection",
  "AI assistant on every page",
];

const TryMaxPopup = ({ onClose, onLogin }) => {
  return (
    <motion.div
      data-native-cursor
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b12] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* Contained aurora — glow lives inside the card, not smeared behind it */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[130%] h-72 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.45),rgba(99,102,241,0.18)_45%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.12),transparent_45%)]" />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
        >
          <X size={15} />
        </button>

        <div className="relative z-10 px-8 pt-12 pb-8">
          {/* Brand mark */}
          <img
            src="/FYX/BlackClearBGNew.png"
            alt="FolioFYX"
            className="w-14 mx-auto mb-6 brightness-200"
          />

          {/* Headline */}
          <h2 className="text-center text-[34px] leading-tight font-black tracking-tight text-white mb-2">
            Try Max, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">free.</span>
          </h2>
          <p className="text-center text-[13.5px] text-neutral-400 leading-relaxed mb-7 max-w-[300px] mx-auto">
            Log in to see if you qualify for the Max plan —
            <span className="text-white font-medium"> free for students</span>.
          </p>

          {/* Perks */}
          <div className="mx-auto max-w-[300px] space-y-2.5 mb-8">
            {PERKS.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5"
              >
                <span className="grid place-items-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
                <span className="text-[13px] text-neutral-200">{perk}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Maybe later
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-3 rounded-full text-sm font-bold text-black bg-white hover:shadow-[0_0_36px_rgba(167,139,250,0.45)] hover:scale-[1.03] transition-all"
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
