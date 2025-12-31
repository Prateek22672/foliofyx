import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import HeroMarquee from "../sections/HeroMarquee"; 

// Define your background images here
const bgImages = [
  "/themes/talentbg.jpg",  // Index 0 (Light Theme)
  "wallpap.jpg",           // Index 1 (Dark Theme)
  "/image2.jpg",           // Index 2 (Light Theme)
  "/image1.png"            // Index 3 (Light Theme)
];

// --- REUSABLE ANIMATED BUTTON COMPONENT ---
const InteractiveButton = ({ text, onClick, isDarkBg, isLeftButton }) => {
  const [isHovered, setIsHovered] = useState(false);

  // --- COLOR PALETTES ---
  const palette = isDarkBg
    ? {
        // DARK MODE (Background is Black/Dark)
        filled: { 
          bg: "#ffffff", 
          text: "#000000", 
          border: "#ffffff", 
          iconBg: "rgba(0,0,0,0.1)", 
          iconText: "#000000" 
        },
        outline: { 
          bg: "transparent", 
          text: "#ffffff", 
          border: "rgba(255,255,255,0.3)", 
          hoverBorder: "#ffffff", // Brighter border on hover
          iconBg: "rgba(255,255,255,0.1)", 
          iconText: "#ffffff" 
        },
        accent: { 
          bg: "#ccff00", // Lime Green for "Create" hover
          text: "#000000", 
          border: "#ccff00", 
          iconBg: "#ffffff", 
          iconText: "#000000" 
        }
      }
    : {
        // LIGHT MODE (Background is White/Light)
        filled: { 
          bg: "#000000", 
          text: "#ffffff", 
          border: "#000000", 
          iconBg: "rgba(255,255,255,0.2)", 
          iconText: "#ffffff" 
        },
        outline: { 
          bg: "transparent", 
          text: "#000000", 
          border: "rgba(0,0,0,0.15)", 
          hoverBorder: "#000000",
          iconBg: "rgba(0,0,0,0.05)", 
          iconText: "#000000" 
        },
        accent: { 
          bg: "#000000", // Black for "Create" hover in light mode
          text: "#ffffff", 
          border: "#000000", 
          iconBg: "#333333", 
          iconText: "#ffffff" 
        }
      };

  // --- LOGIC: DETERMINE CURRENT STYLES ---
  let activeStyle = {};

  if (isLeftButton) {
    // LEFT BUTTON: Default = Filled -> Hover = Outline
    if (isHovered) {
        activeStyle = {
            ...palette.outline,
            border: palette.outline.hoverBorder // Make border solid on hover
        };
    } else {
        activeStyle = palette.filled;
    }
  } else {
    // RIGHT BUTTON: Default = Outline -> Hover = Accent/Filled
    if (isHovered) {
        activeStyle = palette.accent;
    } else {
        activeStyle = palette.outline;
    }
  }

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ 
        borderColor: activeStyle.border,
        backgroundColor: activeStyle.bg,
        color: activeStyle.text
      }}
      className={`
        relative flex items-center gap-3 px-2 py-2 rounded-full border backdrop-blur-md transition-colors duration-300
        ${isHovered ? "pl-6 pr-2" : "pl-2 pr-6"} /* Padding shift for swap effect */
      `}
    >
       <AnimatePresence mode="popLayout" initial={false}>
          
          {/* ICON CIRCLE */}
          <motion.div 
             layout="position" 
             key="icon-circle"
             className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
                ${isHovered ? "order-2" : "order-1"} 
             `}
             style={{
                backgroundColor: activeStyle.iconBg,
                color: activeStyle.iconText
             }}
          >
             {!isLeftButton ? (
                // Lightning Icon for Right Button (Create)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
             ) : (
                // Arrow Icon for Left Button (Recents)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
             )}
          </motion.div>

          {/* TEXT */}
          <motion.span 
             layout="position"
             key="btn-text"
             className={`
                text-sm font-bold tracking-wide whitespace-nowrap
                ${isHovered ? "order-1 mr-auto" : "order-2 ml-2"}
             `}
          >
             {text}
          </motion.span>

       </AnimatePresence>
    </motion.button>
  );
};

export default function SectionHero({ message, handleNavigation }) {
  const [showContent, setShowContent] = useState(false);
  const [startMarquee, setStartMarquee] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0); 

  // Animation Controls
  const wrapperControls = useAnimation();
  const centerTextControls = useAnimation();

  // Background Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  // Only the 2nd image (index 1) is treated as a Dark Background
  const isDarkBg = currentBgIndex === 1; 
  const textColor = isDarkBg ? "text-white" : "text-black";

  // Word Fading Logic
  const wordVariants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
  };

  const fadeWords = (text) =>
    text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={wordVariants}
        className="inline-block"
      >
        {word}&nbsp;
      </motion.span>
    ));

  // The "We Build" Effect Sequence
  useEffect(() => {
    const sequence = async () => {
      await wrapperControls.set({ scale: 4.5, rotate: 15, x: 0, y: 0 });
      setTimeout(() => setStartMarquee(true), 800);

      await wrapperControls.start({
        scale: 1,
        rotate: 0,
        transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
      });

      centerTextControls.start({
        x: "35vw", 
        y: "45vh", 
        scale: 0.3,
        opacity: 0.10, 
        transition: { duration: 2, ease: "easeInOut", delay: 0.2 },
      });

      setShowContent(true);
    };

    sequence();
  }, [wrapperControls, centerTextControls]);

  const rowFadeVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 0.2, transition: { duration: 1.5, delay: 1 } },
  };

  return (
    <section className={`fixed inset-0 h-[100dvh] w-full flex flex-col items-center justify-center text-center ${textColor} overflow-hidden font-[Switzer]`}>
      
      {/* BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        {bgImages.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Background ${index}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentBgIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ filter: "blur(45px) brightness(1.3)" }}
          />
        ))}
      </div>
      
      {/* OVERLAY */}
      <div className={`absolute inset-0 ${isDarkBg ? "bg-black/60" : "bg-white/60"} -z-[5] pointer-events-none transition-colors duration-1000`}></div>

      {/* ANIMATED BACKGROUND EFFECT (WE BUILD) */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0"
        initial="initial"
        animate="animate"
      >
        <motion.div
          animate={wrapperControls}
          className="relative"
          style={{ willChange: "transform" }} 
        >
          <motion.div variants={rowFadeVariants}>
            <HeroMarquee direction="left" speed={25} startScrolling={startMarquee} />
            <HeroMarquee direction="right" speed={30} startScrolling={startMarquee} />
          </motion.div>

          <div className="relative z-10">
            <motion.h1
              animate={centerTextControls}
              style={{
                fontSize: "10vw",
                fontWeight: 900,
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 0.8,
                whiteSpace: "nowrap",
                letterSpacing: "-0.05em",
                willChange: "transform",
                fontFamily: "Switzer, sans-serif",
              }}
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

      {/* FOREGROUND CONTENT */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6"
        >
          {/* Main Content Block */}
          <div className="flex flex-col items-center justify-center w-full max-w-4xl -mt-12 sm:mt-0">
            
            {/* Notification Message */}
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 ${isDarkBg ? "bg-white/10 text-white border-white/20" : "bg-black/5 text-black border-black/10"} border backdrop-blur-md px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm`}
              >
                {message}
              </motion.div>
            )}

            {/* Headline */}
            <h1 className={`text-4xl sm:text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6 mt-10 ${textColor} tracking-tight`}>
              {fadeWords("Build a Stunning Portfolio Website")}
              <br className="hidden sm:block" />
              {fadeWords(" in Minutes, Powered by AI.")}
            </h1>

            {/* Subtitle */}
            <p className={`text-base sm:text-lg md:text-xl ${isDarkBg ? "text-white/80" : "text-black/80"} max-w-2xl mx-auto mb-10 font-medium leading-relaxed`}>
              {fadeWords(
                "Design your online identity with AI-crafted layouts, auto-generated content, and effortless customization — all in a single click."
              )}
            </p>

            {/* --- NEW ANIMATED CTA BUTTONS --- */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1, duration: 0.8 }}
               className="flex flex-col sm:flex-row w-full sm:w-auto gap-5 items-center justify-center"
            >
              {/* Button 1: Left (Recents) - STARTS FILLED */}
              <InteractiveButton 
                 text="View Your Recents" 
                 onClick={() => handleNavigation("/dashboard")} 
                 isDarkBg={isDarkBg}
                 isLeftButton={true} 
              />

              {/* Button 2: Right (Create) - STARTS OUTLINE */}
              <InteractiveButton 
                 text="Create Website" 
                 onClick={() => handleNavigation("/create")} 
                 isDarkBg={isDarkBg}
                 isLeftButton={false} 
              />
            </motion.div>

          </div>

          {/* FOOTER LINE */}
          <div className="absolute bottom-35 sm:bottom-8 left-0 w-full px-6">
            <p className={`text-[9px] opacity-5 sm:text-[10px] ${isDarkBg ? "text-white/60" : "text-black/60"} tracking-[0.2em] uppercase font-bold`}>
              A Prateek’s Product — Where Ideas Meet Passion.
            </p>
            <p className={`mt-1 text-[11px] sm:text-sm ${isDarkBg ? "text-white/80" : "text-black/80"} italic font-medium`}>
              “Your story deserves a portfolio that feels alive.”
            </p>
          </div>

        </motion.div>
      )}
    </section>
  );
}