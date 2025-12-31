import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const skills = Array.isArray(data?.skills) ? data.skills : [];

  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  return (
    <section id="about" className="relative py-32 overflow-hidden" style={{ backgroundColor: bg, color: fg }}>
      
      {/* --- CONTINUITY FIX: Background Blobs --- */}
      
      {/* 1. Bridge Blob (Top Left) - Matches Home Bottom Left */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 pointer-events-none" 
        style={{ backgroundColor: fg }} 
      />

      {/* 2. Atmosphere Blob (Top Right) - Adds depth */}
      <div 
        className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none" 
        style={{ backgroundColor: accent }} 
      />

      {/* 3. Subtle Gradient Overlay at Top to Smooth the Edge */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${bg}, transparent)` }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Header */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold inline-block tracking-tight">
              The <span style={{ color: accent }}>Developer</span> Stack
            </h2>
            <div className="h-1.5 w-24 mx-auto mt-4 rounded-full opacity-20" style={{ backgroundColor: fg }}></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
            
            {/* Left: Bio & Profile */}
            <motion.div 
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="p-10 rounded-[2.5rem] border backdrop-blur-xl relative group overflow-hidden"
              style={{ borderColor: `${fg}15`, backgroundColor: `${fg}03` }}
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               
               <div className="flex items-center gap-6 mb-8">
                 <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style={{ backgroundColor: `${accent}15`, color: accent }}>
                   <i className="fa-solid fa-user-astronaut"></i>
                 </div>
                 <h3 className="text-3xl font-bold">About Me</h3>
               </div>

               <p className="text-lg leading-loose mb-10 font-light" style={{ opacity: 0.8 }}>
                 {data.bio || "I specialize in building robust web applications using modern technologies. I transform complex problems into simple, beautiful, and intuitive interface designs."}
               </p>

               <div className="flex gap-4">
                  {[
                    { link: data.linkedin, icon: "fa-linkedin" },
                    { link: data.github, icon: "fa-github" },
                    { link: `mailto:${data.email}`, icon: "fa-envelope" }
                  ].map((social, idx) => social.link && (
                    <a 
                      key={idx}
                      href={social.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-12 h-12 rounded-full border flex items-center justify-center text-xl transition-all hover:scale-110 hover:rotate-6"
                      style={{ borderColor: `${fg}20`, color: fg, backgroundColor: bg }}
                    >
                      <i className={`fa-brands ${social.icon.includes('envelope') ? 'fa-solid' : ''} ${social.icon}`}></i>
                    </a>
                  ))}
               </div>
            </motion.div>

            {/* Right: Stack & Stats */}
            <div className="flex flex-col gap-8">
              
              {/* Skills */}
              <motion.div 
                 variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
                 className="p-8 rounded-[2.5rem] border backdrop-blur-xl h-full"
                 style={{ borderColor: `${fg}15`, backgroundColor: `${fg}03` }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                   <i className="fa-solid fa-layer-group" style={{ color: accent }}></i> Tech Arsenal
                </h3>
                <div className="flex flex-wrap gap-2">
                   {skills.length > 0 ? skills.map((s, i) => (
                      <motion.span 
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-4 py-2 rounded-xl text-sm border cursor-default shadow-sm"
                        style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
                      >
                         {typeof s === 'string' ? s : s.name}
                      </motion.span>
                   )) : (
                     <span className="italic opacity-50">Add skills to showcase...</span>
                   )}
                </div>
              </motion.div>

              {/* Stats Block */}
              <motion.div 
                 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                 className="p-8 rounded-[2.5rem] flex items-center justify-around shadow-xl border border-white/10"
                 style={{ backgroundColor: fg, color: bg }}
              >
                 <div className="text-center">
                    <h2 className="text-5xl font-bold mb-1" style={{ color: accent }}>{data.yearsExp || "1+"}</h2>
                    <p className="text-xs uppercase tracking-widest opacity-70">Years Exp.</p>
                 </div>
                 <div className="w-[1px] h-12 bg-white/20"></div>
                 <div className="text-center">
                    <h2 className="text-5xl font-bold mb-1" style={{ color: accent }}>{data.projects ? data.projects.length : "0"}+</h2>
                    <p className="text-xs uppercase tracking-widest opacity-70">Projects</p>
                 </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;