import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  // 1. LOGIC: Check if we are in Editor Mode
  // The Editor passes 'propData'. The live site uses Context.
  const isEditor = Boolean(propData);

  // 2. LOGIC: Conditional Animation Class
  // If Editor -> No class (Visible immediately)
  // If Live Site -> "fade-up" (Animate on scroll)
  const animClass = isEditor ? "" : "fade-up";

  // 3. LOGIC: Get Safe Projects Data
  const projects = Array.isArray(data.projects) 
    ? data.projects.filter(p => typeof p === 'object' && p !== null && p.title) 
    : [];

  // Always run the hook (React rules), but it only affects elements with the class 'fade-up'
  useFadeInOnScroll();

  // --- Theme ---
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
        
        {/* Header - Added {animClass} */}
        <div className={`flex flex-col md:flex-row justify-between mb-20 ${animClass}`}>
           <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Works</h2>
           <span 
             className="text-sm font-bold uppercase rounded-full px-4 py-2 h-fit mt-4 md:mt-0"
             style={{ border: `1px solid ${fg}` }}
           >
             03 / Selected
           </span>
        </div>

        <div className="flex flex-col">
          {projects.length > 0 ? (
            projects.map((p, i) => (
              <div 
                key={i} 
                // ✅ Added {animClass} here: 
                // - In Editor: It's empty string (Visible Instantly)
                // - In Live Site: It's "fade-up" (Animates)
                className={`group relative py-16 flex flex-col md:flex-row gap-8 md:gap-20 items-start ${animClass}`}
                style={{ borderTop: `1px solid ${borderColor}` }}
              >
                 
                 {/* Index */}
                 <span className="text-sm font-mono mt-2" style={{ color: muted }}>
                   (0{i+1})
                 </span>

                 {/* Content */}
                 <div className="flex-grow">
                   <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 group-hover:opacity-70 transition-opacity">
                     {p.title}
                   </h3>
                   <p className="text-lg max-w-xl mb-8" style={{ color: muted }}>
                     {p.tech || "Full Stack Development"}
                   </p>
                   
                   <div className="flex gap-4">
                     {p.demo && (
                       <a 
                         href={p.demo} 
                         target="_blank" 
                         rel="noreferrer" 
                         className="px-6 py-2 rounded-full text-sm font-bold transition hover:opacity-80"
                         style={{ backgroundColor: fg, color: bg }}
                       >
                         Live Site
                       </a>
                     )}
                     {p.github && (
                       <a 
                         href={p.github} 
                         target="_blank" 
                         rel="noreferrer" 
                         className="px-6 py-2 border rounded-full text-sm font-bold transition hover:opacity-80"
                         style={{ borderColor: fg, color: fg }}
                       >
                         Github
                       </a>
                     )}
                   </div>
                 </div>

                 {/* Decorative Arrow */}
                 <div className="hidden md:block text-4xl group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-300">
                   ↗
                 </div>
              </div>
            ))
          ) : (
            // Placeholder
            <div className="py-20 text-center opacity-50 italic">
               Add projects in the editor to see them here.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Projects;