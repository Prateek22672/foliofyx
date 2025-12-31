// src/components/DownArrow.jsx
import React from "react";

const DownArrow = ({ targetId = "", className = "" }) => {
  const handle = (e) => {
    e.preventDefault();
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handle}
      aria-label="scroll down"
      className={
        "w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 cursor-pointer text-white flex items-center justify-center shadow-lg " +
        className
      }
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default DownArrow;
