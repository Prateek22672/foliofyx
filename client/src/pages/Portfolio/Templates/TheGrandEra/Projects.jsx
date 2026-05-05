import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Components
import EditableText from "../EditableText";

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  /**
   * Surgical update for a specific project field
   */
  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  return (
    <section id="projects" className="py-24 px-4 md:px-10 transition-colors duration-500" style={{ backgroundColor: bg, color: fg }}>
       
       {/* Refined Section Header */}
       <div className="max-w-[95%] mx-auto mb-20 flex justify-between items-end border-b pb-8" style={{ borderColor: `${fg}40` }}>
          <h2 className="text-[10vw] leading-[0.8] font-black uppercase tracking-tighter">
            <EditableText 
              value={data.projectSectionTitle || "Selected Works"} 
              onChange={(v) => setPortfolioData({...data, projectSectionTitle: v})} 
              readOnly={isReadOnly} 
            />
          </h2>
          <div className="hidden md:block text-right">
             <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-1">Portfolio Archive</p>
             <p className="text-xs font-bold uppercase">{new Date().getFullYear()} Edition</p>
          </div>
       </div>

       <div className="flex flex-col gap-32">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="group relative w-full"
            >
              {/* Cinematic Wide Image Container */}
              <div className="relative w-full aspect-[16/8] md:aspect-[21/8] overflow-hidden bg-gray-900 rounded-sm">
                 <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                 
                 {/* Visual Decor Title */}
                 <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black p-10 flex items-center justify-center select-none">
                    <h3 className="text-white text-[10vw] font-black opacity-5 uppercase tracking-tighter">
                      {p.title || "WORK"}
                    </h3>
                 </div>
                 
                 {/* Overlay Text - Scaled Down */}
                 <div className="absolute inset-0 p-6 md:p-12 z-20 flex flex-col justify-end mix-blend-difference text-white">
                    <div className="max-w-4xl">
                      <span className="text-[10px] md:text-xs font-mono border border-white/30 px-3 py-1 rounded-full mb-4 inline-block uppercase tracking-[0.2em]">
                        <EditableText 
                          value={p.tech || "Framework / Logic"} 
                          onChange={(v) => handleUpdateProject(i, 'tech', v)} 
                          readOnly={isReadOnly} 
                        />
                      </span>
                      <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                        <EditableText 
                          value={p.title || "Project Title"} 
                          onChange={(v) => handleUpdateProject(i, 'title', v)} 
                          readOnly={isReadOnly} 
                        />
                      </h3>
                    </div>
                 </div>
              </div>
              
              {/* Refined Three-Column Editorial Footer */}
              <div className="mt-6 grid md:grid-cols-12 gap-6 items-start border-t pt-6" style={{ borderColor: `${fg}20` }}>
                
                {/* 1. Meta Data */}
                <div className="md:col-span-2">
                   <p className="text-[10px] font-mono uppercase font-bold opacity-30 tracking-widest">Project 0{i + 1}</p>
                </div>

                {/* 2. Narrative - Reduced Text Size */}
                <div className="md:col-span-6">
                   <div className="text-base md:text-lg font-medium leading-relaxed max-w-xl opacity-80">
                     <EditableText 
                        value={p.desc || p.description || "Project narrative and architectural focus goes here."} 
                        onChange={(v) => handleUpdateProject(i, 'desc', v)} 
                        readOnly={isReadOnly} 
                        multiline
                      />
                   </div>
                </div>

                {/* 3. Global Actions - Refined Links */}
                <div className="md:col-span-4 flex flex-col md:items-end gap-4">
                  
                  {/* Demo Link */}
                  <div className="flex flex-col md:items-end group/link">
                    <a 
                      href={p.demo || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm font-black uppercase tracking-tighter transition-all flex items-center gap-1"
                    >
                      <span className="group-hover/link:pr-2 transition-all">Live Presentation</span> ↗
                    </a>
                    {!isReadOnly && (
                      <div className="text-[9px] font-mono opacity-20 lowercase mt-1">
                        <EditableText 
                          value={p.demo || "demo.url"} 
                          onChange={(v) => handleUpdateProject(i, 'demo', v)} 
                          readOnly={isReadOnly} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Code Link */}
                  <div className="flex flex-col md:items-end group/link">
                    <a 
                      href={p.github || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm font-black uppercase tracking-tighter transition-all flex items-center gap-1"
                    >
                      <span className="group-hover/link:pr-2 transition-all">View Repository</span> ↗
                    </a>
                    {!isReadOnly && (
                      <div className="text-[9px] font-mono opacity-20 lowercase mt-1">
                        <EditableText 
                          value={p.github || "github.url"} 
                          onChange={(v) => handleUpdateProject(i, 'github', v)} 
                          readOnly={isReadOnly} 
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
       </div>
    </section>
  );
};

export default Projects;