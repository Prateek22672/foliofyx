import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

const DEFAULT_FG = "#111827";
const GRADIENTS = ["from-violet-200 to-pink-200", "from-blue-200 to-cyan-200", "from-teal-200 to-emerald-200", "from-orange-200 to-amber-200"];

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const fg = data.themeFont || DEFAULT_FG;
  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  return (
    <section id="projects" className="py-32 px-6 sm:px-12 lg:px-24 font-[Switzer]">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-up">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4" style={{ color: fg }}>
              <EditableText 
                value={data.projectHeader || "Selected Work"} 
                onChange={(v) => setPortfolioData({...data, projectHeader: v})} 
                readOnly={isReadOnly} 
              />
            </h2>
            <div className="h-1.5 w-24 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((p, i) => (
            <div key={i} className="group relative flex flex-col h-full fade-up">
              
              {/* --- THUMBNAIL AREA --- */}
              <div className={`relative aspect-[5/4] w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} mb-8 transition-all duration-700 shadow-sm group-hover:shadow-xl`}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[12rem] md:text-[15rem] font-black text-white mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-110">
                    {p.title?.charAt(0) || "</>"}
                  </span>
                </div>
              </div>

              {/* --- INFO AREA --- */}
              <div className="flex flex-col flex-grow px-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-3xl font-black uppercase tracking-tighter" style={{ color: fg }}>
                      <EditableText value={p.title} onChange={(v) => handleUpdateProject(i, 'title', v)} readOnly={isReadOnly} />
                    </h3>
                  </div>
                  <div className="shrink-0 ml-4">
                     <span className="inline-block px-3 py-1 rounded-full border border-current opacity-30 text-[10px] font-bold uppercase tracking-widest">
                       <EditableText value={p.tech || "Dev"} onChange={(v) => handleUpdateProject(i, 'tech', v)} readOnly={isReadOnly} />
                     </span>
                  </div>
                </div>

                <div className="text-lg leading-relaxed opacity-60 mb-8 flex-grow font-medium">
                  <EditableText value={p.description} onChange={(v) => handleUpdateProject(i, 'description', v)} readOnly={isReadOnly} multiline />
                </div>

                {/* --- ALWAYS VISIBLE ACTION BUTTONS --- */}
                <div className="flex flex-wrap items-center gap-4 mt-auto">
                   <a 
                      href={p.github || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`flex-1 min-w-[140px] py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all hover:scale-105 active:scale-95 shadow-lg ${!p.github && isReadOnly ? 'pointer-events-none opacity-20' : ''}`}
                      style={{ backgroundColor: fg, color: data.themeBg || "#fff" }}
                   >
                     Source Code
                   </a>
                   
                   <a 
                      href={p.demo || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`flex-1 min-w-[140px] py-4 rounded-full border-2 font-black text-[10px] uppercase tracking-[0.2em] text-center transition-all hover:bg-current hover:text-white ${!p.demo && isReadOnly ? 'pointer-events-none opacity-20' : ''}`}
                      style={{ borderColor: `${fg}20`, color: fg }}
                   >
                     Live Demo
                   </a>
                </div>

                {/* --- EDITOR URL INPUTS (Only visible in Editor Mode) --- */}
                {!isReadOnly && (
                  <div className="mt-8 pt-6 border-t border-dashed border-current/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[9px] font-mono opacity-40">
                      <span className="font-bold">GH:</span>
                      <EditableText value={p.github || ""} placeholder="https://github.com/..." onChange={(v) => handleUpdateProject(i, 'github', v)} readOnly={isReadOnly} />
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono opacity-40">
                      <span className="font-bold">WEB:</span>
                      <EditableText value={p.demo || ""} placeholder="https://..." onChange={(v) => handleUpdateProject(i, 'demo', v)} readOnly={isReadOnly} />
                    </div>
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