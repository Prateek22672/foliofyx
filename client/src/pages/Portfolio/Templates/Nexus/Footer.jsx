import React from "react";

const Footer = ({ portfolioData }) => {
  const year = new Date().getFullYear();
  
  // Theme Config
  const bg = portfolioData?.themeBg || "#ffffff";
  const fg = portfolioData?.themeFont || "#0f172a";
  const accent = portfolioData?.accentColor || "#2563eb"; // Added accent for branding

  return (
    <footer 
        className="pb-12 pt-0 relative overflow-hidden"
        style={{ backgroundColor: bg }}
    >
        {/* Ambient Glow at the bottom */}
        <div 
            className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-[100%] blur-[80px] opacity-10 pointer-events-none"
            style={{ backgroundColor: accent }}
        />

        <div className="max-w-7xl mx-auto px-6">
           {/* Fading Gradient Line instead of hard border */}
           <div 
             className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10 mb-12"
             style={{ color: fg }}
           />

           <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm font-light tracking-widest uppercase opacity-80" style={{ color: fg }}>
              
              {/* User Credit */}
              <span className="flex items-center gap-2 opacity-70">
                 Designed & Built by 
                 <span className="font-semibold opacity-100" style={{ color: fg }}>
                    {portfolioData?.name || "Bharat Velineni"}
                 </span>
              </span>

              {/* Tech Divider (Hidden on mobile) */}
              <span className="hidden md:inline-block opacity-20 mx-2 text-lg">/</span>

              {/* FolioFYX Credit */}
              <span className="flex items-center gap-2 opacity-70">
                 Powered by 
                 <span className="font-bold relative group cursor-pointer" style={{ color: accent }}>
                    FolioFYX
                    {/* Tiny dot decoration */}
                    <span className="absolute -right-2 -top-1 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: accent }}></span>
                 </span>
              </span>

              {/* Copyright */}
              <span className="mt-2 md:mt-0 md:ml-2 text-xs opacity-40">
                &copy; {year}
              </span>

           </div>
        </div>
    </footer>
  );
};

export default Footer;