import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;

  // --- 1. SAFE SKILLS ---
  let skills = [];
  if (Array.isArray(data.skills)) {
    skills = data.skills
      .map((s) => {
        if (!s) return null;
        if (typeof s === "string") return { name: s, level: "Intermediate" };
        if (typeof s === "object" && s.name) return { name: s.name, level: s.level || "Intermediate" };
        return null;
      })
      .filter(Boolean);
  }

  // --- 2. SAFE JOB HISTORY ---
  const jobList = (Array.isArray(data.experience) && data.experience.length > 0) 
    ? data.experience 
    : [
        { company: "Demo Corp", role: "Senior Dev", period: "2023", desc: "Leading frontend team." },
        { company: "Startup Inc", role: "Junior Dev", period: "2021", desc: "Full stack development." }
      ];

  useFadeInOnScroll([skills.length]);

  // Helper to determine bar width based on level
  const getLevelWidth = (level) => {
      const l = level.toLowerCase();
      if (l.includes("expert") || l.includes("advanced")) return "w-[95%]";
      if (l.includes("intermediate")) return "w-[70%]";
      if (l.includes("beginner") || l.includes("basic")) return "w-[40%]";
      return "w-[60%]";
  };

  return (
    <section
      id="experience"
      className="py-32 px-6 transition-all duration-500 font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION 1: TECH STACK --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-up">
            <div className="max-w-2xl">
                <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-4">Technical Proficiency</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Tools of the trade.</h2>
            </div>
            <p className="opacity-60 text-lg mt-6 md:mt-0 max-w-sm text-right">
                A breakdown of the technologies and tools I use to bring ideas to life.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <div
                key={i}
                className="group p-8 rounded-[2rem] bg-white/5 border border-current/10 hover:border-current/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <h4 className="text-2xl font-bold">{s.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest border border-current/20 px-2 py-1 rounded-md opacity-60">
                        {s.level}
                    </span>
                </div>

                {/* Progress Bar Visual */}
                <div className="w-full h-1.5 bg-current/10 rounded-full overflow-hidden relative z-10">
                    <div 
                        className={`h-full bg-current opacity-80 rounded-full transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left ${getLevelWidth(s.level)}`}
                    ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-20 text-center border border-dashed border-current/20 rounded-[2rem] opacity-50 fade-up">
                <p className="italic text-lg">Add your skills in the editor to populate this section.</p>
            </div>
          )}
        </div>

        {/* --- SECTION 2: WORK HISTORY --- */}
        <div className="fade-up">
            <h3 className="text-4xl font-bold mb-12 flex items-center gap-4">
               <span className="w-12 h-[1px] bg-current opacity-30"></span> 
               Career History
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
               {jobList.map((job, i) => {
                  if (typeof job !== 'object') return null;
                  return (
                    <div key={`job-${i}`} className="p-10 rounded-[2.5rem] border border-current/10 hover:border-current/30 transition-all bg-current/5">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h4 className="text-2xl font-bold">{job.company || "Company"}</h4>
                              <p className="opacity-60 text-sm uppercase tracking-widest mt-1">{job.role || "Role"}</p>
                           </div>
                           <span className="px-4 py-1 border border-current/20 rounded-full text-xs font-bold">{job.period || "Year"}</span>
                        </div>
                        <p className="opacity-70 leading-relaxed max-w-md">
                           {job.desc || "Description of your role and achievements."}
                        </p>
                    </div>
                  )
               })}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;