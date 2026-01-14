import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function ScrollHUD({ scrollYProgress }) {
  // Smooth out the raw scroll data for a fluid feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Map progress to percentage (0 to 100)
  const [percentage, setPercentage] = useState(0);
  
  // Dynamic Messages based on scroll position
  const currentMessage = useTransform(
    smoothProgress,
    [0, 0.1, 0.25, 0.45, 0.65, 0.85, 1],
    [
      "Scroll to Explore",   // Hero
      "The Problem",         // White Section starts
      "The Solution",        // White Section ends
      "Talent Ecosystem",    // Talent
      "Find Your Vibe",      // Bento/Themes
      "Ready to Launch?",    // Outro
      "Welcome Aboard"       // End
    ]
  );

  useEffect(() => {
    // Subscribe to the spring to update the percentage text
    return smoothProgress.on("change", (v) => {
      setPercentage(Math.round(v * 100));
    });
  }, [smoothProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-4 pointer-events-none mix-blend-difference"
    >
      {/* 1. PROGRESS TEXT (Vertical) */}
      <motion.div className="writing-vertical-rl text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 rotate-180 mb-2 font-['Switzer']">
        {currentMessage}
      </motion.div>

      {/* 2. CIRCULAR TRACKER */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-white/20"
          />
          {/* Filling Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-white"
            style={{
              pathLength: smoothProgress
            }}
          />
        </svg>
        
        {/* Percentage Number - UPDATED TO SWITZER */}
        <span className="text-[10px] font-black text-white font-['Switzer']">
          {percentage}%
        </span>
      </div>

      {/* 3. VERTICAL LINE */}
      <div className="w-[1px] h-24 bg-white/20 relative overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-white"
          style={{ height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      <style>{`
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </motion.div>
  );
}