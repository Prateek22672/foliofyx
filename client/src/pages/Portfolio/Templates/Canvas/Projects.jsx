import React, { useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import { FolderRoot, ExternalLink, Github } from "lucide-react";

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";
  const muted = `${fg}55`;
  const border = `${fg}15`;

  const projects = Array.isArray(data.projects) ? data.projects : [];

  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  return (
    <section id="projects" className="py-24 px-6 md:px-10 transition-colors duration-500" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16 fade-up">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: `${fg}0d`, borderColor: border }}>
            <FolderRoot size={12} style={{ color: muted }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: muted }}>04 / Selected Works</span>
          </div>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((p, i) => (
            <div key={i} className="group relative flex flex-col h-full fade-up">
              
              {/* Thumbnail / Placeholder */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5 mb-8 border transition-all duration-700 hover:border-current/20" style={{ borderColor: border }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-9xl font-black tracking-tighter uppercase italic">{p.title?.charAt(0) || "P"}</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic" style={{ color: fg }}>
                      <EditableText value={p.title} onChange={(v) => handleUpdateProject(i, 'title', v)} readOnly={isReadOnly} />
                    </h3>
                    <div className="text-[9px] font-bold uppercase tracking-[0.3em] mt-2" style={{ color: accent }}>
                      <EditableText value={p.tech || "Creative Stack"} onChange={(v) => handleUpdateProject(i, 'tech', v)} readOnly={isReadOnly} />
                    </div>
                  </div>
                </div>

                <div className="text-base leading-relaxed opacity-60 mb-10 flex-grow font-medium">
                  <EditableText value={p.description} onChange={(v) => handleUpdateProject(i, 'description', v)} readOnly={isReadOnly} multiline />
                </div>

                {/* Persistent Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                   <a 
                      href={p.demo || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: fg, color: bg }}
                   >
                     Live Demo <ExternalLink size={12} />
                   </a>
                   
                   <a 
                      href={p.github || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 py-4 rounded-full border-2 font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all hover:bg-white hover:text-black flex items-center justify-center gap-2"
                      style={{ borderColor: `${fg}20`, color: fg }}
                   >
                     Source Code <Github size={12} />
                   </a>
                </div>

                {/* Editor-Only URL Controls */}
                {!isReadOnly && (
                  <div className="mt-8 flex flex-col gap-2 opacity-30 text-[9px] font-mono uppercase tracking-widest border-t border-dashed pt-4" style={{ borderColor: border }}>
                    <span>GH: <EditableText value={p.github || ""} placeholder="Link to Code" onChange={(v) => handleUpdateProject(i, 'github', v)} readOnly={isReadOnly} /></span>
                    <span>WEB: <EditableText value={p.demo || ""} placeholder="Link to Demo" onChange={(v) => handleUpdateProject(i, 'demo', v)} readOnly={isReadOnly} /></span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;