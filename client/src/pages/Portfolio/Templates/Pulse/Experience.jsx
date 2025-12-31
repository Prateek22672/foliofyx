import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // --- 1. SKILLS DATA (Stack) ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => {
    // Handle both string and object formats safely
    if (typeof s === 'string') return { name: s, level: "Experienced" };
    if (typeof s === 'object' && s !== null && s.name) return s;
    return null;
  }).filter(Boolean);

  // --- 2. WORK HISTORY (Jobs) ---
  const hasRealJobs = data.experience && Array.isArray(data.experience) && data.experience.length > 0;
  
  const jobList = hasRealJobs 
    ? data.experience 
    : [
        // Dummy Fallback
        { company: "Creative Studio", role: "Senior Designer", period: "2023 - Present", desc: "Leading design systems." },
        { company: "Tech Giant", role: "Frontend Developer", period: "2020 - 2023", desc: "Building scalable UI." },
        { company: "Startup Inc", role: "Junior Dev", period: "2018 - 2020", desc: "Full stack development." }
      ];

  // --- Theme ---
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const borderColor = `${fg}15`; // 15% opacity border

  return (
    <section 
      id="experience" 
      className="py-24 px-6 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        
        {/* ==========================
            PART 1: STACK (SKILLS)
           ========================== */}
        <div className="mb-32">
            <div 
              className="flex flex-col md:flex-row justify-between items-end mb-12 border-b pb-4"
              style={{ borderColor: borderColor }}
            >
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Expertise</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">(03) — Stack</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 fade-up">
              {safeSkills.map((skill, i) => (
                <div 
                  key={i} 
                  className="group border-r border-b p-8 h-44 flex flex-col justify-between hover:bg-opacity-10 transition-colors duration-300 relative overflow-hidden"
                  style={{ borderColor: borderColor }}
                >
                  <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                      0{i+1}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-2xl font-bold tracking-tight leading-none">
                      {skill.name}
                    </span>
                    <span 
                      className="text-[10px] font-mono uppercase tracking-widest opacity-50 group-hover:opacity-80 transition-opacity"
                    >
                      [{skill.level || "Experienced"}]
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Filler cells to keep grid clean */}
              {[...Array(4 - (safeSkills.length % 4 || 4))].map((_, i) => (
                 <div key={`fill-${i}`} className="hidden lg:block border-r border-b" style={{ borderColor: borderColor }}></div>
              ))}
            </div>
        </div>

        {/* ==========================
            PART 2: JOURNEY (JOBS)
           ========================== */}
        <div className="fade-up">
            <div 
              className="flex flex-col md:flex-row justify-between items-end mb-12 border-b pb-4"
              style={{ borderColor: borderColor }}
            >
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Journey</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">(04) — History</span>
            </div>

            <div className="flex flex-col border-l border-r" style={{ borderColor: borderColor }}>
               {jobList.map((job, i) => {
                  // Safety: Ensure job is object
                  if (typeof job !== 'object') return null;

                  return (
                    <div 
                      key={i} 
                      className="grid grid-cols-1 md:grid-cols-12 group border-b relative"
                      style={{ borderColor: borderColor }}
                    >
                       {/* Hover BG */}
                       <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>

                       {/* Period (Left) */}
                       <div className="md:col-span-3 p-8 border-r border-dashed md:border-solid flex items-center" style={{ borderColor: borderColor }}>
                          <span className="text-sm font-mono opacity-70">{job.period || "2023"}</span>
                       </div>

                       {/* Company & Role (Middle) */}
                       <div className="md:col-span-5 p-8 border-r border-dashed md:border-solid flex flex-col justify-center" style={{ borderColor: borderColor }}>
                          <h3 className="text-2xl font-bold uppercase tracking-tight">{job.company || "Company"}</h3>
                          <span className="text-xs font-mono uppercase tracking-widest opacity-60 mt-1">{job.role || "Role"}</span>
                       </div>

                       {/* Description (Right) */}
                       <div className="md:col-span-4 p-8 flex items-center">
                          <p className="text-sm opacity-60 leading-relaxed max-w-sm">
                             {job.desc || "Responsible for core development."}
                          </p>
                       </div>
                    </div>
                  );
               })}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;