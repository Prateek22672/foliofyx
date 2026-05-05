import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Header = ({ portfolioData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [visible, setVisible] = useState(true);

  const data = portfolioData || {};
  const { pathname } = useLocation();
  const isCustomize = pathname.includes("/customize");

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      setVisible(currentY < 10 || currentY < lastY);
      setLastY(currentY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const initials = data.name 
    ? data.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() 
    : "PK";

  const links = ["home", "about", "experience", "projects", "contact"];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${!isCustomize && !visible ? "-translate-y-full" : "translate-y-0"}`}>
        <div 
          className="mx-auto flex items-center justify-between px-6 py-4 transition-all"
          style={{ 
            backgroundColor: scrolled ? `${bg}e8` : "transparent",
            backdropFilter: scrolled ? "blur(120px)" : "none",
            borderBottom: scrolled ? `1px solid ${fg}15` : "1px solid transparent"
          }}
        >
          <a href="#home" className="w-10 h-10 flex items-center justify-center rounded-full font-bold text-[11px] tracking-widest transition-transform hover:scale-105" style={{ background: fg, color: bg }}>
            {initials}
          </a>

          <nav className="hidden md:flex gap-2">
            {links.map(l => (
              <a key={l} href={`#${l}`} className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all hover:bg-white/5" style={{ color: fg }}>
                {l}
              </a>
            ))}
          </nav>

          <button onClick={() => setMenuOpen(true)} className="md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1" style={{ background: `${fg}15` }}>
            <span className="w-4 h-0.5 bg-current" style={{ color: fg }} />
            <span className="w-4 h-0.5 bg-current" style={{ color: fg }} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-[100] flex flex-col justify-center px-10"
            style={{ background: bg }}
          >
            <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-2xl" style={{ color: fg }}>✕</button>
            {links.map(l => (
              <a key={l} href={`#${l}`} onClick={() => setMenuOpen(false)} className="text-5xl font-black uppercase mb-4 tracking-tighter" style={{ color: fg }}>{l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;