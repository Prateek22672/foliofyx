import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const borderColor = `${fg}20`;
  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

  const handleUpdateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioData({ ...data, projects: updated });
  };

  return (
    <section id="projects" className="relative min-h-screen flex flex-col" style={{ background: bg, color: fg, borderBottom: `1px solid ${borderColor}` }}>
      <div className="flex-grow grid md:grid-cols-2 h-full">
        
        {/* LEFT: Sticky Title */}
        <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r" style={{ borderColor: borderColor }}>
          <div className="sticky top-32 fade-up">
            <span className="text-xs font-black uppercase tracking-[0.4em] opacity-30 mb-4 block">03 / Selection</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
              Curated<br/><span style={{ color: data.accentColor }}>Works.</span>
            </h2>
          </div>
        </div>

        {/* RIGHT: Editable Projects */}
        <div className="p-8 md:p-16 grid grid-cols-1 gap-16">
          {projects.map((p, i) => (
            <div key={i} className="group border-2 p-8 md:p-12 relative fade-up transition-all hover:bg-current/[0.02]" style={{ borderColor: fg }}>
              {/* Project Index */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-current flex items-center justify-center text-xs font-black" style={{ color: bg }}>0{i + 1}</div>
              
              {/* Title */}
              <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                <EditableText value={p.title || "Project Title"} onChange={(v) => handleUpdateProject(i, 'title', v)} readOnly={isReadOnly} />
              </h4>

              {/* Tech Stack */}
              <div className="text-xs font-black uppercase tracking-widest mb-8 pb-4 border-b inline-block" style={{ color: data.accentColor, borderColor: borderColor }}>
                <EditableText value={p.tech || "React / Node / AI"} onChange={(v) => handleUpdateProject(i, 'tech', v)} readOnly={isReadOnly} />
              </div>

              {/* Description */}
              <div className="text-lg leading-relaxed mb-10 opacity-70">
                <EditableText 
                  value={p.description || "A deep dive into the architecture and solution of this specific challenge."} 
                  onChange={(v) => handleUpdateProject(i, 'description', v)} 
                  readOnly={isReadOnly} 
                  multiline
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-8 items-center pt-8 border-t" style={{ borderColor: borderColor }}>
                {/* Live Demo */}
                <div className="flex flex-col gap-2">
                   <a href={p.demo} target="_blank" rel="noreferrer" className="text-sm font-black uppercase tracking-widest hover:opacity-50">[ Live Site ]</a>
                   {!isReadOnly && (
                     <div className="text-[10px] opacity-40 font-mono">
                        <EditableText value={p.demo || "demo-url.com"} onChange={(v) => handleUpdateProject(i, 'demo', v)} readOnly={isReadOnly} />
                     </div>
                   )}
                </div>

                {/* Source Code */}
                <div className="flex flex-col gap-2">
                   <a href={p.github} target="_blank" rel="noreferrer" className="text-sm font-black uppercase tracking-widest hover:opacity-50">[ Source Code ]</a>
                   {!isReadOnly && (
                     <div className="text-[10px] opacity-40 font-mono">
                        <EditableText value={p.github || "github.com/user/repo"} onChange={(v) => handleUpdateProject(i, 'github', v)} readOnly={isReadOnly} />
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;