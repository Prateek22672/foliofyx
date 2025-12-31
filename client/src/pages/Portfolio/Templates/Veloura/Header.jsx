import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = ({ portfolioData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const data = portfolioData || {};

  // 1. Customize Page Check
  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  // 2. Dynamic Theme Colors
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const accent = data.accentColor || "#2563eb";

  // Helper for subtle borders
  const borderColor = `${fg}15`; 

  // 3. Scroll Logic (Smart Hide/Show)
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Hide if scrolling DOWN and not at the very top
        if (currentScrollY > 10 && currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const navLinks = ['home', 'about', 'experience', 'projects', 'contact'];

  return (
    <>
      <header 
        // 4. Positioning Logic: Absolute for Customizer, Fixed + Smart Scroll for Live
        className={`left-0 w-full z-50 transition-transform duration-500 ease-[0.16,1,0.3,1] px-6 pointer-events-none ${
           isCustomizePage 
             ? "absolute top-0 pt-6 translate-y-0" 
             : isVisible 
               ? "fixed top-0 translate-y-0 pt-6" 
               : "fixed top-0 -translate-y-full pt-6"
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center md:items-start">
          
          {/* --- Logo --- */}
          <a href="#home" className="pointer-events-auto text-2xl font-bold tracking-tighter transition-colors" style={{ color: fg }}>
            {data.name ? data.name.split(" ")[0] : "Primary"}
            <span style={{ color: accent }}>.</span>
          </a>

          {/* --- Desktop Nav (Pill Style) --- */}
          <nav 
            className="hidden md:flex pointer-events-auto backdrop-blur-md rounded-full px-2 py-1.5 gap-1 shadow-sm transition-colors"
            style={{ 
              backgroundColor: `${bg}CC`, // 80% opacity
              border: `1px solid ${borderColor}`
            }}
          >
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="px-5 py-2 text-sm font-medium rounded-full transition-all capitalize hover:brightness-95"
                style={{ color: fg }}
                onMouseEnter={(e) => e.target.style.backgroundColor = `${fg}10`}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* --- Status Badge --- */}
          <div 
            className="hidden md:flex pointer-events-auto items-center gap-2 rounded-full px-4 py-2 transition-colors"
            style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}/>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: fg, opacity: 0.6 }}>
              Available
            </span>
          </div>

          {/* --- Mobile Toggle --- */}
          <button 
            className="md:hidden pointer-events-auto rounded-full w-12 h-12 flex flex-col justify-center items-center gap-1.5 shadow-sm transition-colors bg-white/50 backdrop-blur-md"
            style={{ backgroundColor: `${bg}CC`, border: `1px solid ${borderColor}` }}
            onClick={() => setMenuOpen(true)}
          >
            <div className="w-5 h-[1.5px]" style={{ backgroundColor: fg }} />
            <div className="w-5 h-[1.5px]" style={{ backgroundColor: fg }} />
          </button>
        </div>
      </header>

      {/* --- Mobile Overlay Menu --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col justify-center items-center gap-8"
            style={{ backgroundColor: bg }}
          >
             {/* Close Button */}
             <button 
                onClick={() => setMenuOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-black/5 transition-colors"
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
             </button>

             {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-medium capitalize tracking-tight transition-colors hover:opacity-50"
                style={{ color: fg }}
              >
                {item}
              </a>
            ))}

            <div className="mt-8 flex gap-6 opacity-50">
               {data.linkedin && <a href={data.linkedin} className="text-sm font-bold uppercase tracking-widest" style={{ color: fg }}>LinkedIn</a>}
               {data.github && <a href={data.github} className="text-sm font-bold uppercase tracking-widest" style={{ color: fg }}>GitHub</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;