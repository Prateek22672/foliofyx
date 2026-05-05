import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_FG = "#111827";

function Header({ portfolioData = {}, isMobileView: propIsMobile, isReadOnly }) {
  const data = portfolioData || {};
  const fg = data?.themeFont || DEFAULT_FG;
  const bg = data?.themeBg || "#ffffff";

  // Extracts first name or defaults to "Creator"
  const firstName = data.name ? data.name.split(" ")[0] : "Creator";

  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileView, setIsMobileView] = useState(
    propIsMobile ?? window.innerWidth <= 768
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (propIsMobile !== undefined) return;
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [propIsMobile]);

  const navItems = ["home", "about", "experience", "projects", "contact"];

  return (
    <header
      className={`${
        isCustomizePage ? "absolute pt-6" : "fixed top-8 left-0"
      } w-full flex justify-center pointer-events-none z-[100] transition-all duration-500 ${
        scrolled ? "top-4" : "top-8"
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto 
          flex items-center justify-between
          px-2 py-2 rounded-full border
          transition-all duration-500 ease-in-out
          ${scrolled ? "shadow-2xl backdrop-blur-xl" : "shadow-sm backdrop-blur-md"}
        `}
        style={{ 
          backgroundColor: scrolled ? `${fg}08` : `${bg}40`,
          borderColor: `${fg}15`,
          width: isMobileView ? "90%" : "auto"
        }}
      >
        {/* --- DYNAMIC NAME LOGO --- */}
        <div className="pl-5 pr-6 border-r border-current/10 py-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: fg }}>
            {firstName}<span className="opacity-30">.</span>
          </span>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        {!isMobileView ? (
          <nav className="flex gap-1 items-center px-2">
            {navItems.map((n) => (
              <a
                key={n}
                href={`#${n}`}
                className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-current hover:text-white"
                style={{ color: fg }}
              >
                {n}
              </a>
            ))}
          </nav>
        ) : (
          /* --- MOBILE TRIGGER --- */
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="pr-4 pl-6 flex items-center gap-3 group"
            style={{ color: fg }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">Menu</span>
            <div className="flex flex-col gap-1">
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block w-4 h-[1.5px] bg-current" 
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-4 h-[1.5px] bg-current" 
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="block w-4 h-[1.5px] bg-current" 
              />
            </div>
          </button>
        )}
      </motion.div>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      <AnimatePresence>
        {menuOpen && isMobileView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-8 backdrop-blur-3xl"
            style={{ backgroundColor: `${bg}F2`, color: fg }}
          >
            {navItems.map((item, i) => (
              <motion.a
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter hover:italic transition-all"
              >
                {item}
              </motion.a>
            ))}
            
            <button 
              onClick={() => setMenuOpen(false)}
              className="mt-12 text-[10px] font-bold uppercase tracking-[0.5em] opacity-30"
            >
              Tap to Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;