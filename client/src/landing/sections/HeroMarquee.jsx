import React from "react";
import { motion } from "framer-motion";

const HeroMarquee = ({ direction, speed, isCenter, controls, startScrolling }) => {
  const moveDir = direction === "left" ? -1 : 1;

  return (
    <div className="relative overflow-hidden flex">
      <motion.div
        className="flex whitespace-nowrap gap-[2vw]"
        style={{
          fontWeight: 900,
          fontSize: "10vw",
          textTransform: "uppercase",
          lineHeight: 1,
          color: isCenter ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.07)",
          opacity: isCenter ? 1 : 0.4,
          // CRITICAL: Force GPU layer promotion to prevent lag
          willChange: "transform",
          backfaceVisibility: "hidden", 
          WebkitFontSmoothing: "antialiased",
        }}
        animate={
          isCenter
            ? controls
            : startScrolling 
              ? { x: [0, moveDir * 1000] } // Scroll only when allowed
              : { x: 0 } 
        }
        transition={{
          x: { repeat: Infinity, duration: speed, ease: "linear" },
        }}
      >
        {/* OPTIMIZATION: Reduced from 12 to 3 items. 
            Less items = Less GPU memory usage = Smoother load. */}
        {[...Array(3)].map((_, i) => (
          <span key={i} className="block">
            WE BUILD
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroMarquee;