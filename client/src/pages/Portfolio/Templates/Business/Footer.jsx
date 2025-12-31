import React from "react";

const Footer = ({ portfolioData }) => {
  const data = portfolioData || {};
  return (
    <footer className="bg-[#111] text-white pb-10 px-6 font-[Switzer]">
      <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
         <p>© {new Date().getFullYear()} {data.siteName || "FolioFYX Studio"}</p>
         <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-white transition-colors">Email</a>
         </div>
      </div>
    </footer>
  );
};

export default Footer;