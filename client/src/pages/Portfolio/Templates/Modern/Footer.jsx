import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_FG = "#6b7280";

const Footer = ({ portfolioData }) => {
  useFadeInOnScroll();
  const fg = portfolioData?.themeFont ? `${portfolioData.themeFont}99` : DEFAULT_FG;
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-current/10 font-[Switzer]" style={{ color: fg }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 fade-up">
         <div className="text-sm font-medium">
             © {year} {portfolioData?.name || "Portfolio"}. 
         </div>
         <div className="text-xs uppercase tracking-widest opacity-60 font-bold">
             Designed & Built with Passion
         </div>
      </div>
    </footer>
  );
};

export default Footer;