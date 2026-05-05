import React, { useEffect, useState } from "react";

const PopupMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Small delay to ensure the mount is registered before animating
      const startTimer = setTimeout(() => setVisible(true), 10);
      
      const exitTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400); // Match duration-400
      }, 2500); // Display for 2.5s

      return () => {
        clearTimeout(startTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed top-26 left-1/2 transform -translate-x-1/2 cursor-pointer
        transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${visible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      style={{ zIndex: 10000 }} // Explicitly forced on top
    >
      <div className="flex items-center gap-3 
                      bg-black/90 backdrop-blur-md 
                      border border-white/10 
                      shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                      text-white px-5 py-2.5 rounded-3xl"
      >
        {/* Status Indicator - Using your brand Indigo */}
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5551ff] opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5551ff]"></span>
        </div>

        <p className="text-[13px] antialiased">
          {message}
        </p>

        {/* Minimal Close Hint */}
        <div className="ml-2 h-4 w-[1px] bg-white/20" />
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
          Dismiss
        </span>
      </div>
    </div>
  );
};

export default PopupMessage;