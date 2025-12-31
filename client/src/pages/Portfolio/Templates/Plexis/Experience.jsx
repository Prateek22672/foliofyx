import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import DownArrow from "../../../../components/DownArrow";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;
  const borderColor = `${fg}20`;

  // --- 1. SAFE SKILLS DATA ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => {
      if (typeof s === 'string') return { name: s, level: "Intermediate" };
      if (typeof s === 'object' && s.name) return { name: s.name, level: s.level || "Intermediate" };
      return null;
  }).filter(Boolean);

  // --- 2. SAFE WORK HISTORY DATA ---
  const hasRealJobs = data.experience && Array.isArray(data.experience) && data.experience.length > 0;
  const jobList = hasRealJobs 
    ? data.experience 
    : [
        { company: "Creative Studio", role: "Senior Designer", period: "2023 - Present" },
        { company: "Tech Giant", role: "Frontend Developer", period: "2020 - 2023" },
        { company: "Startup Inc", role: "Junior Dev", period: "2018 - 2020" }
      ];

  return (
    <section
      id="experience"
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: bg, color: fg, borderBottom: `1px solid ${borderColor}` }}
    >
       <div className="flex-grow grid md:grid-cols-2 h-full">
         
         {/* LEFT: Sticky Title */}
         <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r border-gray-100" style={{ borderColor: borderColor }}>
            <div className="sticky top-32 fade-up">
               <span className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 block">02 / Journey</span>
               <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none">
                 Career<br/>& Stack.
               </h2>
            </div>
         </div>

         {/* RIGHT: Combined Lists */}
         <div className="flex flex-col">
            
            {/* --- SECTION: WORK HISTORY --- */}
            <div className="px-8 md:px-12 pt-16 pb-8 fade-up">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-50 mb-8">Work History</h3>
            </div>
            
            {jobList.map((job, i) => {
                if (typeof job !== 'object') return null;
                return (
                  <div
                    key={`job-${i}`}
                    className="p-8 md:p-12 border-b flex flex-col md:flex-row md:items-center justify-between fade-up hover:bg-black/5 transition"
                    style={{ borderColor: borderColor }}
                  >
                    <div className="flex flex-col gap-1 mb-4 md:mb-0">
                      <h4 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {job.company || "Company"}
                      </h4>
                      <span className="text-lg opacity-70 font-mono">{job.role || "Role"}</span>
                    </div>
                    <p className="text-sm uppercase tracking-widest opacity-60 font-bold border px-3 py-1 rounded-full" style={{ borderColor: borderColor }}>
                      {job.period || "202X"}
                    </p>
                  </div>
                );
            })}

            {/* --- SECTION: TECH STACK --- */}
            <div className="px-8 md:px-12 pt-24 pb-8 fade-up">
                <h3 className="text-lg font-bold uppercase tracking-widest opacity-50 mb-8">Tech Stack</h3>
            </div>

            {safeSkills.length > 0 ? (
              safeSkills.map((s, i) => (
                <div
                  key={`skill-${i}`}
                  className="p-8 md:p-12 border-b flex items-center justify-between fade-up hover:bg-black/5 transition"
                  style={{ borderColor: borderColor }}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-mono opacity-40">
                      {i < 9 ? `0${i + 1}` : i + 1}
                    </span>
                    <h4 className="text-2xl md:text-3xl font-bold tracking-tight">
                      {s.name}
                    </h4>
                  </div>
                  <p className="text-xs uppercase tracking-widest opacity-40 hidden sm:block">
                    {s.level}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-16 text-center opacity-50 fade-up">
                  No skills added yet.
              </div>
            )}
            
            <div className="p-16 fade-up">
               <DownArrow targetId="projects" />
            </div>
         </div>
       </div>
    </section>
  );
};

export default Experience;