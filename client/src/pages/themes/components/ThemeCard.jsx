import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";

const ThemeCard = ({ theme, index, handleStart, openPreview }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col gap-4 cursor-pointer"
      onClick={() => openPreview(theme)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        <img
          src={theme.image}
          alt={theme.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
           <button className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             View Details
           </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
            {!theme.available && (
                <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>
            )}
            {theme.themeKey === 'studentbright' || theme.themeKey === 'plexis' ? (
                 <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded">STUDENT PICK</span>
            ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {theme.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {theme.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if(theme.available) handleStart(theme.themeKey);
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
            theme.available 
             ? "border-gray-200 text-gray-400 hover:border-black hover:bg-black hover:text-white"
             : "border-transparent bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
           {theme.available ? <ArrowUpRight size={16} /> : <Lock size={14} />}
        </button>
      </div>
    </motion.div>
  );
};

export default ThemeCard;