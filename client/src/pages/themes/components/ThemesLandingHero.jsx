import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCcw, Filter } from "lucide-react";
import MarqueeRow from "./MarqueeRow";

// Tags data
const themeTags = [
  "Minimal", "Agency", "Modern", "Parallax", "Dark Mode", "Creative",
];

// --- Animation Variants (Defined outside component for performance) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const bgVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.5, ease: "easeOut" }
  }
};

const ThemesLandingHero = ({
  handleStart,
  searchTerm,
  setSearchTerm,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Helper to split text for animation
  const splitText = (text) => text.split(" ").map((word, i) => (
    <motion.span key={i} variants={itemVariants} className="inline-block mr-2">
      {word}
    </motion.span>
  ));

  const handleTagClick = (tag) => setSearchTerm(tag);
  const handleReload = () => setSearchTerm("");

  return (
    <div className="relative flex flex-col items-center text-center text-black bg-white overflow-hidden rounded-b-[3rem] min-h-[60vh] pt-40 pb-16">
      
      {/* --- 1. Background Layer (Optimized) --- */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 opacity-[0.04]"
        initial="hidden"
        animate="visible"
        variants={bgVariants}
      >
        <MarqueeRow direction="left" speed={40} />
        <MarqueeRow direction="right" speed={50} />
        {/* Removed vertical chaos for better performance */}
      </motion.div>

      {/* --- 2. Foreground Content --- */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          {splitText("Discover Top Designs for Your Website")}
        </h1>

        {/* Subtext */}
        <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Find the perfect style for your portfolio among our professionally designed templates. 
          Launch your site with our AI builder instantly.
        </motion.p>

        {/* Search Section */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col gap-4">
            
            {/* Search Input */}
            <motion.div 
              className={`
                flex items-center gap-4 bg-white rounded-full px-5 py-4 
                shadow-[0_4px_30px_rgba(0,0,0,0.03)] border transition-all duration-300
                ${isFocused ? "border-black ring-1 ring-black/5 scale-[1.02]" : "border-gray-200 hover:border-gray-300"}
              `}
            >
              <Search size={20} className="text-gray-400 shrink-0" />
              
              <input
                type="text"
                placeholder="Search themes (e.g., Minimal, Modern, Student...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-transparent flex-1 outline-none text-gray-800 placeholder-gray-400 text-base"
              />

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-100">
                <button onClick={handleReload} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <RefreshCcw size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div className="flex gap-2 flex-wrap justify-center mt-2">
              {themeTags.map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-600 shadow-sm transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThemesLandingHero;