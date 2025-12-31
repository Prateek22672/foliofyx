import React, { useState, useEffect, useRef } from "react";
import { TEMPLATE_LIST } from "../Templates"; 

// Premium Templates List (Matches other files)
const PREMIUM_TEMPLATES = ["neo-brutalism", "3d-portfolio", "agency-grid", "artist-gallery"];

export default function ThemePopup({ onSelect, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  // --- 🔒 GLOBAL SCROLL LOCK ---
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Often needed for mobile safaris
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // --- 🖱️ MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; 
    startDrag(e.clientX, e.clientY);
  };

  // --- 📱 TOUCH HANDLERS ---
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  // --- SHARED START LOGIC ---
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  // --- EFFECT: GLOBAL MOVE/UP LISTENERS ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      // On mobile, dragging the modal should NOT scroll the page
      if (e.cancelable) e.preventDefault(); 
      setPosition({
        x: touch.clientX - dragStartPos.current.x,
        y: touch.clientY - dragStartPos.current.y
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onWheel={(e) => e.stopPropagation()} 
      onTouchMove={(e) => e.stopPropagation()} // Stop scroll propagation to body
    >
      
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh] relative overflow-hidden"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          touchAction: "none" // Disables browser handling of gestures on the modal container
        }}
      >
        
        {/* HEADER (DRAG HANDLE) */}
        <div 
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="flex justify-between items-center p-6 border-b border-gray-100 bg-white cursor-move select-none"
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 pointer-events-none">Choose a Template</h3>
            <p className="text-gray-500 text-sm pointer-events-none">Select a starting point for your portfolio.</p>
          </div>
          <button
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div 
          className="flex-1 overflow-y-auto p-6 custom-scrollbar"
          style={{ overscrollBehavior: "contain" }} // Prevents scroll chaining to parent
          // Re-enable touch interactions for inner content so scrolling works
          onTouchStart={(e) => e.stopPropagation()} 
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ touchAction: "pan-y" }}>
            {TEMPLATE_LIST && Object.entries(TEMPLATE_LIST).map(([key, item]) => {
              const isPremium = PREMIUM_TEMPLATES.includes(key);
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSelect(key);
                    onClose();
                  }}
                  className={`group flex flex-col text-left gap-3 p-3 rounded-3xl border transition-all duration-300 relative
                    ${isPremium ? "border-yellow-500/30 bg-yellow-50/10 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10" : "border-gray-200 bg-gray-50/50 hover:border-black/20 hover:shadow-xl"}
                  `}
                >
                  {/* Premium Badge */}
                  {isPremium && (
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                       PREMIUM
                    </div>
                  )}

                  <div className="w-full overflow-hidden rounded-lg aspect-[24/11] bg-gray-200 relative">
                    {item.preview ? (
                      <>
                        <img
                          src={item.preview}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-mono">
                        NO PREVIEW
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        {isPremium ? "Try Premium" : "Use Template"}
                      </span>
                    </div>
                  </div>
                  <div className="px-1">
                    <span className="text-lg font-bold text-gray-900 block">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      Perfect for Portfolios & Resumes
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}