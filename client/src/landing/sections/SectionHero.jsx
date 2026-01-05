import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import HeroMarquee from "../sections/HeroMarquee"; 

const bgImages = [
  "/themes/talentbg.jpg", 
  "wallpap.jpg", 
  "/image2.jpg", 
  "/image1.png" 
];

// --- BUTTON COMPONENT ---
const InteractiveButton = ({ text, onClick, isDarkBg, isLeftButton }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Palettes
  const palette = isDarkBg
    ? { filled: { bg: "#ffffff", text: "#000000", border: "#ffffff", iconBg: "rgba(0,0,0,0.1)", iconText: "#000000" }, outline: { bg: "transparent", text: "#ffffff", border: "rgba(255,255,255,0.3)", hoverBorder: "#ffffff", iconBg: "rgba(255,255,255,0.1)", iconText: "#ffffff" }, accent: { bg: "#ccff00", text: "#000000", border: "#ccff00", iconBg: "#ffffff", iconText: "#000000" } }
    : { filled: { bg: "#000000", text: "#ffffff", border: "#000000", iconBg: "rgba(255,255,255,0.2)", iconText: "#ffffff" }, outline: { bg: "transparent", text: "#000000", border: "rgba(0,0,0,0.15)", hoverBorder: "#000000", iconBg: "rgba(0,0,0,0.05)", iconText: "#000000" }, accent: { bg: "#000000", text: "#ffffff", border: "#000000", iconBg: "#333333", iconText: "#ffffff" } };

  let activeStyle = {};
  if (isLeftButton) { activeStyle = isHovered ? { ...palette.outline, border: palette.outline.hoverBorder } : palette.filled; } 
  else { activeStyle = isHovered ? palette.accent : palette.outline; }

  return (
    <motion.button onClick={onClick} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} layout transition={{ type: "spring", stiffness: 400, damping: 30 }} style={{ borderColor: activeStyle.border, backgroundColor: activeStyle.bg, color: activeStyle.text }} className={`relative flex items-center gap-3 px-2 py-2 rounded-full border backdrop-blur-md transition-colors duration-300 ${isHovered ? "pl-6 pr-2" : "pl-2 pr-6"}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div layout="position" key="icon-circle" className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isHovered ? "order-2" : "order-1"}`} style={{ backgroundColor: activeStyle.iconBg, color: activeStyle.iconText }}>
          {!isLeftButton ? ( <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> ) : ( <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> )}
        </motion.div>
        <motion.span layout="position" key="btn-text" className={`text-sm font-bold tracking-wide whitespace-nowrap ${isHovered ? "order-1 mr-auto" : "order-2 ml-2"}`}>{text}</motion.span>
      </AnimatePresence>
    </motion.button>
  );
};

export default function SectionHero({ message, handleNavigation }) {
  const [showContent, setShowContent] = useState(false);
  const [startMarquee, setStartMarquee] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0); 

  // --- ANIMATION CONTROLS ---
  const wrapperControls = useAnimation(); 
  const centerTextControls = useAnimation(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const isDarkBg = currentBgIndex === 1; 
  const textColor = isDarkBg ? "text-white" : "text-black";

  const shimmerStyle = {
    backgroundImage: isDarkBg 
        ? "linear-gradient(to right, #ffffff 0%, #ffffff 40%, #9ca3af 50%, #ffffff 60%, #ffffff 100%)" 
        : "linear-gradient(to right, #000000 0%, #000000 40%, #6b7280 50%, #000000 60%, #000000 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    animation: "shine 8s linear infinite",
    display: "inline-block"
  };

  const fadeWords = (text, customStyle = {}) =>
    text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: index * 0.12, duration: 0.6 }}
        className="inline-block"
        style={customStyle}
      >
        {word}&nbsp;
      </motion.span>
    ));

  // --- THE ZOOM & SPLIT SEQUENCE ---
  useEffect(() => {
    const sequence = async () => {
      await wrapperControls.set({ scale: 5, rotate: 0 }); 
      await centerTextControls.set({ x: 0, y: 0, scale: 1, opacity: 1 });

      setTimeout(() => setStartMarquee(true), 800);

      await wrapperControls.start({ 
        scale: 1, 
        rotate: 0, 
        transition: { duration: 2.2, ease: [0.16, 1, 0.3, 1] } 
      });

      centerTextControls.start({ 
        x: "-40vw", 
        y: "40vh", 
        scale: 0.35, 
        opacity: 0.15, 
        transition: { duration: 1.5, ease: "easeInOut" } 
      });

      setShowContent(true);
    };
    sequence();
  }, [wrapperControls, centerTextControls]);

  const rowFadeVariants = { initial: { opacity: 1 }, animate: { opacity: 0.2, transition: { duration: 1.5, delay: 1 } } };

  return (
    <section className={`fixed inset-0 h-[100dvh] w-full flex flex-col items-center justify-center text-center ${textColor} overflow-hidden font-[Switzer]`}>
      <style>{`@keyframes shine { to { background-position: 200% center; } }`}</style>

      {/* 1. BACKGROUND IMAGES */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        {bgImages.map((src, index) => (
          <motion.img key={index} src={src} className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: index === currentBgIndex ? 1 : 0 }} transition={{ duration: 1.5 }} style={{ filter: "blur(20px) brightness(1.3)" }} />
        ))}
      </div>
      <div className={`absolute inset-0 ${isDarkBg ? "bg-black/60" : "bg-white/60"} -z-[5] pointer-events-none`}></div>

      {/* 2. BACKGROUND ANIMATION LAYER */}
      <motion.div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0" initial="initial" animate="animate">
        <motion.div animate={wrapperControls} className="relative flex flex-col items-center justify-center w-full h-full" style={{ willChange: "transform" }}>
          
          <motion.div variants={rowFadeVariants}>
            <HeroMarquee direction="left" speed={25} startScrolling={startMarquee} />
            <HeroMarquee direction="right" speed={30} startScrolling={startMarquee} />
          </motion.div>

          {/* WE BUILD CONTAINER */}
          <div className="relative z-10 flex items-center justify-center w-full">
            <motion.h1 
              animate={centerTextControls} 
              style={{ fontSize: "9vw", fontWeight: 900, position: "absolute", whiteSpace: "nowrap" }}
            >
              WE BUILD
            </motion.h1>
          </div>

          <motion.div variants={rowFadeVariants}>
            <HeroMarquee direction="right" speed={30} startScrolling={startMarquee} />
            <HeroMarquee direction="left" speed={25} startScrolling={startMarquee} />
          </motion.div>

        </motion.div>
      </motion.div>

      {/* 3. NEW: THE GIANT GLOWING "2026" */}
      {showContent && (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ 
                opacity: isDarkBg ? 0.05 : 0.08, 
                scale: 1, 
                filter: "blur(0px)" 
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden"
        >
            <h1 className={`text-[28vw] font-black tracking-tighter select-none ${isDarkBg ? "text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]" : "text-black drop-shadow-[0_0_50px_rgba(0,0,0,0.1)]"}`}>
                2026
            </h1>
        </motion.div>
      )}

      {/* 4. FOREGROUND CONTENT */}
      {showContent && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center justify-center w-full max-w-5xl -mt-12 sm:mt-0">
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 ${isDarkBg ? "bg-white/10 text-white border-white/20" : "bg-black/5 text-black border-black/10"} border backdrop-blur-md px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm`}>
                {message}
              </motion.div>
            )}

            <h1 className={`text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] mb-8 mt-10 ${textColor} tracking-tighter uppercase relative`}>
              <div>{fadeWords("BUILD A PORTFOLIO")}</div>
              <div className="mt-2">
                {fadeWords("THAT GETS YOU HIRED.", shimmerStyle)}
              </div>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl ${isDarkBg ? "text-white/80" : "text-black/80"} max-w-2xl mx-auto mb-10 font-normal leading-relaxed`}>
              {fadeWords("Stop sending boring PDF resumes. Create a stunning, AI-powered portfolio website in minutes. Stand out from the crowd.")}
            </p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="flex flex-col sm:flex-row w-full sm:w-auto gap-5 items-center justify-center">
              <InteractiveButton text="View Examples" onClick={() => handleNavigation("/templates")} isDarkBg={isDarkBg} isLeftButton={true} />
              <InteractiveButton text="Start Creating" onClick={() => handleNavigation("/create")} isDarkBg={isDarkBg} isLeftButton={false} />
            </motion.div>
          </div>
          
          {/* ============================================== */}
          {/* SCROLL TO EXPLORE (DESKTOP) - RIGHT SIDE       */}
          {/* ============================================== */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className={`hidden md:flex absolute right-8 bottom-32 flex-col items-end gap-3 z-30 ${isDarkBg ? "text-white" : "text-black"}`}
          >
             <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Scroll to explore</span>
             <div className={`w-32 h-1 rounded-full overflow-hidden ${isDarkBg ? "bg-white/20" : "bg-black/10"}`}>
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "35%" }}
                  transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${isDarkBg ? "bg-white" : "bg-black"}`} 
                />
             </div>
          </motion.div>

          {/* ============================================== */}
          {/* FOOTER BRANDING - CENTERED                     */}
          {/* ============================================== */}
          <div className="absolute bottom-12 left-0 w-full px-6">
            <p className={`text-[9px] opacity-5 sm:text-[10px] ${isDarkBg ? "text-white/60" : "text-black/60"} tracking-[0.2em] uppercase font-bold`}>A Prateek’s Product — Where Ideas Meet Passion.</p>
            <p className={`mt-1 text-[11px] sm:text-sm ${isDarkBg ? "text-white/80" : "text-black/80"} italic font-medium`}>“Your story deserves a portfolio that feels alive.”</p>
          </div>

        </motion.div>
      )}
    </section>
  );
}