import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Footer = ({ portfolioData: propData }) => {
  useFadeInOnScroll();

  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const year = new Date().getFullYear();
  const name = data?.name || "Student";

  return (
    <footer
      id="footer"
      className="
        relative py-6 text-center fade-up
        backdrop-blur-xl bg-black/20
        border-t border-white/20
        text-white
      "
    >
      <p className="text-sm tracking-wide">
        © {year} {name}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
