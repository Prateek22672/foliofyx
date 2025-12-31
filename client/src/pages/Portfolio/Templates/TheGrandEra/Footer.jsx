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

  return (
    <footer 
      className="py-10 px-6 border-t font-mono text-xs uppercase tracking-widest transition-colors duration-500 fade-up"
      style={{ 
        backgroundColor: bg, 
        color: fg,
        borderColor: `${fg}10` // 10% opacity border
      }}
    >
      {/* Container: Flex-col for mobile (stack vertically), 
        Flex-row for desktop (spread horizontally) 
      */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
        
        {/* Left: Copyright */}
        <span>
          {data.name || "User"} © {new Date().getFullYear()}
        </span>

        {/* Center: Branding */}
        <span className="text-center">
          FolioFYX — The Grand Aesthetic Era™
        </span>

        {/* Right: Local Time (Static render) */}
        <span>
          Local Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

      </div>
    </footer>
  );
};

export default Footer;