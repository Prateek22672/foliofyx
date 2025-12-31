import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Projects = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};

  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const borderColor = `${fg}20`;

  const projects = Array.isArray(data.projects) ? data.projects : [];

  useFadeInOnScroll([projects.length]);

return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col"
      style={{ background: bg, color: fg, borderBottom: `1px solid ${borderColor}` }}
    >
      <div className="flex-grow grid md:grid-cols-2 h-full">
         
         {/* LEFT: Sticky Title */}
         <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-gray-100" style={{ borderColor: borderColor }}>
            <div className="sticky top-32 fade-up">
               <span className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 block">03 / Works</span>
               <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none">
                 Selected<br/>Projects.
               </h2>
            </div>
         </div>

         {/* RIGHT: Grid of Projects */}
         <div className="p-8 md:p-16 grid grid-cols-1 gap-12">
            {projects.length === 0 ? (
              <p  className="italic fade-up">
                No projects added yet
              </p>
            ) : (
              projects.map((p, i) => (
                <div
                  key={i}
                  className="group relative border border-b-4 border-r-4 p-8 transition-transform duration-300 hover:-translate-y-1 fade-up"
                  style={{
                    borderColor: fg,
                    background: bg
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold uppercase tracking-tighter" style={{ color: fg }}>
                      {p.title}
                    </h4>
                    <span className="text-xs font-mono px-2 py-1 border rounded" style={{ borderColor: borderColor }}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Fixed the Double Style Prop Here */}
                  <p 
                    className="text-sm font-mono mb-8 border-b pb-4" 
                  >
                    {p.tech || "Tech not specified"}
                  </p>

                  <div className="flex gap-4 font-bold text-sm uppercase tracking-wide">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: fg }}
                      >
                        [ GitHub ]
                      </a>
                    )}

                    {p.demo && (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: fg }}
                      >
                        [ Live Demo ]
                      </a>
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