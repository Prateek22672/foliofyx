import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = ({ portfolioData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const data = portfolioData || {};

  // 1. Setup Location for Customize Page Check
  const location = useLocation();
  const isCustomizePage = location.pathname.includes("/customize");

  // --- Theme Logic ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  // --- Scroll Listener (Glass Effect + Smart Hide) ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. Glass Effect Logic
      setScrolled(currentScrollY > 50);

      // 2. Smart Hide Logic (Hide on down, show on up)
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- Animations ---
  const menuVariants = {
    closed: { opacity: 0, y: "-100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } },
    open: { opacity: 1, y: "0%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i) => ({ y: 0, opacity: 1, transition: { delay: 0.1 + i * 0.1, duration: 0.5 } })
  };

  const navLinks = ['home', 'about', 'experience', 'projects', 'contact'];

  return (
    <>
      <motion.header 
        // 3. Dynamic Positioning Class
        className={`left-0 w-full z-50 transition-all duration-500 border-b ${
          isCustomizePage 
            ? "absolute top-0 pt-6" // Customize: Always absolute at top
            : isVisible 
              ? "fixed top-0 translate-y-0" // Live: Fixed & Visible
              : "fixed top-0 -translate-y-full" // Live: Fixed & Hidden
        }`}
        style={{ 
          // Glass Styles
          backgroundColor: scrolled ? `${bg}CC` : 'transparent',
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          borderColor: scrolled ? `${fg}10` : 'transparent',
          paddingTop: scrolled ? '1rem' : '1.5rem',
          paddingBottom: scrolled ? '1rem' : '1.5rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* --- Logo --- */}
          <a href="#home" className="text-2xl font-bold tracking-tight z-[60]" style={{ color: fg }}>
            {data.name ? data.name.split(" ")[0] : "Portfolio"}
            <span style={{ color: accent, fontSize: '1.5em', lineHeight: 0 }}>.</span>
          </a>

          {/* --- Desktop Nav --- */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item}`} 
                className="text-sm font-medium uppercase tracking-wider relative group"
                style={{ color: fg }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ backgroundColor: accent }} />
              </a>
            ))}
          </nav>

          {/* --- MOBILE TOGGLE (2 BARS) --- */}
          <div 
            className="md:hidden z-[60] cursor-pointer w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Top Bar */}
            <motion.span 
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="w-8 h-[2px] block transition-colors"
              style={{ backgroundColor: fg }}
            />
            
            {/* Bottom Bar */}
            <motion.span 
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="w-8 h-[2px] block transition-colors"
              style={{ backgroundColor: fg }}
            />
          </div>

        </div>
      </motion.header>

      {/* --- Mobile Overlay --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{ backgroundColor: bg }}
          >
            <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: accent }}></div>
            <div className="flex flex-col gap-8 text-center relative z-10">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item}
                  custom={i}
                  variants={linkVariants}
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl capitalize font-medium tracking-tight"
                  style={{ color: fg }}
                  whileHover={{ scale: 1.1, color: accent }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;