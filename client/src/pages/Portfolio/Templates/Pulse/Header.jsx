import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = ({ portfolioData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = portfolioData || {};

  // 1. Setup Location & Customize Check
  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  // 2. Setup Scroll Logic
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Always show if at the top or scrolling UP
        if (currentScrollY < 10 || currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          // Hide if scrolling DOWN
          setIsVisible(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Dynamic Theme Colors
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";

  const navLinks = ['home', 'about', 'experience', 'projects', 'contact'];

  // Logic to get First Name only
  // Falls back to "JOHN WICK" -> splits to "JOHN" if no name provided
  const fullName = data.name || "JOHN WICK";
  const firstName = fullName.trim().split(" ")[0];

  return (
    <>
      <header 
        className={`left-0 w-full z-50 transition-transform duration-300 ease-in-out px-6 flex justify-between items-center ${
          // If customize page, always stay absolute at top. Otherwise, fixed and hide/show based on scroll.
          isCustomizePage 
            ? "absolute pt-2 translate-y-0" 
            : isVisible 
              ? "fixed translate-y-0 py-6" 
              : "fixed -translate-y-full py-6"
        }`}
        style={{ background: `linear-gradient(to bottom, ${bg} 0%, transparent 100%)` }}
      >
        {/* Logo */}
        <a href="#home" className="text-xl font-black tracking-tighter uppercase z-50 transition-colors" style={{ color: fg }}>
          {firstName}<span style={{ color: accent }}>.</span>
        </a>

        {/* Hamburger */}
        <button 
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-1.5 items-end group cursor-pointer z-50"
        >
          <div className="w-8 h-[2px] transition-all" style={{ backgroundColor: fg }}></div>
          <div className="w-6 h-[2px] group-hover:w-8 transition-all" style={{ backgroundColor: fg }}></div>
        </button>
      </header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col justify-center items-center gap-6"
            style={{ backgroundColor: bg }}
          >
            <button 
              onClick={() => setMenuOpen(false)}
              className="absolute top-8 right-8 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
              style={{ color: accent }}
            >
              Close
            </button>

            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="text-5xl md:text-8xl font-black uppercase tracking-tighter transition-all duration-300 hover:opacity-50"
                style={{ color: fg }}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;