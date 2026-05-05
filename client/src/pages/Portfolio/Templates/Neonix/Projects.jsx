import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import { ExternalLink, Github } from "lucide-react";

const DEFAULT_BG = "#f8f9fa";
const DEFAULT_FG = "#111111";

const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Merge Data: Prioritize Prop (View Mode) over Context (Edit Mode)
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});
  
  // Theme Config
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const accent = data.accentColor || "#8b5cf6";

  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

  /**
   * Updates a specific field for a project in the array
   */
  const handleUpdateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setPortfolioData({ ...data, projects: updatedProjects });
  };

  return (
    <section 
      id="projects" 
      className="py-32 px-6 sm:px-12 lg:px-24 font-[Switzer] transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 fade-up">
           <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-current/20 rounded-full text-xs font-bold uppercase tracking-widest opacity-60">
                Selected Works
              </div>
              <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
                Featured <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Creations.</span>
              </h2>
           </div>
           <p className="opacity-60 text-lg mt-8 md:mt-0 max-w-sm text-left md:text-right font-medium leading-relaxed">
             A collection of digital solutions where logic meets aesthetic.
           </p>
        </div>

        {/* --- PROJECTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.length === 0 ? (
                <div className="col-span-2 py-24 text-center border-2 border-dashed border-current/10 rounded-[3rem] opacity-40">
                  No projects added yet.
                </div>
            ) : (
                projects.map((p, i) => (
                    <div
                      key={i}
                      className="group relative flex flex-col p-6 rounded-[3rem] border border-current/10 bg-current/5 backdrop-blur-md transition-all duration-500 fade-up"
                    >
                      {/* Visual Card Area */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.2rem] mb-8 shadow-inner bg-black/5">
                         <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}></div>
                         
                         {/* Placeholder Letter */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-10 font-black text-[12vw] select-none">
                            {p.title?.charAt(0) || "P"}
                         </div>

                         {p.image && (
                            <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.title} />
                         )}
                      </div>

                      {/* Project Info Area */}
                      <div className="px-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-3xl font-bold tracking-tight">
                             <EditableText 
                                value={p.title || "Project Name"} 
                                onChange={(v) => handleUpdateProject(i, 'title', v)} 
                                readOnly={isReadOnly} 
                             />
                           </h3>
                           <span className="text-[10px] font-black uppercase tracking-widest opacity-40">0{i + 1}</span>
                        </div>

                        <div className="mb-6 opacity-60 text-lg leading-relaxed min-h-[3em]">
                          <EditableText 
                            value={p.desc || p.description || "Project narrative and details."} 
                            onChange={(v) => handleUpdateProject(i, 'desc', v)} 
                            readOnly={isReadOnly} 
                            multiline
                          />
                        </div>

                        {/* Tech Tags Area */}
                        <div className="mb-8">
                           <div className="flex flex-wrap gap-2">
                             <EditableText 
                                value={p.tech || "React • Tailwind"} 
                                onChange={(v) => handleUpdateProject(i, 'tech', v)} 
                                readOnly={isReadOnly} 
                                className="text-xs font-bold uppercase tracking-widest opacity-50"
                             />
                           </div>
                        </div>

                        {/* Permanent Action Buttons */}
                        <div className="mt-auto pt-6 border-t border-current/10 flex flex-wrap items-center gap-4">
                            {p.demo && (
                                <a 
                                  href={p.demo} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
                                  style={{ backgroundColor: fg, color: bg }}
                                >
                                    <ExternalLink size={14} /> Live Demo
                                </a>
                            )}
                            {p.github && (
                                <a 
                                  href={p.github} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center gap-2 px-6 py-3 border-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:bg-current/10"
                                  style={{ borderColor: `${fg}20`, color: fg }}
                                >
                                    <Github size={14} /> Source Code
                                </a>
                            )}
                        </div>

                        {/* URL Management: Only visible in Editor */}
                        {!isReadOnly && (
                          <div className="mt-6 pt-4 border-t border-dashed border-current/10 flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-[9px] font-mono opacity-30">
                                <span className="font-bold">Live:</span>
                                <EditableText value={p.demo || ""} placeholder="Add live link..." onChange={(v) => handleUpdateProject(i, 'demo', v)} readOnly={isReadOnly} />
                             </div>
                             <div className="flex items-center gap-2 text-[9px] font-mono opacity-30">
                                <span className="font-bold">Code:</span>
                                <EditableText value={p.github || ""} placeholder="Add source link..." onChange={(v) => handleUpdateProject(i, 'github', v)} readOnly={isReadOnly} />
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </section>
  );
};

export default Projects;