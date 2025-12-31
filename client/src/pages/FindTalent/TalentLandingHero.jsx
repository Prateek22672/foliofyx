import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import MarqueeRow from "../themes/components/MarqueeRow";

export default function TalentLandingHero({ handleStart }) {
  const [showContent, setShowContent] = useState(false);

  const wrapperControls = useAnimation();
  const centerTextControls = useAnimation();

  // Helper function to animate words fading in (Premium Style)
  const fadeWords = (text) =>
    text.split(" ").map((word, index) => (
      <span
        key={index}
        className="inline-block opacity-0 animate-wordFade"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {word}&nbsp;
      </span>
    ));

  // The "Effect" Sequence
  useEffect(() => {
    const sequence = async () => {
      // 1. Initial State: Zoomed In & Tilted
      await wrapperControls.set({ scale: 4, rotate: 10, opacity: 0 });

      // 2. Animation: Zoom Out to Normal
      wrapperControls.start({
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
      });

      // 3. Text Animation: Moves from center to being a "Background Title"
      centerTextControls.start({
        y: "-12vh", // Move up
        scale: 1.2, // Keep it large
        opacity: 0.05, // Fade it out to be a watermark
        filter: "blur(2px)", // Subtle blur for depth
        transition: { duration: 2, ease: "easeInOut", delay: 0.2 },
      });

      // 4. Reveal Foreground Content
      setTimeout(() => setShowContent(true), 1200);
    };

    sequence();
  }, [wrapperControls, centerTextControls]);

  return (
    <div className="relative flex flex-col items-center justify-center text-center bg-white overflow-hidden min-h-[75vh] pt-20">
      
      {/* --- BACKGROUND ANIMATION LAYER --- */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center z-0 pointer-events-none"
        animate={wrapperControls}
      >
        {/* Top Marquee (Subtle Gray) */}
        <div className="opacity-20 grayscale">
           <MarqueeRow direction="left" verticalDir={-1} speed={20} />
        </div>

        {/* THE BIG ANIMATED TEXT */}
        <div className="relative z-10 py-10">
          <motion.h1
            animate={centerTextControls}
            className="text-[12vw] font-black tracking-tighter text-black uppercase leading-none select-none whitespace-nowrap"
          >
            FIND TALENT
          </motion.h1>
        </div>

        {/* Bottom Marquee (Subtle Gray) */}
        <div className="opacity-20 grayscale">
           <MarqueeRow direction="right" verticalDir={1} speed={25} />
        </div>
      </motion.div>

      {/* --- FOREGROUND CONTENT LAYER --- */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          // ✅ ADDED pb-24: Creates space at the bottom so button clears the Search Bar
          className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-24"
        >
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-gray-500 shadow-sm">
              The FolioFYX Network
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            {fadeWords("Discover World-Class Creatives")}
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified developers, designers, and innovators. 
            Build your team with the best portfolios on the web.
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-black text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-black/20 transition-all"
          >
            Get Hired
          </motion.button>

        </motion.div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes wordFade {
          0% { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-wordFade {
          animation: wordFade 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
        }
      `}</style>
    </div>
  );
}