import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Footer = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const year = new Date().getFullYear();
  const mainBg = data.themeBg || "#ffffff";
  const mainFg = data.themeFont || "#111827";
  const sectionBg = mainFg; 
  const sectionFg = mainBg; 

  return (
    <footer 
        className="px-6 md:px-12 pb-12 pt-12 relative z-10 transition-colors duration-300"
        style={{ backgroundColor: sectionBg, color: sectionFg }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold"
            style={{ borderColor: `${sectionFg}10`, color: sectionFg }}
        >
            <span>&copy; {year} {data.name || "User Name"}</span>
            <span className="mt-2 md:mt-0">
                Luxe | Designed by FolioFYX Studio
            </span>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;