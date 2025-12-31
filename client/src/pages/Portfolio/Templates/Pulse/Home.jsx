import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

// Assets
const PROFILE_IMG = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop"; 
const SHOWREEL_VIDEO = "/v7.mp4"; 

const Home = ({ portfolioData: propData }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  // Theme Colors
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  
  const muted = `${fg}99`;
  const borderColor = `${fg}15`;

  // Full Role Logic
  const fullRole = data.role || "Frontend Developer";

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-32 pb-12 px-6 flex flex-col justify-between overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg }}
    >
      
      {/* Background Aurora */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ad0000] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between flex-grow">
        
        {/* 1. Meta Row */}
        <div className="flex justify-between items-end border-b pb-4 mb-8 uppercase text-[10px] md:text-xs font-bold tracking-widest" style={{ borderColor: borderColor, color: muted }}>
          <span>{data.name || "JOHN WICK"} ©{new Date().getFullYear()}</span>
          <span className="flex items-center gap-2" style={{ color: fg }}>
             <span className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px]" style={{ backgroundColor: "#22c55e", boxShadow: `0 0 8px #22c55e` }}></span>
             Available for work
          </span>
        </div>

        {/* 2. Main Layout Area (Grid System Introduced here) */}
        {/* CHANGED: Switched from flex/absolute to Grid. Mobile = 1 col, Desktop = 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-grow">
          
          {/* Main Title (Role) - Now sits in its own grid cell */}
          {/* CHANGED: Removed absolute positioning. Added order-2 for mobile (text below image) or order-1 (text above). Currently Text Top. */}
          <div className="order-2 lg:order-1 relative z-20">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              // CHANGED: Adjusted font size slightly to prevent massive wrapping on split screen
              className="text-5xl w-sm md:text-7xl lg:text-[7vw] lg:w-3xl font-black leading-[0.9] tracking-tighter uppercase break-words"
              style={{ color: fg }}
            >
              {fullRole}
            </motion.h1>
            
            {/* Optional: Short Description underneath title for balance */}
            <p className="mt-6 text-sm md:text-lg max-w-md font-medium leading-relaxed opacity-80" style={{ color: muted }}>
              {data.bio ? data.bio.slice(0, 100) + "..." : "Crafting digital experiences with focus on motion and usability."}
            </p>
          </div>

          {/* Interactive Centerpiece (Image) */}
          {/* CHANGED: Removed 'ml-auto' and absolute positioning logic. It now fills the right column. */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end group cursor-pointer z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              // CHANGED: Adjusted width/height to be responsive (aspect ratio) instead of fixed pixels
              className="relative w-full aspect-[4/5] md:w-[400px] lg:w-full max-w-[400px] overflow-hidden backdrop-blur-sm shadow-2xl rounded-sm border"
              style={{ borderColor: `${fg}10`, backgroundColor: `${fg}05` }}
            >
              <img src={data.image || PROFILE_IMG} alt="Profile" className="absolute inset-0 w-[100%] h-[100%] object-cover object-top grayscale group-hover:opacity-0 transition-opacity duration-700 ease-in-out z-10" />
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0">
                <source src={SHOWREEL_VIDEO} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-20"></div>

              {/* Label */}
              <div className="absolute bottom-6 left-6 backdrop-blur-xl px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest z-30 border"
                style={{ backgroundColor: `${bg}80`, borderColor: `${fg}15`, color: `${fg}90` }}
              >
                Hover
              </div>
            </motion.div>
          </div>

        </div>

        {/* 3. Bottom Text (About Link) */}
        {/* CHANGED: Simplified margin top to ensure spacing on all devices */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: borderColor }}>
           <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: muted }}>
             <span>(01) — About</span>
             <span className="w-8 h-[1px]" style={{ backgroundColor: borderColor }}></span>
             <span>Scroll Down</span>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Home;