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
    : [];

  useFadeInOnScroll([skills.length]);

  return (
    <section
      id="experience"
      className="py-32 px-6 sm:px-12 lg:px-24 transition-all duration-500 font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* --- SECTION 1: WORK HISTORY (If available) --- */}
        {jobList.length > 0 && (
          <div className="mb-32 fade-up">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b pb-6" style={{ borderColor: `${fg}15` }}>
                  <div>
                    <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-2">Journey</span>
                    <h2 className="text-3xl md:text-4xl font-bold">Work History</h2>
                  </div>
              </div>

              <div className="flex flex-col gap-12">
                  {jobList.map((job, i) => {
                      if (typeof job !== 'object') return null;
                      return (
                        <div key={i} className="grid md:grid-cols-12 gap-6 group">
                            <div className="md:col-span-3">
                                <span className="text-sm font-mono opacity-60 border-l-2 pl-4 block" style={{ borderColor: `${fg}20` }}>
                                   {job.period || "202X"}
                                </span>
                            </div>
                            <div className="md:col-span-9">
                                <h3 className="text-2xl font-bold mb-1">{job.company || "Company Name"}</h3>
                                <p className="text-sm font-bold uppercase tracking-wide opacity-50 mb-4">{job.role || "Role"}</p>
                                <p className="text-lg leading-relaxed opacity-80 max-w-2xl">
                                   {job.desc}
                                </p>
                            </div>
                        </div>
                      )
                  })}
              </div>
          </div>
        )}

        {/* --- SECTION 2: SKILLS --- */}
        <div className="fade-up">
            <div className="text-center mb-16">
                <span className="text-sm font-bold tracking-[0.2em] uppercase opacity-50 block mb-4">Expertise</span>
                <h2 className="text-4xl md:text-5xl font-bold">Skills & Tools</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.length > 0 ? (
                skills.map((s, i) => (
                  <div
                    key={i}
                    className="group p-6 border border-current/10 rounded-lg bg-current/5 hover:bg-current/10 transition-all duration-300 flex items-center justify-between"
                    style={{ borderColor: `${fg}15` }}
                  >
                    <div>
                        <h4 className="text-lg font-bold">{s.name}</h4>
                        <p className="text-xs font-medium opacity-50 uppercase tracking-wider mt-1">{s.level}</p>
                    </div>
                    {/* Minimal Dot Indicator */}
                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20 group-hover:opacity-100 transition-all"></div>
                  </div>
                ))
              ) : (
                <p className="opacity-60 text-center col-span-3 italic">
                  Add skills to see them here...
                </p>
              )}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;