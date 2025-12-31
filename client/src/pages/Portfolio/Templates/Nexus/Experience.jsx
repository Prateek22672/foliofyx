import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  // --- SAFE EXPERIENCE DATA ---
  const hasRealJobs = data.experience && Array.isArray(data.experience) && data.experience.length > 0;
  
  const experienceList = hasRealJobs 
    ? data.experience 
    : [
        { role: "Senior Developer", company: "Tech Giant", period: "2023 - Present", desc: "Leading frontend architecture and design systems." },
        { role: "UI Designer", company: "Creative Studio", period: "2021 - 2023", desc: "Designing intuitive user interfaces for mobile apps." },
        { role: "Junior Dev", company: "Startup Inc", period: "2019 - 2021", desc: "Full stack development with React and Node.js." }
      ];

  return (
    <section id="experience" className="relative py-32 overflow-hidden" style={{ backgroundColor: bg, color: fg }}>
      
      {/* --- BACKGROUND BLOBS (Redesigned for Better Visibility) --- */}
      {/* ✅ FIX 1: Reduced size and opacity so they don't obscure content */}
      <div 
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" 
        style={{ backgroundColor: accent }} 
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.02] pointer-events-none" 
        style={{ backgroundColor: fg }} 
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 text-sm font-semibold tracking-wide uppercase" style={{ borderColor: `${fg}20`, backgroundColor: `${fg}05` }}>
             <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></span>
             Career Timeline
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Professional <span style={{ color: accent }}>Journey</span></h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative  ml-4 md:ml-0 md:pl-0 space-y-12 md:space-y-20" style={{ borderColor: `${fg}10` }}>
          
          {/* Center Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -ml-[1px]" style={{ backgroundColor: `${fg}10` }}></div>

          {experienceList.map((item, index) => {
             // Safe Data Extraction
             if (typeof item !== 'object') return null;

             const isEven = index % 2 === 0;

             return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15 }}
                className={`relative md:flex items-center justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div 
                  className="absolute left-[-5px] md:left-1/2 md:-ml-[9px] top-0 md:top-1/2 md:-mt-[9px] h-[18px] w-[18px] rounded-full border-4 z-20 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                  style={{ backgroundColor: bg, borderColor: accent }}
                ></div>

                {/* Empty Half for Desktop Layout */}
                <div className="hidden md:block w-5/12"></div>

                {/* Content Card */}
                <div className="w-full md:w-5/12 pl-8 md:pl-0">
                  <div 
                    // ✅ FIX 2: Added 'backdrop-blur-md' and increased opacity to '08' for better readability
                    className="p-8 rounded-[2rem] border backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group relative overflow-hidden"
                    style={{ backgroundColor: `${fg}08`, borderColor: `${fg}10` }}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex flex-col gap-1 mb-4 relative z-10">
                       <span 
                         className="text-xs font-bold uppercase tracking-widest mb-1 opacity-60"
                         style={{ color: fg }}
                       >
                         {item.period || "202X"}
                       </span>
                       <h3 className="text-2xl font-bold leading-tight">{item.role || "Role"}</h3>
                       <h4 className="text-lg font-medium opacity-80" style={{ color: accent }}>{item.company || "Company"}</h4>
                    </div>

                    <p className="text-base leading-relaxed opacity-70 font-light relative z-10">
                      {item.desc}
                    </p>
                  </div>
                </div>

              </motion.div>
             );
          })}
        </div>

      </div>
    </section>
  );
};

export default Experience;