import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

// --- Helper for the Kinetic Text Effect ---
const MarqueeRow = ({ text, direction, speed, isCenter, animControls, verticalDir = 0 }) => {
  const moveDir = direction === "left" ? -1 : 1;
  return (
    <motion.div
      style={{
        display: "flex",
        whiteSpace: "nowrap",
        gap: "2rem",
        opacity: isCenter ? 1 : 0.2, 
        fontWeight: isCenter ? 400 : 300, 
        fontSize: "10vw", 
        textTransform: "uppercase",
        lineHeight: 0.9,
        color: isCenter ? "#0d0d82" : "rgba(13, 13, 130, 0.1)", 
        rotate: isCenter ? 0 : moveDir * 2,
        fontFamily: "'Inter', sans-serif", 
      }}
      animate={
        isCenter
          ? animControls 
          : { 
              x: [0, moveDir * 1000], 
              y: [0, verticalDir * 200] 
            } 
      }
      transition={{
        x: { repeat: Infinity, duration: speed, ease: "linear" },
        y: { repeat: Infinity, duration: speed, ease: "linear" }
      }}
    >
      {[...Array(10)].map((_, i) => (
        <span key={i} className={isCenter ? "hero-text" : ""}>
          {text}
        </span>
      ))}
    </motion.div>
  );
};

export default function SectionBlue({ handleNavigation }) {
  const sectionRef = useRef(null);
  
  // 1. RE-TRIGGER LOGIC: Set 'once' to false so it detects every entry
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  const wrapperControls = useAnimation();
  const centerTextControls = useAnimation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      if (isInView) {
        // --- PLAY ANIMATION ---
        
        // 1. Reset manually to ensure chaos start
        await wrapperControls.set({ scale: 25, rotate: 10, opacity: 1 });
        
        // 2. Snap Zoom Out
        wrapperControls.start({
          scale: 1,
          rotate: 0,
          opacity: 1, // Ensure visible
          transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }, 
        });

        // 3. Reveal Button & Content after zoom settles
        setTimeout(() => {
          setShowContent(true);
        }, 1000);

      } else {
        // --- RESET ANIMATION (When scrolling away) ---
        setShowContent(false);
        wrapperControls.set({ scale: 25, rotate: 10, opacity: 0 }); // Hide/Reset
      }
    };
    sequence();
  }, [isInView, wrapperControls]);

  const rowFadeVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 1, delay: 0.8 } },
  };

  return (
    <section
      ref={sectionRef}
      className="
        fixed inset-0 
        flex flex-col items-center justify-center 
        text-[#0d0d82] 
        bg-[#9aa9ff] 
        z-[4] 
        rounded-t-[60px]
        overflow-hidden
      "
      style={{
        transform: `
          translateY(
            calc(
              max(0px, (3 - var(--scroll, 0)) * 150vh)
            )
          )
        `,
        transition: "transform 0s linear",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
        .font-inter-light { font-family: 'Inter', sans-serif; font-weight: 300; }
      `}</style>

      {/* ===========================================
          BACKGROUND: Kinetic Swarm "FOLIOFYX"
      =========================================== */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0"
        initial="initial"
        animate="animate"
      >
        <motion.div animate={wrapperControls}>
            {/* Top Chaos */}
            <motion.div variants={rowFadeVariants}>
               <MarqueeRow text="FOLIOFYX" direction="left" verticalDir={-1} speed={20} />
               <MarqueeRow text="FOLIOFYX" direction="right" verticalDir={1} speed={25} />
            </motion.div>

            {/* The Main Text (Will be replaced by final content) */}
            <div className="relative z-10 py-4">
              <motion.h1
                animate={centerTextControls}
                className="font-inter-light" 
                style={{
                    fontSize: "12vw",
                    fontWeight: 300, 
                    textTransform: "uppercase",
                    margin: 0,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    color: "#0d0d82",
                    // Fade out the chaotic text when the final clean content appears
                    opacity: showContent ? 0 : 1, 
                    transition: "opacity 0.5s ease"
                }}
              >
                FOLIOFYX
              </motion.h1>
            </div>

            {/* Bottom Chaos */}
            <motion.div variants={rowFadeVariants}>
               <MarqueeRow text="FOLIOFYX" direction="right" verticalDir={-1} speed={25} />
               <MarqueeRow text="FOLIOFYX" direction="left" verticalDir={1} speed={20} />
            </motion.div>
        </motion.div>
      </motion.div>

      {/* ===========================================
          FOREGROUND: Main Content (Final State)
      =========================================== */}
      <motion.div 
        className="relative z-10 flex flex-col items-center w-full h-full justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        
        {/* Top Icon */}
        <img className="absolute top-10 sm:top-16 w-[80px] sm:w-[100px] m-auto block opacity-80" src="ai.svg" alt="AI" />

        {/* Center Content Group */}
        <div className="flex flex-col items-center mt-20 sm:mt-0 text-center px-4">
            
            {/* Replaced Kinetic Text with the Clean Final Title */}
            <h2 className="text-5xl font-light sm:text-7xl text-center mb-10 leading-tight font-inter-light">
               Dream it. Design it.<br /> 
               <span className="font-normal">FolioFyX it.</span>
            </h2>
            
            <button
                onClick={() => handleNavigation("/create")}
                className="
                  bg-[#0d0d82] text-white 
                  px-8 py-3 sm:px-10 sm:py-4 
                  rounded-full text-lg sm:text-xl 
                  hover:scale-105 hover:bg-[#0a0a65]
                  transition-all duration-300 shadow-xl
                  font-inter-light font-normal
                "
            >
                Create Your Portfolio
            </button>
        </div>

        {/* Footer Area */}
        <div className="absolute flex items-center justify-center bottom-10 sm:bottom-14">
            <p className="font-inter-light text-sm sm:text-base relative bg-gradient-to-r from-[#0d0d82] via-[#1a1a1a] to-black bg-clip-text text-transparent animate-gradient-shine">
            Simplified by AI
            <img
                src="/ai.svg"
                alt="AI Icon"
                className="absolute -top-2 -right-4 w-4 h-4 sm:w-5 sm:h-5 opacity-90"
            />
            </p>
        </div>

        {/* Bottom Right Image */}
        <motion.img 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: showContent ? 0 : 100, opacity: showContent ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bottom-6 right-6 sm:bottom-10 sm:right-10 absolute w-[150px] sm:w-[200px] rounded-3xl shadow-lg rotate-[-5deg] hover:rotate-0 transition-transform duration-500" 
            src="fyx3.png" 
            alt="FolioFyX"
        />

      </motion.div>
    </section>
  );
}