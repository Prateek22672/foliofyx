import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = ({ portfolioData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const data = portfolioData || {};

  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  // --- Theme Colors ---
  // Default to Black text (#111) to ensure visibility on the White Hero
  const fg = data.themeFont || "#111111"; 
  const bg = data.themeBg || "#ffffff"; 

  // --- Scroll Logic ---
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // 1. Glass Effect Trigger (after 20px)
        setScrolled(currentScrollY > 20);

        // 2. Hide/Show Logic
        if (currentScrollY < 10) {
          // Always show at the very top
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling DOWN -> Hide
          setIsVisible(false);
        } else {
          // Scrolling UP -> Show
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const navLinks = ["Work", "Pricing", "Studio"];

  return (
    <>
      <header
        className={`left-0 w-full z-50 transition-all duration-500 ease-[0.2,1,0.2,1] ${
          isCustomizePage 
            ? "absolute top-0 pt-6" // Customize Mode: Absolute & Spaced
            : isVisible 
              ? "fixed top-0 py-4" // Live Mode (Visible): Fixed & Spaced
              : "fixed top-0 -translate-y-full py-4" // Live Mode (Hidden): Slide Up
        }`}
      >
        <div 
          className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between transition-all duration-500"
          style={{ 
            // Transparent at top, White Glass when scrolled
            backgroundColor: scrolled && !isCustomizePage ? "rgba(255, 255, 255, 0.85)" : "transparent",
            backdropFilter: scrolled && !isCustomizePage ? "blur(12px)" : "none",
            borderBottom: scrolled && !isCustomizePage ? "1px solid rgba(0,0,0,0.05)" : "1px solid transparent",
            borderRadius: scrolled && !isCustomizePage ? "0px" : "24px" // Optional: rounded when floating
          }}
        >
          
          {/* --- LEFT: LOGO --- */}
          <a href="#home" className="text-2xl font-medium tracking-tight z-50" style={{ color: fg }}>
            {data.name || "FolioFYX"}
          </a>

          {/* --- CENTER: PILL NAV --- */}
          <nav className="hidden md:flex items-center gap-3">
            {navLinks.slice(0, 2).map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-8 py-3 rounded-full border transition-all duration-300 hover:bg-black/5"
                style={{ 
                  color: fg,
                  // Always show border for the "Pill" look
                  borderColor: scrolled ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.08)",
                  backgroundColor: isCustomizePage ? "rgba(255,255,255,0.5)" : "transparent"
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* --- RIGHT: RESERVE SPOT CTA --- */}
          <div className="hidden md:flex items-center gap-4">
             <a 
               href="#contact" 
               className="group flex items-center gap-3 px-5 py-2 rounded-full border transition-all hover:border-black/20"
               style={{ 
                 color: fg,
                 borderColor: "rgba(0,0,0,0.08)",
                 backgroundColor: isCustomizePage ? "rgba(255,255,255,0.5)" : "transparent"
               }}
             >
                {/* Icon Circle */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 group-hover:bg-[#ccff00] transition-colors duration-300">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                   </svg>
                </div>
                
                {/* Text Stack */}
                <div className="flex flex-col text-left leading-none gap-0.5">
                    <span className="text-sm font-medium">Reserve your spot</span>
                    <span className="text-[10px] font-medium opacity-50 uppercase tracking-wide">3 slots left for Feb</span>
                </div>
             </a>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 flex flex-col items-end gap-1.5 z-50 group"
          >
            <span className="w-6 h-0.5 transition-all group-hover:w-8" style={{ backgroundColor: fg }}></span>
            <span className="w-8 h-0.5 transition-all" style={{ backgroundColor: fg }}></span>
          </button>

        </div>
      </header>

      {/* --- FULL SCREEN MOBILE MENU --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col px-6 py-8 bg-white"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-medium" style={{ color: fg }}>Menu</span>
               <button 
                 onClick={() => setMenuOpen(false)} 
                 className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 text-xl hover:bg-black/5"
                 style={{ color: fg }}
               >
                 ✕
               </button>
            </div>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-6">
                {navLinks.map(n => (
                    <a 
                      key={n} 
                      href={`#${n.toLowerCase()}`} 
                      onClick={() => setMenuOpen(false)} 
                      className="text-5xl font-medium tracking-tight"
                      style={{ color: fg }}
                    >
                      {n}
                    </a>
                ))}
            </nav>

            {/* Mobile Bottom CTA */}
            <div className="mt-auto">
                <a href="#contact" className="flex items-center gap-4 text-sm font-medium opacity-60" style={{ color: fg }}>
                   <span>Reserve Spot</span>
                   <span className="w-full h-[1px] bg-current opacity-20"></span>
                   <span>3 Left</span>
                </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;