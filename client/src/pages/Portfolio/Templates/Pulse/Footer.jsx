import React from "react";

const Footer = ({ portfolioData }) => {
  const data = portfolioData || {};
  const year = new Date().getFullYear();
  
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const borderColor = `${fg}15`;

  return (
    <footer 
      className="py-8 px-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest transition-colors duration-500"
      style={{ 
        backgroundColor: bg, 
        color: `${fg}80`, 
        borderTop: `1px solid ${borderColor}` 
      }}
    >
      <div>© {year} {data?.name}</div>
      <div className="mt-2 md:mt-0">Designed with Intensity</div>
    </footer>
  );
};

export default Footer;