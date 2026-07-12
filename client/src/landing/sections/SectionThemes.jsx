import React, { useRef } from "react";
import { motion, useTransform, useInView } from "framer-motion";
import { ArrowRight, LayoutGrid, Zap, Moon, MousePointer2 } from "lucide-react";

// --- OPTIMIZED MARQUEE ---
// CSS animation with play-state gating: paused (zero cost) while the section
// is parked offscreen, resumes in place when it scrolls into view.
const MarqueeRow = ({ text, direction, speed, paused }) => {
  return (
    <div className="relative flex overflow-hidden -rotate-[5deg] py-4 bg-transparent pointer-events-none select-none opacity-10" style={{ transform: "translateZ(0)" }}>
      <div
        className="flex whitespace-nowrap gap-24 will-change-transform"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          animation: `fyxThemesScroll ${speed}s linear infinite`,
          animationDirection: direction === "left" ? "normal" : "reverse",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="font-black text-[10vw] leading-none tracking-tighter uppercase text-black">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function SectionThemes({ scrollProgress, handleNavigation }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.05 });
  
  // --- ANIMATION TRIGGERS ---
  // The section is fully in view at 19 on the Landing.jsx timeline; the
  // internal reveals play right after arrival, well before the outro at 21.
  const titleY = useTransform(scrollProgress, [19, 19.3], [50, 0], { clamp: true });
  const titleOpacity = useTransform(scrollProgress, [19, 19.2], [0, 1], { clamp: true });

  const themesY = useTransform(scrollProgress, [19, 19.6], ["30%", "0%"], { clamp: true });
  const blocksY = useTransform(scrollProgress, [19.3, 19.9], ["40%", "0%"], { clamp: true });
  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#F3F4F6] overflow-hidden flex flex-col justify-center py-8 rounded-t-[60px] shadow-[0_-50px_100px_rgba(0,0,0,0.1)] font-['Switzer'] will-change-transform">
      <style>{`
        @keyframes fyxThemesScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-1000px); }
        }
      `}</style>

      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none" style={{ transform: "translateZ(0)" }}>
        <MarqueeRow text="ESTHETIC" direction="left" speed={60} paused={!inView} />
        <MarqueeRow text="MOTION" direction="right" speed={70} paused={!inView} />
        <MarqueeRow text="LAYOUT" direction="left" speed={50} paused={!inView} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        
        {/* HEADER */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="flex flex-col md:flex-row justify-between items-end mb-10 shrink-0 will-change-transform"
        >
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-black/40 mb-3 block">
              Curated Collections
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-black">
              DESIGN THAT <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-400">
                SPEAKS.
              </span>
            </h2>
          </div>
          <button 
            onClick={() => handleNavigation("/designs")}
            className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 text-black hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            Explore Collections <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-col gap-6 h-[65vh]">
          
          {/* --- TOP ROW: THEMES --- */}
          <motion.div 
            style={{ y: themesY }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-[2] min-h-0 will-change-transform"
          >
            <ThemeCard
              title="Minimalist"
              tag="CLEAN"
              img="/preview/veloura/vel.png"
              onSelect={() => handleNavigation("/create?theme=minimalist")}
            />
            <ThemeCard
              title="Creative"
              tag="BOLD"
              img="/preview/pulse/pulse1.png" 
              isDark
              onSelect={() => handleNavigation("/create?theme=creative")}
            />
          </motion.div>

          {/* --- BOTTOM ROW: UI HIGHLIGHT BLOCKS --- */}
          <motion.div 
            style={{ y: blocksY }} 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-h-[120px] will-change-transform"
          >
            <FeatureBlock title="Dark Mode" sub="Easy on eyes" icon={<Moon size={20} />} />
            <FeatureBlock title="Grid System" sub="Pixel perfect" icon={<LayoutGrid size={20} />} />
            <FeatureBlock title="Fluid Motion" sub="60fps anims" icon={<Zap size={20} />} />
            <FeatureBlock title="Interactive" sub="Engage users" icon={<MousePointer2 size={20} />} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENTS ---

const FeatureBlock = ({ title, sub, icon }) => (
  <div className="bg-white text-black rounded-[24px] p-5 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300 border border-black/5 shadow-lg cursor-default relative overflow-hidden will-change-transform">
      <div className="absolute top-4 right-4 text-black/20 group-hover:text-black/80 transition-colors">
         {icon}
      </div>
      <div className="mt-auto relative z-10">
         <h4 className="text-lg font-bold mb-0.5">{title}</h4>
         <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">{sub}</p>
      </div>
  </div>
);

const ThemeCard = ({ title, tag, img, isDark, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`relative group w-full h-full rounded-[32px] overflow-hidden ${isDark ? "bg-[#111]" : "bg-white"} shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-black/5 will-change-transform`}
  >
    <div className="absolute top-0 left-0 w-full h-14 z-20 flex items-center px-6 gap-2">
       <div className={`w-3 h-3 rounded-full ${isDark ? "bg-white/20" : "bg-black/10"}`} />
       <div className={`w-3 h-3 rounded-full ${isDark ? "bg-white/20" : "bg-black/10"}`} />
       <div className="ml-auto">
         <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md ${isDark ? "bg-white/10 text-white" : "bg-black/5 text-black"}`}>
           {tag}
         </span>
       </div>
    </div>

    <div className="absolute inset-0 w-full h-full">
        <img
            src={img}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient + title only on hover — the preview stays clean otherwise
            (the always-on labels used to collide with the template content). */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black/90 via-black/20" : "from-black/60 via-transparent"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>

    <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
      <div>
         <h3 className="text-3xl md:text-5xl font-black text-white mb-1">{title}</h3>
         <p className="text-xs md:text-sm text-gray-300 opacity-80 font-medium">
           Professional & Clean
         </p>
      </div>

      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 hover:scale-110">
         <ArrowRight size={20} />
      </div>
    </div>
  </div>
);