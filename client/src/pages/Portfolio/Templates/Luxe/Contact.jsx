import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Mail, Linkedin } from "lucide-react";

const Contact = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const mainBg = data.themeBg || "#ffffff";
  const mainFg = data.themeFont || "#111827";
  const sectionBg = mainFg; 
  const sectionFg = mainBg; 

  return (
    <motion.section 
        id="contact" 
        // Animate the whole card sliding up
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-12 px-6 md:px-12 rounded-t-[3rem] -mt-10 relative z-10 overflow-hidden transition-colors duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
        style={{ 
            backgroundColor: sectionBg, 
            color: sectionFg,
            borderTop: `1px solid ${sectionFg}10` 
        }}
    >
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" 
        style={{ backgroundColor: `${sectionFg}10` }} 
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
         
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-bold uppercase tracking-widest mb-12"
            style={{ color: sectionFg }}
         >
            Next Steps
         </motion.p>
         
         <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-8xl font-medium tracking-tight mb-12"
         >
            Let's work together.
         </motion.h2>
         
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center gap-6 mt-12"
         >
            <a 
              href={`mailto:${data.email || "hello@example.com"}`} 
              className="px-10 py-5 rounded-full font-normal font-medium text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: sectionFg, color: sectionBg }}
            >
               <Mail size={16} /> Email Me
            </a>
            
            {data.linkedin && (
                <a 
                href={data.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="px-10 py-5 border rounded-full font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 hover:bg-white/10"
                style={{ borderColor: `${sectionFg}30`, color: sectionFg }}
                >
                <Linkedin size={16} /> LinkedIn
                </a>
            )}
         </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;