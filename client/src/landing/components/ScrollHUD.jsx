import React, { useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function ScrollHUD({ scrollYProgress }) {
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);
  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      setPercentage(Math.round(v * 100));
      setProgressVal(v);
    });
  }, [smoothProgress]);

  // ── Determine which section we're in so HUD color stays legible ──
  // White section ≈ 0.07–0.43 of total scroll (matches Landing.js timeline)
  const isOnLightSection = progressVal > 0.06 && progressVal < 0.43;

  const hudColor       = isOnLightSection ? "#111111" : "#ffffff";
  const trackColor     = isOnLightSection ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";
  const lineTrackColor = isOnLightSection ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)";

  // Derive current label from progress value (avoids useTransform string maps)
  const getLabel = (v) => {
    if (v < 0.08)  return "Scroll to Explore";
    if (v < 0.25)  return "The Problem";
    if (v < 0.43)  return "The Solution";
    if (v < 0.60)  return "Talent Ecosystem";
    if (v < 0.78)  return "Find Your Vibe";
    if (v < 0.93)  return "Ready to Launch?";
    return "Welcome Aboard";
  };

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-4 pointer-events-none"
      // ── removed mix-blend-difference — use explicit color switching instead ──
    >
      {/* 1. SECTION LABEL — vertical text */}
      <motion.div
        animate={{ color: hudColor }}
        transition={{ duration: 0.4 }}
        className="writing-vertical-rl text-[10px] font-bold tracking-[0.2em] uppercase rotate-180 mb-2 font-['Switzer']"
        style={{ opacity: 0.55 }}
      >
        {getLabel(progressVal)}
      </motion.div>

      {/* 2. CIRCULAR TRACKER */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track ring */}
          <motion.circle
            cx="50" cy="50" r="40"
            stroke={trackColor}
            strokeWidth="2"
            fill="transparent"
            animate={{ stroke: trackColor }}
            transition={{ duration: 0.4 }}
          />
          {/* Fill ring */}
          <motion.circle
            cx="50" cy="50" r="40"
            strokeWidth="2"
            fill="transparent"
            animate={{ stroke: hudColor }}
            transition={{ duration: 0.4 }}
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <motion.span
          animate={{ color: hudColor }}
          transition={{ duration: 0.4 }}
          className="text-[10px] font-black font-['Switzer']"
        >
          {percentage}%
        </motion.span>
      </div>

      {/* 3. VERTICAL LINE */}
      <div
        className="w-[1px] h-24 relative overflow-hidden"
        style={{ background: lineTrackColor }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full"
          animate={{ backgroundColor: hudColor }}
          transition={{ duration: 0.4 }}
          style={{ height: lineHeight }}
        />
      </div>

      <style>{`
        .writing-vertical-rl { writing-mode: vertical-rl; }
      `}</style>
    </motion.div>
  );
}