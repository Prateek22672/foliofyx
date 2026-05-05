import React from "react";

const Footer = ({ portfolioData }) => {
  const data = portfolioData || {};
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  
  const footerBg = fg; 
  const footerFg = bg;
  const year = new Date().getFullYear();

  return (
    <footer 
      className="py-12 px-8 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em]"
      style={{ 
        backgroundColor: footerBg, 
        color: `${footerFg}40`, // Low opacity foreground
        borderTop: `1px solid ${footerFg}10` 
      }}
    >
      <div className="mb-4 md:mb-0">
        &copy; {year} {data?.name?.split(" ")[0] || "Canvas"} — All Rights Reserved
      </div>
      <div className="opacity-60">
        Designed with FolioFYX Studio
      </div>
    </footer>
  );
};

export default Footer;