import React, { useEffect, useState } from "react";

const PopupMessage = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  // Handle entrance/exit logic for smooth animation
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false); // Trigger exit animation
        setTimeout(onClose, 500); // Wait for animation to finish before unmounting
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed top-[12%] left-1/2 transform -translate-x-1/2 z-[9999] cursor-pointer
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${visible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
    >
      {/* The Glass Container */}
      <div className="relative group">
        {/* Subtle background glow effect behind the component */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        
        <div className="relative flex items-center gap-3 
                        bg-gray-900/80 backdrop-blur-xl 
                        border border-white/10 
                        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
                        text-gray-100 px-6 py-3 rounded-full 
                        pr-8"
        >
          {/* Optional: A subtle premium icon/indicator */}
          <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <span className="text-sm font-medium tracking-wide antialiased">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PopupMessage;