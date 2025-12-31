// src/pages/Customize/customize-editor/Resizer.jsx
import React from "react";

const Resizer = ({ onMouseDown, isDragging }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      // Added 'select-none' to prevent highlighting while clicking
      // Ensure 'h-auto' or 'h-full' works with items-stretch from parent
      className={`
        hidden md:flex flex-none items-center justify-center w-[6px] 
        cursor-col-resize  h-auto select-none
        transition-colors duration-200
        ${isDragging ? "bg-purple-600" : "bg-gray-100 hover:bg-purple-400"}
      `}
    >
      {/* Optional: A visual "grip" handle in the center */}
      <div className={`w-[2px] h-8 rounded-full ${isDragging ? 'bg-white' : 'bg-gray-300'}`} />
    </div>
  );
};

export default Resizer;