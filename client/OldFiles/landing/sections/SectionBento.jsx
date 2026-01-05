import React from "react";
import { motion } from "framer-motion";

// --- MOCK DATA FOR TEMPLATES ---
const TEMPLATES = [
  { id: 1, title: "Algo", tag: "SaaS", color: "#E11D48", src: "/preview/veloura/whiteMobile.png" },
  { id: 2, title: "Lumina", tag: "Web3", color: "#7C3AED", src: "/preview/luxe/blackMobile.png" },
  { id: 3, title: "Brand", tag: "Identity", color: "#2563EB", src: "/preview/neonix/whiteMobile.png" },
  { id: 4, title: "Data", tag: "AI", color: "#000000", src: "/preview/neonix/whiteMobile.png" },
  { id: 5, title: "Velour", tag: "Fashion", color: "#DB2777", src: "/preview/theEra/blackMobile.png" },
  { id: 6, title: "Haptic", tag: "Mobile", color: "#EA580C", src: "/preview/plexis/blackMobile.png" },
  { id: 7, title: "Sonar", tag: "Audio", color: "#10B981", src: "/preview/pulse/whiteMobile.png" },
  { id: 9, title: "Flow", tag: "Agency", color: "#3B82F6", src: "/preview/theEra/blackMobile3.png" },
  { id: 10, title: "Orbit", tag: "Startup", color: "#059669", src: "/preview/plexis/whiteMobile.png" },

];

// 1. REUSABLE MOBILE CARD COMPONENT
const MobileCard = ({ src, title, subtitle, color }) => (
  <div className="relative group w-full aspect-[9/18] rounded-[40px] overflow-hidden border-[8px] border-[#121212] bg-[#050505] shadow-2xl shadow-black/50 transform transition-all duration-700 hover:scale-[1.03] hover:shadow-purple-500/20">

    {/* Screen Content (Image) */}
    <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[30px]">
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />

      {/* Mobile Status Bar Hint */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Dark Overlay Gradient (Fade out on hover) */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
    </div>

    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-center text-center z-20">
      <motion.div
        className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-4 border border-white/20 backdrop-blur-xl shadow-lg"
        style={{ backgroundColor: color, color: '#fff' }}
        whileHover={{ scale: 1.1 }}
      >
        {subtitle}
      </motion.div>
      <h3 className="text-4xl font-black text-white leading-none mb-2 drop-shadow-lg">{title}</h3>
      <p className="text-xs text-white/70 font-bold uppercase tracking-widest">FolioFyX Template</p>
    </div>
  </div>
);

const SectionBento = ({ scrollProgress = 0 }) => {
  // CONFIGURATION: Controls the Parallax Feel
  const START_OFFSET = 0.8;
  // Adjusted speeds from previous fix to ensure bottom scrolling
  const SPEED_FAST = 55;
  const SPEED_SLOW = 35;

  const activeScroll = Math.max(0, scrollProgress - START_OFFSET);

  return (
    <div className="w-full h-full bg-[#030303] text-white overflow-hidden flex flex-col relative py-10">

      {/* 1. HEADER - FIXED VISIBILITY */}
      <div className="absolute top-0 left-0 w-full z-30 pt-32 pb-20 px-6 md:px-12 bg-gradient-to-b from-[#030303] via-[#030303]/90 to-transparent pointer-events-none">
        <div className="max-w-[1800px] mx-auto text-center">
          <motion.div
            // FIX: Removed 'whileInView' which breaks in fixed containers.
            // Switched to simple 'animate' so it is always visible once rendered.
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Wrapped in a flex col div to ensure the button centers easily beneath text */}
            <div className="flex flex-col items-center text-center">
              {/* 1. Header and Image Alignment & Size Decrease */}
              {/* Changed text-6xl/7xl to text-4xl/5xl. Added flex to align image next to text. */}
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5 text-white leading-tight flex items-center justify-center gap-3">
                Built with
                {/* Removed absolute positioning. Added specific heights so it sits perfectly beside text */}
                <img className="h-8 md:h-12 w-auto object-contain " src="/logow.png" alt="Logo" />
              </h2>

              {/* 2. Paragraph Size Decrease */}
              {/* Changed text-xl/2xl to text-base/lg. Added mb-8 for spacing above button. */}
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                Explore thousands of mobile-first portfolios created by our community. <br className="hidden md:block" />
                Design that adapts to every screen, instantly.
              </p>

              {/* 3. New Button Added */}
              <button className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 font-['Wix_Madefor_Text'] rounded-full hover:bg-purple-700 hover:scale-105 shadow-lg shadow-purple-500/30">
                Explore Templates
                {/* Arrow icon that moves slightly on hover */}
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. MOBILE SCREEN COLUMNS (Parallax) */}
      <div className="flex-1 px-4 mt-12 md:px-8 overflow-hidden flex items-start justify-center gap-6 md:gap-12 h-[150vh] origin-top">

        {/* --- COLUMN 1 (LEFT - SLOW) --- */}
        <div
          className="w-1/3 md:w-[28%] flex flex-col gap-8 md:gap-16 pt-48 will-change-transform opacity-80 hover:opacity-100 transition-opacity duration-500"
          style={{ transform: `translateY(${-activeScroll * SPEED_SLOW}vh)` }}
        >
          {TEMPLATES.slice(0, 3).map((item) => (
            <MobileCard
              key={item.id}
              src={item.src}
              title={item.title}
              subtitle={item.tag}
              color={item.color}
            />
          ))}
        </div>

        {/* --- COLUMN 2 (MIDDLE - FAST & FOCUSED) --- */}
        <div
          className="w-1/3 md:w-[28%] flex flex-col gap-8 md:gap-16 pt-96 will-change-transform z-10"
          style={{ transform: `translateY(${-activeScroll * SPEED_FAST}vh)` }}
        >
          {TEMPLATES.slice(3, 6).map((item) => (
            <MobileCard
              key={item.id}
              src={item.src}
              title={item.title}
              subtitle={item.tag}
              color={item.color}
            />
          ))}
        </div>

        {/* --- COLUMN 3 (RIGHT - SLOW) --- */}
        <div
          className="w-1/3 md:w-[28%] flex flex-col gap-8 md:gap-16 pt-48 will-change-transform opacity-80 hover:opacity-100 transition-opacity duration-500"
          style={{ transform: `translateY(${-activeScroll * SPEED_SLOW}vh)` }}
        >
          {TEMPLATES.slice(6, 9).map((item) => (
            <MobileCard
              key={item.id}
              src={item.src}
              title={item.title}
              subtitle={item.tag}
              color={item.color}
            />
          ))}
        </div>

      </div>

      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none" />
    </div>
  );
};

export default SectionBento;