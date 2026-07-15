// src/pages/Customize/customize-editor/Resizer.jsx
import React, { useRef } from "react";

const Resizer = ({ onMouseDown, isDragging }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      role="separator"
      aria-label="Drag to resize panels"
      className={`
        hidden md:flex flex-none items-center justify-center
        w-[10px] h-auto select-none cursor-col-resize relative
        transition-colors duration-150 group z-20
        ${isDragging ? "bg-violet-500/20" : "bg-transparent hover:bg-violet-500/10"}
      `}
    >
      {/* Center grip track */}
      <div
        className={`
          w-[3px] h-16 rounded-full transition-all duration-200
          ${isDragging
            ? "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)] scale-y-110"
            : "bg-white/15 group-hover:bg-violet-400 group-hover:scale-y-105"
          }
        `}
      />

      {/* Grip dots */}
      <div className="absolute flex flex-col gap-[5px] pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`
              w-[3px] h-[3px] rounded-full transition-colors duration-200
              ${isDragging ? "bg-violet-300" : "bg-white/30 group-hover:bg-violet-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default Resizer;