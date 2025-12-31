import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Home = ({ portfolioData: propData }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  // --- Dynamic Colors ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const accent = data.accentColor || "#2563eb";
  const muted = `${fg}99`; // Slightly transparent text
  const borderColor = `${fg}20`;

  return (
    <section 
      id="home" 
      className="relative pt-32 pb-20 px-4 md:px-8 min-h-screen"
      style={{ backgroundColor: bg }}
    >
      <div className="max-w-[1800px] mx-auto flex flex-col gap-12">
        
        {/* 1. Top Typography Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 fade-up">
          <h1 
            className="text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.9] tracking-tighter max-w-4xl"
            style={{ color: fg }}
          >
            {data.role || "Building digital products for startups."}
          </h1>
          
          <div className="flex flex-col items-start gap-4 mb-2">
             <p className="text-lg md:text-xl max-w-xs leading-snug" style={{ color: muted }}>
               {data.bio ? data.bio.slice(0, 100) : "Crafting blazing fast brand sprints and digital experiences."}
             </p>
             <a 
               href="#projects" 
               className="px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform"
               style={{ backgroundColor: fg, color: bg }}
             >
               View Selected Work
             </a>
          </div>
        </div>

        {/* 2. The "Hero Image" Replica */}
        {/* We keep the specific gradient to match the image requested, but borders adapt */}
        <div className="w-full h-[50vh] md:h-[65vh] rounded-[2rem] overflow-hidden relative fade-up delay-100 group shadow-2xl">
          
          {/* Background Gradient Layer (Static "Lovable" Gradient) */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out" />
          
          {/* Noise Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

          {/* Floating Element inside the Image */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
             <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-16 rounded-3xl shadow-lg">
                <span className="block text-white/80 uppercase tracking-widest text-sm font-bold mb-4">
                  Current Focus
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  Create anything<br />your heart desires.
                </h2>
             </div>
          </div>

          {/* Bottom Labels inside image */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide text-black">
              {data.name || "Portfolio"}
            </span>
          </div>
        </div>

        {/* 3. Bottom Tickers */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-4 fade-up"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
           {['Look 10x Bigger', 'Get to Market Faster', 'Stand Out', 'High Conversion'].map((txt, i) => (
             <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: muted }}>
               <span style={{ color: accent }}>→</span> {txt}
             </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default Home;