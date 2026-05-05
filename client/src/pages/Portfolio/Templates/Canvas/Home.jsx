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

  // Animation Variants for Staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const handleNameChange = (newName) => {
    const lastName = data.name ? data.name.split(" ").slice(1).join(" ") : "";
    const fullName = lastName ? `${newName} ${lastName}` : newName;
    setPortfolioData({ ...data, name: fullName });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000 font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* ── GRAIN OVERLAY ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ── BACKGROUND LAYER: GIANT KINETIC TEXT ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
          animate={{ opacity: 0.04, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="text-[45vw] font-black uppercase tracking-tighter leading-none italic select-none"
          style={{ color: fg }}
        >
          {firstName}
        </motion.h1>
      </div>

      {/* ── AMBIENT GLOWS ── */}
      <div 
        className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse"
        style={{ background: `radial-gradient(circle, ${accent}44 0%, transparent 70%)` }}
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center"
      >
        
        {/* ── LEFT SIDE: CONTENT ── */}
        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
          <motion.div variants={itemVariants}>
            <div 
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 backdrop-blur-2xl shadow-xl"
              style={{ background: `${fg}08` }}
            >
              <Sparkles size={12} className="animate-spin-slow" style={{ color: accent }} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-90">
                Available for worldwide projects
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-7xl md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase italic">
              <EditableText
                value={firstName}
                onChange={handleNameChange}
                readOnly={isReadOnly}
              />
              <span className="inline-block" style={{ color: accent }}>.</span>
            </h1>
            
            <div className="flex items-center gap-6">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 1, delay: 1 }}
                className="h-[1px] opacity-40" 
                style={{ backgroundColor: fg }} 
              />
              <div className="text-2xl md:text-4xl font-extralight tracking-tight opacity-80 italic">
                <EditableText
                  value={data.role || "Creative Developer"}
                  onChange={(val) => setPortfolioData({ ...data, role: val })}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </motion.div>

          {/* FIXED: motion.div instead of motion.p to allow nested divs from EditableText */}
          <motion.div variants={itemVariants} className="text-xl md:text-2xl font-medium max-w-xl leading-relaxed opacity-40">
            <EditableText
              value={data.bio || "Crafting high-fidelity digital systems through intentional design and clean code."}
              onChange={(val) => setPortfolioData({ ...data, bio: val })}
              readOnly={isReadOnly}
              multiline
            />
          </motion.div>

          {/* ── ACTION BUTTONS ── */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5 pt-8">
            <a 
              href="#projects" 
              className="group relative flex items-center gap-4 px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95"
              style={{ backgroundColor: fg, color: bg }}
            >
              Explore Folio 
              <ExternalLink size={16} className="transition-transform duration-500 group-hover:rotate-45" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </a>

            {data.cvLink && (
              <a 
                href={data.cvLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-4 px-10 py-5 rounded-full border border-white/20 font-black text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-white/5 hover:border-white/40 active:scale-95 backdrop-blur-md"
                style={{ color: fg }}
              >
                Journal / CV <FileText size={16} className="opacity-50" />
              </a>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT SIDE: PORTRAIT PORTAL ── */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative group perspective-1000">
            <motion.div 
              animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 border border-current opacity-10 rounded-[3rem] translate-x-6 translate-y-6 -z-10" 
            />
            
            <div className="relative w-72 h-96 md:w-[420px] md:h-[560px] overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
              <EditableImage
                src={data?.image}
                fallbackSrc="/themes/default-dp.avif"
                onImageUpload={(url) => setPortfolioData({ ...data, image: url })}
                isReadOnly={isReadOnly}
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 ease-in-out group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-3xl border border-white/20 px-8 py-4 rounded-full flex gap-8 shadow-2xl items-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <a href={data?.linkedin} target="_blank" rel="noreferrer" className="hover:scale-125 transition-all duration-300">
                  <img src={linkedinLogo} className="w-5 h-5 invert" alt="LinkedIn" />
                </a>
                <div className="w-[1px] h-4 bg-white/20" />
                <a href={data?.github} target="_blank" rel="noreferrer" className="hover:scale-125 transition-all duration-300">
                  <img src={githubLogo} className="w-5 h-5 invert" alt="GitHub" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, y: [0, 10, 0] }} 
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] rotate-90 mb-8 origin-left">Scroll</span>
          <ArrowDownCircle size={24} strokeWidth={1} />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;