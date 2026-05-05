// src/pages/Portfolio/Templates/Pulse/Home.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const Home = ({ portfolioData: propData, isReadOnly }) => {
  useFadeInOnScroll();
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  const muted = `${fg}99`;
  const borderColor = `${fg}15`;

  const SHOWREEL_VIDEO = "/v7.mp4"; 

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-32 pb-12 px-6 flex flex-col justify-between overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── Background Aurora Effects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"
          style={{ backgroundColor: accent }}
        ></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between flex-grow">
        
        {/* ── 1. Meta Row ── */}
        <div 
          className="flex justify-between items-end border-b pb-4 mb-8 uppercase text-[10px] md:text-xs font-black tracking-[0.3em]" 
          style={{ borderColor: borderColor, color: muted }}
        >
          <div className="flex items-center gap-2">
            <EditableText
              value={data.name || "CREATOR NAME"}
              onChange={(val) => setPortfolioData({ ...data, name: val })}
              readOnly={isReadOnly}
            />
            <span>©{new Date().getFullYear()}</span>
          </div>
          
          <span className="flex items-center gap-2" style={{ color: fg }}>
             <span 
               className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px]" 
               style={{ backgroundColor: "#22c55e", boxShadow: `0 0 8px #22c55e` }}
             ></span>
             Available for work
          </span>
        </div>

        {/* ── 2. Main Hero Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-grow">
          
          {/* Main Title & Bio (Left Column) */}
          <div className="order-2 lg:order-1 lg:col-span-7 relative z-20">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-[7.5vw] font-black leading-[0.85] tracking-tighter uppercase break-words"
              style={{ color: fg }}
            >
              <EditableText
                value={data.role || "Digital Architect"}
                onChange={(val) => setPortfolioData({ ...data, role: val })}
                readOnly={isReadOnly}
                multiline
              />
            </motion.h1>
            
            <div className="mt-10 text-sm md:text-xl max-w-lg font-medium leading-relaxed opacity-70" style={{ color: muted }}>
              <EditableText
                value={data.bio || "Crafting high-fidelity digital experiences with a focus on motion, precision, and usability."}
                onChange={(val) => setPortfolioData({ ...data, bio: val })}
                readOnly={isReadOnly}
                multiline
              />
            </div>
          </div>

          {/* Interactive Centerpiece (Right Column) */}
          <div className="order-1 lg:order-2 lg:col-span-5 w-full flex justify-center lg:justify-end group cursor-pointer z-10 px-4 md:px-0">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full aspect-[4/5] max-w-[450px] overflow-hidden backdrop-blur-sm shadow-2xl rounded-sm border"
              style={{ borderColor: `${fg}10`, backgroundColor: `${fg}05` }}
            >
              {/* ✅ FIXED: readOnly → isReadOnly */}
              <EditableImage
                src={data.image}
                onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                className="absolute inset-0 w-full h-full grayscale group-hover:opacity-0 transition-opacity duration-1000 ease-in-out z-10"
                alt="Profile"
                isReadOnly={isReadOnly}
              />
              
              <video 
                autoPlay loop muted playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out z-0"
              >
                <source src={SHOWREEL_VIDEO} type="video/mp4" />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-20"></div>

              <div 
                className="absolute bottom-6 left-6 backdrop-blur-xl px-4 py-2 rounded text-[10px] font-black uppercase tracking-[0.2em] z-30 border"
                style={{ backgroundColor: `${bg}80`, borderColor: `${fg}15`, color: fg }}
              >
                Pulse Showreel
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── 3. Bottom Navigation Hint ── */}
        <div className="mt-12 pt-8 border-t flex items-center justify-between" style={{ borderColor: borderColor }}>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: muted }}>
              <span className="text-indigo-500">(01) — Home</span>
              <span className="w-12 h-[1px]" style={{ backgroundColor: borderColor }}></span>
              <span className="hover:text-white transition-colors cursor-default">Scroll to Explore</span>
            </div>
            <div className="hidden md:block h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: accent }}></div>
        </div>

      </div>
    </section>
  );
};

export default Home;