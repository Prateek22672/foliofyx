import React from "react";
import { motion } from "framer-motion";

const ElegantButton = ({ label, onClick, variant = "primary", className = "" }) => {
  const isPrimary = variant === "primary"; // Black background, White text
  
  return (
    <motion.button
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`
        relative overflow-hidden px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide
        border border-black/10 transition-colors duration-300
        ${isPrimary ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"}
        ${className}
      `}
      variants={{
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
      </span>

      {/* Subtle shine effect on hover for primary buttons */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0 bg-white/20 z-0"
          variants={{
            initial: { x: "-100%" },
            hover: { x: "100%" },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};

export default ElegantButton;