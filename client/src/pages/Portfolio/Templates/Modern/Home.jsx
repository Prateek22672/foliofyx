import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import linkedinLogo from "../../../../assets/linkedin.png";
import githubLogo from "../../../../assets/github.png";
import { ArrowDownCircle, Sparkles, ExternalLink, FileText } from "lucide-react";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

const Home = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Data merging: prioritizes deployed data, then context
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";

  const firstName = data.name ? data.name.split(" ")[0] : "CREATIVE";

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── BACKGROUND LAYER: GIANT KINETIC TEXT ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-[40vw] font-black uppercase tracking-tighter leading-none italic"
          style={{ color: fg }}
        >
          {firstName}
        </motion.h1>
      </div>

      {/* ── AMBIENT GLOW ── */}
      <div 
        className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* ── LEFT SIDE: REFINED CONTENT (Col 1-7) ── */}
        <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">


          <div className="space-y-4 mt-30">
            <h1 className="text-6xl md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase italic">
              <EditableText
                value={data.name || "YOUR NAME"}
                onChange={(val) => setPortfolioData({ ...data, name: val })}
                readOnly={isReadOnly}
              />
              <span style={{ color: accent }}>.</span>
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] opacity-30" style={{ backgroundColor: fg }} />
              <h2 className="text-xl md:text-3xl font-light tracking-tight opacity-70">
                <EditableText
                  value={data.role || "Creative Developer"}
                  onChange={(val) => setPortfolioData({ ...data, role: val })}
                  readOnly={isReadOnly}
                />
              </h2>
            </div>
          </div>

          <p className="text-lg md:text-xl font-medium max-w-xl leading-relaxed opacity-50">
            <EditableText
              value={data.bio || "Architecting high-performance digital systems with minimal aesthetics."}
              onChange={(val) => setPortfolioData({ ...data, bio: val })}
              readOnly={isReadOnly}
              multiline
            />
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-6 pt-6">
            <a 
              href="#projects" 
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl active:scale-95"
              style={{ backgroundColor: fg, color: bg }}
            >
              View Work <ExternalLink size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            {data.cvLink && (
              <a 
                href={data.cvLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 rounded-full border-2 font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95"
                style={{ borderColor: `${fg}20`, color: fg }}
              >
                Resume <FileText size={14} />
              </a>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDE: PORTRAIT PORTAL (Col 8-12) ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative group">
            {/* Architectural Frame */}
            <div className="absolute inset-0 border border-current opacity-10 rounded-[2.5rem] translate-x-4 translate-y-4 -z-10" />
            
            <div className="relative w-64 h-80 md:w-[400px] md:h-[520px] overflow-hidden rounded-[2rem] shadow-2xl">
              <EditableImage
                src={data?.image}
                fallbackSrc="/themes/default-dp.avif"
                onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                isReadOnly={isReadOnly}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              
              {/* Floating Social Pill */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full flex gap-6 shadow-2xl items-center">
                <a href={data?.linkedin} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                  <img src={linkedinLogo} className="w-5 h-5 invert" alt="LinkedIn" />
                </a>
                <div className="w-[1px] h-4 bg-white/20" />
                <a href={data?.github} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                  <img src={githubLogo} className="w-5 h-5 invert" alt="GitHub" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <motion.div 
        animate={{ y: [0, 8, 0] }} 
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20"
      >
        <ArrowDownCircle size={32} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Home;