import React, { useEffect } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";
const DEFAULT_ACCENT = "#8b5cf6"; 

// Helper to fix links
const formatUrl = (url) => {
  if (!url) return null;
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
};

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  
  // 1. Get Data
  const data = propData || contextData || {};
  
  // 2. Extract Theme Colors
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const accent = data.accentColor || DEFAULT_ACCENT;
  
  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

  return (
    <section 
      id="projects" 
      className="py-32 px-6 sm:px-12 lg:px-24 font-[Switzer] transition-colors duration-500"
      // APPLY THEME BG AND FG HERE
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-up">
          <div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-4">Selected Work</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Featured Projects
            </h2>
            {/* Accent Bar */}
            <div 
              className="h-1.5 w-24 rounded-full" 
              style={{ backgroundColor: accent }}
            ></div>
          </div>
          <p className="opacity-60 text-lg mt-6 md:mt-0 max-w-sm text-right leading-relaxed font-medium">
            Crafted with precision. <br /> Focused on functionality and aesthetics.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
           <div 
             className="py-24 text-center border border-dashed rounded-[2rem] opacity-60 fade-up"
             style={{ borderColor: `${fg}30` }} // Border matches text color with transparency
           >
             <p className="text-xl">No projects found. Add some in your dashboard!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((p, i) => {
              
              const symbol = p.title ? p.title.charAt(0) : "</>";
              const githubLink = formatUrl(p.github); 
              const demoLink = formatUrl(p.demo);    

              return (
                <div
                  key={i}
                  className="group relative flex flex-col h-full fade-up"
                >
                  {/* --- CARD THUMBNAIL --- */}
                  <div 
                    className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] mb-6 transition-all duration-700 hover:shadow-2xl group-hover:-translate-y-2 border"
                    style={{ 
                        // Gradient uses Accent color, border uses Font color
                        background: `linear-gradient(135deg, ${accent}15 0%, ${accent}40 100%)`, 
                        borderColor: `${fg}15`
                    }}
                  >
                    
                    {/* Background Letter (Decoration) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span 
                        className="text-[12rem] md:text-[15rem] font-black mix-blend-overlay select-none group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        style={{ color: accent, opacity: 0.4 }} 
                      >
                        {symbol}
                      </span>
                    </div>

                    {/* Overlay Buttons (Show on Hover) */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center gap-4 z-20">
                       
                       {/* Github Button */}
                       {githubLink && (
                        <a 
                          href={githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg bg-white text-black border-2 border-white"
                        >
                          GitHub
                        </a>
                      )}

                      {/* Live Demo Button */}
                      {demoLink && (
                        <a 
                          href={demoLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg border-2"
                          style={{ 
                              backgroundColor: accent, 
                              color: "#ffffff",
                              borderColor: accent
                          }}
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* --- TEXT INFO --- */}
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h3 
                        className="text-3xl font-bold leading-tight transition-colors" 
                        // Explicitly uses FG color
                        style={{ color: fg }}
                      >
                        {p.title || "Untitled Project"}
                      </h3>
                      <p 
                        className="mt-2 text-lg leading-relaxed line-clamp-2 opacity-60" 
                        // Uses FG color with opacity for description
                        style={{ color: fg }}
                      >
                        {p.description || "No description provided."}
                      </p>
                    </div>
                    
                    {/* Tech Badge */}
                    <div className="shrink-0 ml-4">
                        <span 
                            className="inline-block px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider"
                            style={{ 
                                borderColor: `${accent}40`, 
                                color: accent,
                                backgroundColor: bg // Matches section background
                            }}
                        >
                          {p.tech || "Dev"}
                        </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;