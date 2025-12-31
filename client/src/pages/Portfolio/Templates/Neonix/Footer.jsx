import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Footer = ({ portfolioData: propData }) => {
  useFadeInOnScroll();

  // 1. Get Data from Context (Fallback)
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  // 2. Extract Theme Colors
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  
  const year = new Date().getFullYear();

  return (
    <footer 
      className="py-12 px-6 border-t font-[Switzer] transition-colors duration-500"
      // Apply Dynamic Theme Colors
      style={{ 
        backgroundColor: bg, 
        color: fg,
        borderColor: `${fg}10` // 10% opacity border
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 fade-up">
         
         {/* Left Side: Copyright */}
         <div className="text-sm tracking-wide">
             © {year} {data.name || "Portfolio"}. All rights reserved.
         </div>

         {/* Right Side: Tagline */}
         <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-60">
             <span>Designed & Built with Passion</span>
             <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
         </div>

      </div>
    </footer>
  );
};

export default Footer;