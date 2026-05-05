import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "./EditableText"; 

const Projects = ({ portfolioData: propData, isReadOnly = false }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};

  const canEdit = !isReadOnly;
  const animClass = isReadOnly ? "fade-up" : "";

  const projects = Array.isArray(data.projects) 
    ? data.projects.filter(p => typeof p === 'object' && p !== null) 
    : [];

  useFadeInOnScroll();

  const handleLiveUpdate = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const muted = `${fg}99`;
  const borderColor = `${fg}20`;

  return (
    <section 
      id="projects" 
      className="py-20 px-4 md:px-8 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        <div className={`flex flex-col md:flex-row justify-between mb-20 ${animClass}`}>
           <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Works</h2>
           <span className="text-sm font-bold uppercase rounded-full px-4 py-2 h-fit mt-4 md:mt-0" style={{ border: `1px solid ${fg}` }}>
             03 / Selected
           </span>
        </div>

        <div className="flex flex-col">
          {projects.length > 0 ? (
            projects.map((p, i) => (
              <div 
                key={i} 
                className={`group relative py-16 flex flex-col md:flex-row gap-8 md:gap-20 items-start ${animClass}`}
                style={{ borderTop: `1px solid ${borderColor}` }}
              >
                 <span className="text-sm font-mono mt-2" style={{ color: muted }}>(0{i+1})</span>

                 <div className="flex-grow w-full">
                    {/* EDITABLE TITLE */}
                    <div className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                      <EditableText 
                        value={p.title || ""} 
                        readOnly={isReadOnly} 
                        onSave={(val) => handleLiveUpdate(i, "title", val)}
                        placeholder="Project Name"
                      />
                    </div>
                    
                    {/* EDITABLE TECH STACK */}
                    <div className="text-xs uppercase font-bold tracking-widest mb-4 opacity-60">
                      <EditableText 
                        value={p.tech || ""} 
                        readOnly={isReadOnly} 
                        onSave={(val) => handleLiveUpdate(i, "tech", val)}
                        placeholder="Technologies Used"
                      />
                    </div>

                    {/* NEW: EDITABLE DESCRIPTION */}
                    <div className="text-lg max-w-2xl mb-8 leading-relaxed" style={{ color: muted }}>
                      <EditableText 
                        value={p.description || ""} 
                        readOnly={isReadOnly} 
                        isTextArea={true} // Set to true for long text
                        onSave={(val) => handleLiveUpdate(i, "description", val)}
                        placeholder="Add a detailed description of the project, the problems it solves, and your role."
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-6 items-center">
                       <div className="flex flex-col gap-2">
                         <a href={p.demo || "#"} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full text-sm font-bold transition hover:opacity-80 text-center" style={{ backgroundColor: fg, color: bg }}>
                           Live Site
                         </a>
                         {canEdit && (
                           <div className="text-[10px] opacity-60">
                             <EditableText value={p.demo || ""} readOnly={isReadOnly} onSave={(val) => handleLiveUpdate(i, "demo", val)} placeholder="Demo URL" />
                           </div>
                         )}
                       </div>

                       <div className="flex flex-col gap-2">
                         <a href={p.github || "#"} target="_blank" rel="noreferrer" className="px-6 py-2 border rounded-full text-sm font-bold transition hover:opacity-80 text-center" style={{ borderColor: fg, color: fg }}>
                           Github
                         </a>
                         {canEdit && (
                           <div className="text-[10px] opacity-60">
                             <EditableText value={p.github || ""} readOnly={isReadOnly} onSave={(val) => handleLiveUpdate(i, "github", val)} placeholder="Github URL" />
                           </div>
                         )}
                       </div>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center opacity-50 italic">No projects found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;