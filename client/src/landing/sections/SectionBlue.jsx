import React from "react";
import { motion } from "framer-motion";

// --- CSS Animation Styles (Inline for simplicity) ---
const marqueeStyle = {
  display: "flex",
  gap: "4rem", // space between words
  width: "max-content",
  animation: "marquee 20s linear infinite", // CSS Animation
};

const keyframes = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

export default function SectionBlue({ handleNavigation }) {
  // Simple reveal animation for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } 
    }
  };

  return (
    <section
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#4F46E5] overflow-hidden rounded-t-[50px] z-[5] font-['Syne']"
      style={{
        transform: `translateY(calc(max(0px, (15.5 - var(--scroll, 0)) * 100vh)))`,
        willChange: "transform" // Critical for scroll performance
      }}
    >
      <style>{keyframes}</style>

      {/* --- LAYER 1: STATIC AMBIENT GLOW --- */}
      {/* Reduced blur radius to save GPU memory */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-white/10 rounded-full blur-[80px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-300/20 rounded-full blur-[80px] mix-blend-overlay" />
      </div>

      {/* --- LAYER 2: SMOOTH CSS MARQUEE --- */}
      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-10 pointer-events-none select-none overflow-hidden">
         <div style={marqueeStyle}>
            {/* We repeat the text enough times to fill the screen + buffer */}
            {[...Array(8)].map((_, i) => (
              <span key={i} className="text-[15vh] font-extrabold text-white leading-none">
                FOLIOFYX
              </span>
            ))}
         </div>
      </div>

      {/* --- LAYER 3: MAIN CARD --- */}
      <motion.div 
        className="relative z-20 w-full max-w-5xl px-6 flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // Triggers once nicely
        variants={cardVariants}
      >
        
        {/* GLASS CARD */}
        <div className="
            relative w-full backdrop-blur-xl bg-white/10
            rounded-[40px] border border-white/20
            p-8 md:p-14 text-center
            shadow-2xl
            overflow-hidden
        ">
            {/* Simple Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
               <img src="/ai.svg" alt="AI" className="w-8 h-8" />
            </div>

            {/* Typography */}
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Dream it. Design it.<br/>
                <span className="text-indigo-200">
                    FolioFYX it.
                </span>
            </h2>

            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 font-medium font-sans">
                Turn your ideas into a stunning reality. No coding required.<br className="hidden md:block"/> 
                Just pure creativity powered by AI.
            </p>

            {/* Button */}
            <button
                onClick={() => handleNavigation("/create")}
                className="
                    inline-flex items-center gap-2 px-8 py-4 
                    bg-white text-indigo-600 rounded-full 
                    font-bold text-lg 
                    hover:scale-105 transition-transform duration-200
                    shadow-lg
                "
            >
                Create Your Portfolio
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </button>
        </div>

        {/* FLOATING LOGO */}
        <motion.img 
            src="/logow.png" 
            alt="FolioFyX"
            className="absolute -bottom-10 -left-6 md:-left-12 w-32 md:w-40 drop-shadow-xl z-30 pointer-events-none"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
        />

      </motion.div>

    </section>
  );
}