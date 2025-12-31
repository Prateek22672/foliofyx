import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_FG = "#6b7280";

const Footer = ({ portfolioData }) => {
  useFadeInOnScroll();

  const fg = portfolioData?.themeFont ? `${portfolioData.themeFont}99` : DEFAULT_FG;
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 text-center text-sm fade-up" style={{ color: fg }}>
      © {year} {portfolioData?.name || "Your Name"}. All rights reserved.
    </footer>
  );
};

export default Footer;
