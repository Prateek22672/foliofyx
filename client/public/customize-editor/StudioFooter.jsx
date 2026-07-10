/* ── StudioFooter.jsx ── */
import React, { useState, useEffect } from "react";
import { FONT_OPTIONS } from "../../Templates/TextFontPopup"; 
import { ArrowUpRight } from "lucide-react";

const StudioFooter = ({ isMobileSim, showPreviewMobile, windowWidth }) => {
  const [fontIndex, setFontIndex] = useState(0);

  // Social Links Mapping
  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/foliofyx' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/prateek-koratala-014683293/' },
    { name: 'Github', url: 'https://github.com/Prateek22672' }
  ];

  useEffect(() => {
    if (!FONT_OPTIONS || FONT_OPTIONS.length === 0) return;

    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % FONT_OPTIONS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  if (isMobileSim || (showPreviewMobile && windowWidth < 768)) return null;

  const currentFont = FONT_OPTIONS?.[fontIndex] || { value: "Switzer, sans-serif" };

  return (
    <footer className="relative w-full bg-black -mb-5 mt-0 pt-32 pb-0 px-6 md:px-12 overflow-hidden transition-colors duration-500">
      {/* Aesthetic Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              Welcome To The
            </span>
          </div>
          <img src="/logow.png" alt="logo" className="w-24 sm:w-32 opacity-80 brightness-0 invert" />
        </div>

        {/* ✅ Kinetic "Studio" Text */}
        <div className="w-full overflow-hidden leading-none select-none pointer-events-none flex justify-center py-10">
          <h1
            className="text-[23vw] font-black text-white text-center tracking-tighter"
            style={{ lineHeight: 0.8 }}
          >
            <span
              key={currentFont.value}
              style={{ fontFamily: currentFont.value }}
            >
              Studio
            </span>
          </h1>
        </div>

        {/* Bottom Metadata & Badge */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
            © {new Date().getFullYear()} Studio X
          </div>

          <div className="flex gap-10">
            {socialLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                {link.name} <ArrowUpRight size={10} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pr-4 rounded-2xl backdrop-blur-xl">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-black text-xs">
                <img src="/fyxlogow.png" className="brightness-0 w-5"/>
                
             </div>
             <div className="flex flex-col text-left">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Workspace</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Studio Edition</span>
             </div>
             
          </div>

          
        </div>

        <img className="w-50 block mt-0 mb-10 m-auto brightness-1000 invert-40" src="/originals/foliofyx-studio-logo-dark.png"/>
      </div>
    </footer>
  );
};

export default StudioFooter;