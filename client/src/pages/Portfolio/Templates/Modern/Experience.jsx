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

  // --- 2. SAFE WORK HISTORY ---
  const jobList = (Array.isArray(data.experience) && data.experience.length > 0) 
    ? data.experience 
    : [
        { company: "Startup Inc", role: "Junior Dev", period: "2021", desc: "Full stack development." }
      ];

  useFadeInOnScroll([skills.length]);

  return (
    <section
      id="experience"
      className="py-32 px-6 transition-all duration-500 font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* --- SECTION 1: TECH STACK --- */}
        <div className="text-center mb-20 fade-up">
            <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-4">Expertise</span>
            <h2 className="text-4xl md:text-5xl font-bold">Skills & Tools</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 fade-up">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <div
                key={i}
                className="group p-6 border border-current/10 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between"
                style={{ borderColor: `${fg}15` }}
              >
                <div>
                    <h4 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{s.name}</h4>
                    <p className="text-xs font-medium opacity-50 uppercase tracking-wider mt-1">{s.level}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-current opacity-20 group-hover:opacity-100 group-hover:bg-blue-600 transition-all"></div>
              </div>
            ))
          ) : (
            <p className="opacity-60 text-center col-span-3 italic">
              Add skills to see them here...
            </p>
          )}
        </div>

        {/* --- SECTION 2: WORK HISTORY --- */}
        {jobList.length > 0 && (
            <div className="fade-up">
                <div className="text-center mb-16">
                    <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-4">Journey</span>
                    <h2 className="text-4xl md:text-5xl font-bold">Career History</h2>
                </div>

                <div className="grid gap-8 max-w-4xl mx-auto">
                    {jobList.map((job, i) => {
                         if (typeof job !== 'object') return null;
                         return (
                            <div key={i} className="p-8 border border-current/10 rounded-3xl bg-white/5 hover:border-current/30 transition-all flex flex-col md:flex-row justify-between items-start gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold">{job.company || "Company"}</h3>
                                    <p className="text-sm font-bold uppercase tracking-wider opacity-60 mt-1">{job.role || "Role"}</p>
                                    <p className="opacity-80 mt-4 leading-relaxed max-w-xl">{job.desc}</p>
                                </div>
                                <span className="px-4 py-1.5 border border-current/20 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                    {job.period || "Year"}
                                </span>
                            </div>
                         );
                    })}
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default Experience;