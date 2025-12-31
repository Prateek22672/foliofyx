import React from "react";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Projects = ({ portfolioData }) => {
  const data = portfolioData || {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const borderColor = `${fg}15`;

  return (
    <section 
      id="projects" 
      className="py-24 px-6 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        <h2 className="text-[10px] font-bold uppercase tracking-widest mb-12 opacity-60">
          (04) — Selected Works
        </h2>

        <div className="flex flex-col">
          {projects.map((p, i) => (
            <div 
              key={i} 
              className="group relative border-t py-16 flex flex-col md:flex-row justify-between items-baseline gap-6 cursor-pointer transition-all hover:opacity-70 px-4 -mx-4"
              style={{ borderColor: borderColor }}
            >
               <span className="text-xl font-mono opacity-40">
                 (0{i+1})
               </span>

               <h3 className="text-5xl md:text-8xl font-black tracking-tighter uppercase transition-transform group-hover:translate-x-4">
                 {p.title}
               </h3>

               <div className="flex flex-col items-end gap-4 md:w-1/3 text-right">
                  <p className="text-sm font-mono opacity-70">
                    {p.tech || "React / Node / Design"}
                  </p>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.demo && <a href={p.demo} className="underline decoration-2 underline-offset-4 font-bold">Live Site</a>}
                    {p.github && <a href={p.github} className="underline decoration-2 underline-offset-4 font-bold">Code</a>}
                  </div>
               </div>
            </div>
          ))}
          <div className="border-t" style={{ borderColor: borderColor }}></div>
        </div>
      </div>
    </section>
  );
};

export default Projects;