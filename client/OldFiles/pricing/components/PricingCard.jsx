import React from "react";
import { motion } from "framer-motion";
import { Check, X, GraduationCap, Zap } from "lucide-react";

const PricingCard = ({ 
  title, price, standardPrice, description, features, variant = "default", onButtonClick, buttonText, period, duration, isStudent 
}) => {
    const isPro = variant === "pro"; 
    const isPlus = variant === "plus"; 
    const isFree = variant === "free";

    let containerClasses = "bg-neutral-950/50 border-white/10";
    if (isPlus) containerClasses = `bg-neutral-900/80 border-white/20 shadow-lg`;
    
    // Student Mode Styles
    if (isStudent && (isPlus || isPro)) containerClasses = `bg-neutral-900 border-indigo-500/40 shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)] scale-[1.02] ring-1 ring-blue-500/30`;
    if (isPro && !isStudent) containerClasses = `bg-neutral-900 border-[#8b5cf6]/30 shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] scale-[1.05] z-10`;

    let titleClass = "text-white";
    if (isPlus) titleClass = "text-neutral-200";
    if (isPro) titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300";

    return (
      <motion.div layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 group ${containerClasses}`}>
        {isPro && !isStudent && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20">Best Value</div>}
        {isStudent && !isFree && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-blue-400/50 flex items-center gap-1"><GraduationCap size={12}/> Student Deal Active</div>}
  
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-2 ${titleClass}`}>{title}</h3>
          <p className="text-neutral-400 text-sm h-10">{description}</p>
        </div>
        <div className="mb-8">
            <div className="flex flex-col">
              {/* STRIKETHROUGH PRICE */}
              {isStudent && standardPrice && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-neutral-500 text-sm font-bold line-through decoration-red-500/50 decoration-2">₹{standardPrice}</motion.div>
              )}
              <div className="flex items-baseline gap-1">
                 <span className={`text-4xl font-bold tracking-tight transition-colors duration-300 ${isStudent && !isFree ? "text-blue-400" : "text-white"}`}>₹{price}</span>
                 <span className="text-sm font-medium text-neutral-500">{period}</span>
              </div>
            </div>
            {!isFree && (
                <div className="flex flex-col mt-2">
                    <p className="text-[10px] text-neutral-400 font-medium">One-time payment. No subscription.</p>
                    <p className="text-[10px] text-white/60">{duration}.</p>
                </div>
            )}
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feat, i) => {
             const isExcluded = feat.startsWith("-");
             return (
                <li key={i} className={`flex items-start gap-3 text-sm ${isExcluded ? "text-neutral-600 line-through" : "text-neutral-300"}`}>
                  <div className={`mt-0.5 p-0.5 rounded-full ${isExcluded ? "bg-neutral-800 text-neutral-600" : isStudent ? "bg-blue-500/20 text-blue-300" : isPro ? "bg-indigo-500/20 text-indigo-300" : "bg-white/10 text-white"}`}>
                    {isExcluded ? <X size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                  </div>
                  {isExcluded ? feat.substring(1).trim() : feat}
                </li>
             );
          })}
        </ul>
        <button onClick={onButtonClick} className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border ${isStudent && !isFree ? "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20" : isPro ? "bg-gradient-to-r from-indigo-600 to-violet-600 border-white/20 text-white hover:brightness-110 shadow-lg" : isPlus ? "bg-white text-black border-white hover:bg-neutral-200" : "bg-neutral-800 text-white hover:bg-neutral-700 border-white/5"}`}>
          {buttonText} {isPro && <Zap size={16} />}
        </button>
      </motion.div>
    );
};

export default PricingCard;