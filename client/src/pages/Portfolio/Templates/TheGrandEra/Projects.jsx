import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const projects = data.projects || [];

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";

  return (
    <section id="projects" className="py-32 px-4 md:px-6" style={{ backgroundColor: bg, color: fg }}>
       <div className="max-w-[95%] mx-auto mb-20 flex justify-between items-end">
          <h2 className="text-[12vw] leading-none font-black uppercase tracking-tighter">
            Selected <br/> Works
          </h2>
          <span className="hidden md:block text-2xl font-bold animate-pulse">↓</span>
       </div>

       <div className="flex flex-col gap-32">
          {projects.map((p, i) => {
             // 🛠️ FIX: Safely determine the tech label
             // 1. If it's an Array (New Editor), take the first item.
             // 2. If it's a String (Old Data), split by comma and take the first.
             // 3. Fallback to "WEB DEV" if empty.
             const techLabel = Array.isArray(p.tech) 
               ? (p.tech[0] || "WEB DEV")
               : (p.tech ? p.tech.split(',')[0] : "WEB DEV");

             return (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 100 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
                 transition={{ duration: 0.8 }}
                 className="group relative w-full"
               >
                 {/* Image Container with Parallax Hover */}
                 <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    
                    {/* Placeholder pattern if no image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black p-10 flex items-center justify-center">
                       <h3 className="text-white text-[10vw] font-black opacity-10 uppercase">{p.title}</h3>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 w-full flex justify-between items-end mix-blend-difference text-white">
                      <div>
                        {/* ✅ FIX APPLIED HERE: Using the calculated techLabel variable */}
                        <span className="text-sm font-mono border border-white/40 px-3 py-1 rounded-full mb-4 inline-block">
                           {techLabel}
                        </span>
                        <h3 className="text-4xl md:text-7xl font-bold uppercase">{p.title}</h3>
                      </div>
                      <a 
                        href={p.demo} 
                        target="_blank" 
                        rel="noreferrer" // Good practice for target="_blank"
                        className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm md:text-xl uppercase scale-0 group-hover:scale-100 transition-transform duration-300"
                      >
                        View
                      </a>
                    </div>
                 </div>
                 
                 <div className="mt-4 flex justify-between items-start border-t pt-4" style={{ borderColor: fg }}>
                   <p className="text-xs font-mono uppercase">0{i + 1} / Project</p>
                   <p className="max-w-md text-right text-lg font-light">{p.desc}</p>
                 </div>
               </motion.div>
             );
          })}
       </div>
    </section>
  );
};

export default Projects;