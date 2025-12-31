import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  // Retaining the SVG Patterns but making them responsive
  const Patterns = [
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#E0F2FE"/><circle cx="200" cy="125" r="70" fill="#0EA5E9" fillOpacity="0.2"/><rect x="80" y="160" width="240" height="40" rx="10" fill="white" fillOpacity="0.6"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#F3E8FF"/><path d="M0,250 L400,50 L400,250 Z" fill="#8B5CF6" fillOpacity="0.1"/><rect x="60" y="50" width="280" height="150" rx="15" fill="white" fillOpacity="0.8"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#FFF7ED"/><rect x="250" y="40" width="100" height="100" rx="20" fill="#F97316" fillOpacity="0.2"/><path d="M50,200 C100,100 200,100 350,200" stroke="#F97316" strokeWidth="5" fill="none"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#ECFCCB"/><circle cx="200" cy="125" r="60" stroke="#84CC16" strokeWidth="2" fill="none"/></svg>
  ];

  return (
    <section id="projects" className="relative py-32" style={{ backgroundColor: bg, color: fg }}>
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-transparent via-current to-transparent opacity-05 pointer-events-none" style={{ color: accent }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">My <span style={{ color: accent }}>Works</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.length > 0 ? projects.map((p, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -10 }}
               className="group relative rounded-[2.5rem] p-4 border transition-all duration-300 hover:shadow-2xl"
               style={{ backgroundColor: bg, borderColor: `${fg}10` }}
             >
                {/* Project Image Area */}
                <div className="w-full aspect-[16/10] rounded-[2rem] overflow-hidden relative mb-6 border border-black/5">
                   {Patterns[i % 4]}
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer" className="px-8 py-3 bg-white text-black rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Project
                        </a>
                      )}
                   </div>
                </div>

                <div className="px-4 pb-4">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg" style={{ backgroundColor: `${accent}15`, color: accent }}>
                        {p.tech ? p.tech.split(',')[0] : "Project"}
                      </span>
                   </div>
                   <h3 className="text-2xl font-bold mb-3">{p.title}</h3>
                   <p className="text-base leading-relaxed opacity-70 mb-4 line-clamp-2">
                     {p.desc || "A digital masterpiece crafted with precision."}
                   </p>
                </div>
             </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 opacity-50">No projects added yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;