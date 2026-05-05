import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "../EditableText";

const Contact = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Merge Data: Prioritizes Deployed Data over Context Data
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});

  // --- Dynamic Color Inversion ---
  const mainBg = data.themeBg || "#ffffff";
  const mainFg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  // Swap colors for the footer "Pulse" effect
  const sectionBg = mainFg; 
  const sectionFg = mainBg;

  return (
    <section 
      id="contact" 
      className="min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 transition-colors duration-500" 
      style={{ backgroundColor: sectionBg, color: sectionFg }}
    >
      
      {/* Editorial Header */}
      <div className="max-w-[95%] mx-auto w-full">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.4, y: 0 }}
          className="text-[10px] font-mono uppercase tracking-[0.4em] mb-12"
        >
          // (05) Connection
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter mb-20"
        >
          <EditableText
            value={data.contactTitle || "Let's Build Something"}
            onChange={(val) => setPortfolioData({ ...data, contactTitle: val })}
            readOnly={isReadOnly}
            multiline
          />
          <br/> 
          <span className="text-transparent" style={{ WebkitTextStroke: `1px ${sectionFg}` }}>
            <EditableText
              value={data.contactAccent || "Iconic."}
              onChange={(val) => setPortfolioData({ ...data, contactAccent: val })}
              readOnly={isReadOnly}
            />
          </span>
        </motion.h2>
      </div>

      {/* Action Area */}
      <div className="w-full border-t border-dashed pt-12" style={{ borderColor: `${sectionFg}30` }}>
        <div className="max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
            
            {/* Email Contact */}
            <div className="group">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-4">Drop a line</p>
              <a 
                href={`mailto:${data.email || "hello@foliofyx.com"}`}
                className="text-3xl md:text-5xl font-black tracking-tighter uppercase break-all hover:opacity-50 transition-opacity"
              >
                <EditableText
                  value={data.email || "hello@foliofyx.com"}
                  onChange={(val) => setPortfolioData({ ...data, email: val })}
                  readOnly={isReadOnly}
                />
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-4 md:justify-end">
               {data.linkedin && (
                 <a 
                   href={data.linkedin} 
                   target="_blank" 
                   rel="noreferrer"
                   className="px-8 py-4 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black" 
                   style={{ borderColor: `${sectionFg}30`, color: sectionFg }}
                 >
                   LinkedIn
                 </a>
               )}
               {data.github && (
                 <a 
                   href={data.github} 
                   target="_blank" 
                   rel="noreferrer"
                   className="px-8 py-4 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black" 
                   style={{ borderColor: `${sectionFg}30`, color: sectionFg }}
                 >
                   Github
                 </a>
               )}
            </div>
        </div>

        {/* Studio Credits */}
        <div className="max-w-[95%] mx-auto mt-24 flex justify-between items-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
           <span>FolioFYX Studio ©2026</span>
           <span className="hidden md:block">Inspired by the Grand Era</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;