import React from "react";
import { motion } from "framer-motion";

const MarqueeRow = ({ direction, speed, isCenter, animControls, verticalDir = 0 }) => {
  const moveDir = direction === "left" ? -1 : 1;

  return (
    <motion.div
      style={{
        display: "flex",
        whiteSpace: "nowrap",
        gap: "2rem",
        opacity: isCenter ? 1 : 0.5,
        fontWeight: 900,
        fontSize: "12vw",
        textTransform: "uppercase",
        lineHeight: 1,
        color: isCenter ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.05)",
      }}
      animate={
        isCenter
          ? animControls
          : {
              x: [0, moveDir * 1000],
              y: [0, verticalDir * 2000],
            }
      }
      transition={{
        x: { repeat: Infinity, duration: speed, ease: "linear" },
        y: { repeat: Infinity, duration: speed, ease: "linear" },
      }}
    >
      {[...Array(10)].map((_, i) => (
        <span key={i}>WE DESIGN</span>
      ))}
    </motion.div>
  );
};

export default MarqueeRow;
