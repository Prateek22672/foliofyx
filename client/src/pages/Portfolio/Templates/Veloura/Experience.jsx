import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // --- 1. SKILLS DATA (Stack) ---
  // Ensure we are filtering out bad data objects from skills list
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => {
      if (typeof s === 'string') return s;
      if (s && s.name && typeof s.name === 'string') return s.name;
      return null;
  }).filter(Boolean);

  // --- 2. WORK HISTORY (Jobs) ---
  // We only care about the Array of Jobs now.
  const hasRealJobs = data.experience && Array.isArray(data.experience) && data.experience.length > 0;
  
  const jobList = hasRealJobs 
    ? data.experience 
    : [
        // Dummy Fallback for Preview
        { company: "Creative Studio", role: "Senior Designer", period: "2023 - Present", desc: "Leading design systems and brand identity." },
        { company: "Tech Giant", role: "Frontend Developer", period: "2020 - 2023", desc: "Building scalable UI components for enterprise apps." },
        { company: "Startup Inc", role: "Junior Dev", period: "2018 - 2020", desc: "Full stack development using MERN stack." }
      ];

  // --- Theme ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const borderColor = `${fg}20`; 

  return (
    <section 
      id="experience" 
      className="py-20 px-4 md:px-8 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        
        {/* ==========================
            PART 1: STACK (SKILLS)
           ========================== */}
        <div className="mb-32">
            <div className="flex flex-col md:flex-row justify-between mb-12 fade-up">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Stack</h2>
              <span 
                className="text-sm font-bold uppercase rounded-full px-4 py-2 h-fit mt-4 md:mt-0"
                style={{ border: `1px solid ${fg}` }}
              >
                02 / Expertise
              </span>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0 fade-up">
              {safeSkills.length > 0 ? safeSkills.map((name, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between py-6 group hover:pl-4 transition-all duration-300"
                    style={{ borderBottom: `1px solid ${borderColor}` }}
                  >
                    <span className="text-2xl font-bold tracking-tight">{name}</span>
                    <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: fg }}>
                        0{i+1}
                    </span>
                  </div>
              )) : (
                 <div className="py-6 opacity-50 italic">Add your skills in the editor...</div>
              )}
            </div>
        </div>

        {/* ==========================
            PART 2: WORK HISTORY (JOBS)
           ========================== */}
        <div className="fade-up pt-12" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="flex flex-col md:flex-row justify-between mb-12">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">History</h2>
              <span 
                className="text-sm font-bold uppercase rounded-full px-4 py-2 h-fit mt-4 md:mt-0"
                style={{ border: `1px solid ${fg}` }}
              >
                03 / Experience
              </span>
            </div>

            {/* Job List */}
            <div className="flex flex-col">
              {jobList.map((job, i) => {
                 // Safety Check: Ensure job is an object. If it's a string (bad data), ignore it.
                 if (typeof job !== 'object') return null;

                 return (
                    <div 
                      key={i} 
                      className="flex flex-col md:flex-row md:items-start justify-between py-12 group hover:px-4 transition-all duration-300 cursor-default"
                      style={{ borderBottom: `1px solid ${borderColor}` }}
                    >
                       {/* Left: Company & Role */}
                       <div className="mb-6 md:mb-0 flex-1">
                          <h3 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{job.company || "Company Name"}</h3>
                          <p className="text-lg md:text-xl opacity-60 font-medium font-mono">{job.role || "Job Role"}</p>
                       </div>

                       {/* Right: Period & Description */}
                       <div className="md:text-right flex-1 flex flex-col items-start md:items-end">
                          <div className="text-xl font-bold mb-4">{job.period || "Year"}</div>
                          {job.desc && (
                            <p className="text-sm leading-relaxed max-w-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 text-left md:text-right">
                              {job.desc}
                            </p>
                          )}
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