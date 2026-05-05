// src/pages/Portfolio/Templates/Pulse/Footer.jsx

import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Footer = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // THEME COLORS
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";
  const borderColor = `${fg}15`;

  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer 
      className="relative w-full overflow-hidden" 
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="grid md:grid-cols-12 w-full">
        
        {/* LEFT: Branding/Copyright (Span 5) */}
        <div 
          className="md:col-span-5 p-8 md:p-16 border-b md:border-b-0 md:border-r flex flex-col justify-between" 
          style={{ borderColor: borderColor }}
        >
          <div className="fade-up">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
              {data.name || "Portfolio"}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              © {year} All Rights Reserved
            </p>
          </div>

          <div className="mt-12 md:mt-24">
             <button 
               onClick={scrollToTop}
               className="text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity flex items-center gap-4"
             >
               <span className="w-8 h-[1px] bg-current opacity-30"></span>
               Back to Top
             </button>
          </div>
        </div>

        {/* RIGHT: Signature & Status (Span 7) */}
        <div className="md:col-span-7 p-8 md:p-16 flex flex-col justify-end items-start md:items-end gap-8">
          <div className="fade-up text-left md:text-right">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-4 block">
              By
            </span>
            <p 
              className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter"
              style={{ 
                color: "transparent", 
                WebkitTextStroke: `1px ${fg}`,
                opacity: 0.2
              }}
            >
              {data.name || "Your Name"}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold opacity-60">
             <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></span>
             Built with FolioFYX
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;