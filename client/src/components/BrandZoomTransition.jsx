// client/src/components/BrandZoomTransition.jsx
// Cinematic page-change transition. Black designer field with "WE BUILD /
// WE DESIGN / WE DEVELOP" marquee rows drifting left-to-right at 45°, the
// brand logo (same asset as the main splash) center stage, and a true 3D
// dolly: the logo arrives from deep in the scene, holds, then flies past
// the camera as the overlay opens into the destination page (which the
// SplashProvider mounts behind this at ~58% of the duration).

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const PHRASES = ["WE BUILD", "WE DESIGN", "WE DEVELOP", "WE CREATE", "WE LAUNCH"];

// One diagonal marquee row — CSS keyframes so it never stutters mid-flight.
const MarqueeRow = ({ text, duration, offset }) => {
  const line = Array(8).fill(text).join("  ·  ");
  return (
    <div className="overflow-visible whitespace-nowrap" style={{ marginLeft: offset }}>
      <div
        className="inline-block font-black uppercase tracking-tighter text-white/15 leading-none select-none"
        style={{
          fontSize: "9vw",
          animation: `fyxMarqueeLTR ${duration}s linear infinite`,
        }}
      >
        {line}&nbsp;&nbsp;·&nbsp;&nbsp;{line}
      </div>
    </div>
  );
};

const BrandZoomTransition = ({ message = "Loading...", duration = 2000 }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const s = duration / 1000;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-transparent"
      style={{ perspective: 1200 }}
    >
      <style>{`
        @keyframes fyxMarqueeLTR {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0%); }
        }
      `}</style>

      {/* Scene backdrop — fades in, holds, zooms slower than the logo on the
          way out (parallax = depth), then opens into the page behind. */}
      <motion.div
        className="absolute inset-0 bg-[#050505]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [1.05, 1, 1, 1.9] }}
        transition={{ duration: s, times: [0, 0.16, 0.72, 1], ease: [0.7, 0, 0.3, 1] }}
      >
        {/* Diagonal designer field: 45°, rows drifting left → right */}
        <div
          className="absolute left-1/2 top-1/2 flex flex-col gap-2 opacity-55"
          style={{
            width: "260vmax",
            transform: "translate(-50%, -50%) rotate(-45deg)",
          }}
        >
          {PHRASES.map((p, i) => (
            <MarqueeRow
              key={p}
              text={p}
              duration={16 + i * 4}
              offset={`${(i % 3) * -6}vw`}
            />
          ))}
        </div>

        {/* Vignette so the field recedes behind the logo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.85)_78%)]" />
      </motion.div>

      {/* Logo — 3D dolly: arrives from deep (-600px), settles, then flies
          past the camera (+1100px) as the new page is revealed. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ perspective: 1200 }}>
        <motion.img
          src="/logow.png"
          alt="FolioFYX"
          className="w-44 sm:w-56 drop-shadow-[0_0_40px_rgba(124,58,237,0.35)] will-change-transform"
          initial={{ opacity: 0, z: -600 }}
          animate={{
            opacity: [0, 1, 1, 0],
            z: [-600, 0, 40, 1100],
          }}
          transition={{
            duration: s,
            times: [0, 0.24, 0.6, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
        />

        <motion.p
          className="mt-6 text-[10px] sm:text-xs uppercase tracking-[0.45em] text-white/50 font-['Switzer']"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
          transition={{ duration: s, times: [0.08, 0.28, 0.58, 0.8], ease: "easeOut" }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default BrandZoomTransition;
