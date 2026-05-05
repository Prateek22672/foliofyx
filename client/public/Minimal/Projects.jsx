import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_FG = "#111827";

// A set of "Aurora" gradients to rotate through for the project covers
const GRADIENTS = [
  "from-violet-200 to-pink-200",
  "from-blue-200 to-cyan-200",
  "from-teal-200 to-emerald-200",
  "from-orange-200 to-amber-200",
  "from-fuchsia-200 to-purple-200",
  "from-gray-200 to-slate-300",
];

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const fg = data.themeFont || DEFAULT_FG;
  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

  return (
    <section id="projects" className="py-32 px-6 sm:px-12 lg:px-24 font-[Switzer]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-up">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4" style={{ color: fg }}>
              Selected Work
            </h2>
            <div className="h-1.5 w-24 bg-purple-500 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-500 mt-6 md:mt-0 max-w-sm text-right leading-relaxed font-medium">
            Crafted with precision. <br /> Focused on functionality and aesthetics.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
           <div className="py-24 text-center border border-dashed border-gray-300 rounded-3xl opacity-60 fade-up">
             <p className="text-xl">No projects added yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((p, i) => {
              // 1. Get a distinct gradient for this card
              const gradient = GRADIENTS[i % GRADIENTS.length];
              
              // 2. Get the "Symbol" (First letter or default)
              const symbol = p.title ? p.title.charAt(0) : "</>";

              return (
                <div
                  key={i}
                  className="group relative flex flex-col h-full fade-up"
                >
                  {/* --- THUMBNAIL AREA (Typographic Poster) --- */}
                  <div className={`relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} mb-6 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/20 group-hover:-translate-y-2`}>
                    
                    {/* The Big Artistic Letter/Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[12rem] md:text-[15rem] font-black text-white mix-blend-overlay opacity-60 select-none group-hover:scale-110 transition-transform duration-700 ease-in-out">
                        {symbol}
                      </span>
                    </div>

                    {/* Overlay Content (Hidden by default, slides up on hover) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center gap-4">
                       {p.github && (
                         <a 
                           href={p.github} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                         >
                           GitHub
                         </a>
                       )}
                       {p.demo && (
                         <a 
                           href={p.demo} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="bg-black text-white border border-white/20 px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                         >
                           Live Demo
                         </a>
                       )}
                    </div>
                  </div>

                  {/* --- INFO AREA --- */}
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h3 className="text-3xl font-bold leading-tight group-hover:text-purple-600 transition-colors" style={{ color: fg }}>
                        {p.title}
                      </h3>
                      <p className="mt-2 text-gray-500 text-lg leading-relaxed line-clamp-2">
                        {p.description || "A showcase of technical proficiency and design thinking."}
                      </p>
                    </div>
                    
                    {/* Tech Badge */}
                    <div className="shrink-0 ml-4">
                       <span className="inline-block px-3 py-1 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500 bg-white">
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