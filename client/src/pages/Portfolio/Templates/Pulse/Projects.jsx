// src/pages/Portfolio/Templates/Pulse/Projects.jsx

import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

/**
 * Pulse Template: Projects Component
 * Minimalist horizontal list layout with large typography and integrated editing.
 */
const Projects = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  
  // Priority: Prop Data > Context Data > Empty Object
  const data = propData || contextData || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  useFadeInOnScroll();

  // Theme & Styles
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const accent = data.accentColor || "#ad0000";
  const borderColor = `${fg}15`;

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
      className="py-32 px-6 relative transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-20 opacity-40">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">(04) Selected Works</span>
          <div className="h-[1px] w-12 bg-current"></div>
        </div>

        <div className="flex flex-col">
          {projects.map((p, i) => (
            <div 
              key={i} 
              className="group relative border-t py-20 flex flex-col lg:grid lg:grid-cols-12 gap-8 transition-all px-4 -mx-4 overflow-hidden"
              style={{ borderColor: borderColor }}
            >
              {/* 1. Indexing (01, 02, etc.) */}
              <div className="lg:col-span-1">
                <span className="text-sm font-mono opacity-30 tracking-tighter">(0{i + 1})</span>
              </div>

              {/* 2. Project Core Info (Title & Description) */}
              <div className="lg:col-span-7">
                <h3 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-6 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                  <EditableText
                    value={p.title || "Untitled Project"}
                    onChange={(val) => handleUpdateProject(i, 'title', val)}
                    readOnly={isReadOnly}
                  />
                </h3>
                
                <div className="max-w-xl text-lg opacity-60 leading-relaxed mb-8">
                  <EditableText
                    value={p.description || "Describe the technical challenges, creative vision, and final impact of this project."}
                    onChange={(val) => handleUpdateProject(i, 'description', val)}
                    readOnly={isReadOnly}
                    multiline
                  />
                </div>
              </div>

              {/* 3. Meta Data & Action Links */}
              <div className="lg:col-span-4 flex flex-col lg:items-end justify-between gap-8">
                
                {/* Tech Stack Chips */}
                <div className="text-sm font-mono uppercase tracking-widest text-indigo-400">
                  <EditableText
                    value={p.tech || "Tech / Stack / Tools"}
                    onChange={(val) => handleUpdateProject(i, 'tech', val)}
                    readOnly={isReadOnly}
                  />
                </div>

                {/* External Buttons Container */}
                <div className="flex flex-wrap gap-4 lg:justify-end">
                  
                  {/* Live Demo Action */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <a 
                      href={p.demo || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 text-center shadow-lg active:scale-95"
                      style={{ backgroundColor: fg, color: bg }}
                    >
                      Live Demo
                    </a>
                    <div className="text-[9px] opacity-40 text-center font-mono lowercase truncate max-w-[140px]">
                      <EditableText
                        value={p.demo || "https://demo-url.com"}
                        onChange={(val) => handleUpdateProject(i, 'demo', val)}
                        readOnly={isReadOnly}
                      />
                    </div>
                  </div>

                  {/* Source Code Action */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <a 
                      href={p.github || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all hover:bg-white hover:text-black text-center shadow-lg active:scale-95"
                      style={{ borderColor: fg, color: fg }}
                    >
                      Source Code
                    </a>
                    <div className="text-[9px] opacity-40 text-center font-mono lowercase truncate max-w-[140px]">
                      <EditableText
                        value={p.github || "https://github.com/repo"}
                        onChange={(val) => handleUpdateProject(i, 'github', val)}
                        readOnly={isReadOnly}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Subtle Animated Hover Background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none -z-10"
                style={{ backgroundColor: fg }}
              ></div>
            </div>
          ))}
          
          {/* Closing Line for the project list */}
          <div className="border-t" style={{ borderColor: borderColor }}></div>
        </div>
      </div>
    </section>
  );
};

export default Projects;