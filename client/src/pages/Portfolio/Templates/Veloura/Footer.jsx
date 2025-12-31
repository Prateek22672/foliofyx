import React from "react";

const Footer = ({ portfolioData }) => {
  const data = portfolioData || {};
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  
  // Inverse for the footer since it sits inside the Contact section visually
  const footerBg = fg; 
  const footerFg = bg;

  const year = new Date().getFullYear();

  return (
    <footer 
      className="py-8 px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs font-mono uppercase tracking-widest"
      style={{ 
        backgroundColor: footerBg, 
        color: `${footerFg}80`, // 50% opacity
        borderTop: `1px solid ${footerFg}20` 
      }}
    >
      <div>© {year} {data?.name}</div>
      <div className="mt-2 md:mt-0">Designed & Built with Passion</div>
    </footer>
  );
};

export default Footer;