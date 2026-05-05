import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Components
import EditableText from "../EditableText";

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];

  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  /**
   * Updates a specific field for a project in the array
   */
  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  // Responsive SVG Patterns for project placeholders
  const Patterns = [
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#E0F2FE"/><circle cx="200" cy="125" r="70" fill="#0EA5E9" fillOpacity="0.2"/><rect x="80" y="160" width="240" height="40" rx="10" fill="white" fillOpacity="0.6"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#F3E8FF"/><path d="M0,250 L400,50 L400,250 Z" fill="#8B5CF6" fillOpacity="0.1"/><rect x="60" y="50" width="280" height="150" rx="15" fill="white" fillOpacity="0.8"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#FFF7ED"/><rect x="250" y="40" width="100" height="100" rx="20" fill="#F97316" fillOpacity="0.2"/><path d="M50,200 C100,100 200,100 350,200" stroke="#F97316" strokeWidth="5" fill="none"/></svg>,
    <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none"><rect width="100%" height="100%" fill="#ECFCCB"/><circle cx="200" cy="125" r="60" stroke="#84CC16" strokeWidth="2" fill="none"/></svg>
  ];

  return (
    <section id="projects" className="relative py-32 transition-colors duration-500" style={{ backgroundColor: bg, color: fg }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <EditableText
                value={data.projectSectionTitle || "My Works"}
                onChange={(val) => setPortfolioData({ ...data, projectSectionTitle: val })}
                readOnly={isReadOnly}
            />
          </h2>
          <div className="h-1.5 w-24 mx-auto mt-4 rounded-full opacity-20" style={{ backgroundColor: accent }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((p, i) => (
             <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2.5rem] p-4 border transition-all duration-300 hover:shadow-2xl"
                style={{ backgroundColor: bg, borderColor: `${fg}10` }}
             >
                {/* Project Visual Area */}
                <div className="w-full aspect-[16/10] rounded-[2rem] overflow-hidden relative mb-6 border border-black/5 bg-gray-50">
                   {Patterns[i % 4]}
                </div>

                {/* Project Info */}
                <div className="px-4 pb-4">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg" style={{ backgroundColor: `${accent}15`, color: accent }}>
                        <EditableText
                           value={p.tech || "Tech Stack"}
                           onChange={(val) => handleUpdateProject(i, 'tech', val)}
                           readOnly={isReadOnly}
                        />
                      </span>
                   </div>

                   <h3 className="text-2xl font-bold mb-3">
                      <EditableText
                         value={p.title || "Project Title"}
                         onChange={(val) => handleUpdateProject(i, 'title', val)}
                         readOnly={isReadOnly}
                      />
                   </h3>

                   <div className="text-base leading-relaxed opacity-70 mb-8 min-h-[3em]">
                      <EditableText
                         value={p.description || "A digital masterpiece crafted with modern technology."}
                         onChange={(val) => handleUpdateProject(i, 'description', val)}
                         readOnly={isReadOnly}
                         multiline
                      />
                   </div>

                   {/* Action Buttons Area */}
                   <div className="flex flex-wrap gap-4 mt-auto">
                      
                      {/* Live Demo Button */}
                      <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
                        <a 
                          href={p.demo || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 text-center shadow-lg active:scale-95"
                          style={{ backgroundColor: fg, color: bg }}
                        >
                          Live Demo
                        </a>
                        <div className="text-[9px] opacity-30 text-center font-mono truncate">
                          <EditableText
                            value={p.demo || "https://demo.com"}
                            onChange={(val) => handleUpdateProject(i, 'demo', val)}
                            readOnly={isReadOnly}
                          />
                        </div>
                      </div>

                      {/* Source Code Button */}
                      <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
                        <a 
                          href={p.github || "#"} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all hover:bg-black/5 text-center active:scale-95"
                          style={{ borderColor: `${fg}30`, color: fg }}
                        >
                          Source Code
                        </a>
                        <div className="text-[9px] opacity-30 text-center font-mono truncate">
                          <EditableText
                            value={p.github || "https://github.com"}
                            onChange={(val) => handleUpdateProject(i, 'github', val)}
                            readOnly={isReadOnly}
                          />
                        </div>
                      </div>

                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;