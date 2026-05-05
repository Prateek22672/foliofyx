import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Mail, Linkedin } from "lucide-react";

// Components
import EditableText from "../EditableText";

const Contact = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};

  // --- Dynamic Color Logic ---
  // We use the main font color as the section background and the 
  // main background as the text color to create a "Pulse" contrast effect.
  const mainBg = data.themeBg || "#ffffff";
  const mainFg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";

  const sectionBg = mainFg; // Background becomes the font color
  const sectionFg = mainBg; // Text becomes the background color

  return (
    <motion.section 
        id="contact" 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-24 px-6 md:px-12 rounded-t-[3rem] -mt-10 relative z-10 overflow-hidden transition-colors duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
        style={{ 
            backgroundColor: sectionBg, 
            color: sectionFg,
            borderTop: `1px solid ${sectionFg}10` 
        }}
    >
      {/* Dynamic Glow - Uses the accent color for a subtle atmospheric feel */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20" 
        style={{ backgroundColor: accent }} 
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
         
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] mb-12"
            style={{ color: sectionFg }}
         >
            (05) / Connection
         </motion.div>
         
         <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-16"
         >
            <EditableText
              value={data.contactTitle || "Let's build something."}
              onChange={(val) => setPortfolioData({ ...data, contactTitle: val })}
              readOnly={isReadOnly}
              multiline
            />
         </motion.h2>
         
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12"
         >
            {/* Primary Email Button */}
            <div className="flex flex-col gap-3">
                <a 
                  href={`mailto:${data.email || "hello@example.com"}`} 
                  className="px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                  style={{ backgroundColor: sectionFg, color: sectionBg }}
                >
                   <Mail size={18} strokeWidth={2.5} /> Send an Email
                </a>
                {!isReadOnly && (
                    <div className="text-[9px] font-mono opacity-30 lowercase">
                        <EditableText 
                            value={data.email || "your@email.com"} 
                            onChange={(v) => setPortfolioData({...data, email: v})} 
                            readOnly={isReadOnly} 
                        />
                    </div>
                )}
            </div>
            
            {/* Secondary LinkedIn Button */}
            {data.linkedin && (
                <div className="flex flex-col gap-3">
                    <a 
                        href={data.linkedin} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-12 py-6 border-2 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-white hover:text-black"
                        style={{ borderColor: `${sectionFg}30`, color: sectionFg }}
                    >
                        <Linkedin size={18} strokeWidth={2.5} /> LinkedIn
                    </a>
                    {!isReadOnly && (
                        <div className="text-[9px] font-mono opacity-30 lowercase">
                            <EditableText 
                                value={data.linkedin || "linkedin.url"} 
                                onChange={(v) => setPortfolioData({...data, linkedin: v})} 
                                readOnly={isReadOnly} 
                            />
                        </div>
                    )}
                </div>
            )}
         </motion.div>

         {/* Extra Footer Detail */}
         <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            transition={{ delay: 1 }}
            className="mt-32 pt-8 border-t border-dashed text-[10px] font-black uppercase tracking-[0.5em]"
            style={{ borderColor: `${sectionFg}20` }}
         >
            Available for worldwide collaboration
         </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;