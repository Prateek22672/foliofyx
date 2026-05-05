import React, { useMemo } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

const DEFAULT_BG = "#ffffff";
const DEFAULT_FG = "#111827";

// Skill Classification Rules
const CATEGORIES = [
  { id: "frontend", label: "Client Side", keywords: ["react", "next", "tailwind", "css", "html", "javascript", "typescript", "framer"] },
  { id: "backend", label: "Server & Logic", keywords: ["node", "express", "python", "sql", "mongo", "firebase", "aws", "api", "mern"] },
  { id: "tools", label: "Development Tools", keywords: ["git", "docker", "figma", "postman", "jest", "vite", "linux"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const bg = data.themeBg || DEFAULT_BG;
  const fg = data.themeFont || DEFAULT_FG;

  // --- Skill Categorization Logic ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  
  const categorizedSkills = useMemo(() => {
    const groups = {};
    rawSkills.forEach(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const lowerName = name?.toLowerCase() || "";
      let matched = false;

      for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => lowerName.includes(kw))) {
          if (!groups[cat.id]) groups[cat.id] = { label: cat.label, items: [] };
          groups[cat.id].items.push(skill);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (!groups.other) groups.other = { label: "General Expertise", items: [] };
        groups.other.items.push(skill);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  // --- Work History ---
  const jobList = Array.isArray(data.experience) ? data.experience : [];

  useFadeInOnScroll([rawSkills.length]);

  const handleUpdateJob = (index, field, value) => {
    const updatedJobs = [...jobList];
    updatedJobs[index] = { ...updatedJobs[index], [field]: value };
    setPortfolioData({ ...data, experience: updatedJobs });
  };

  return (
    <section
      id="experience"
      className="py-32 px-6 sm:px-12 lg:px-24 transition-all duration-500 font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* --- SECTION 1: CATEGORIZED SKILLS --- */}
        <div className="mb-32 fade-up">
            <div className="text-left mb-16 border-b pb-6" style={{ borderColor: `${fg}15` }}>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-4">Technical Stack</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                   <EditableText 
                      value={data.skillsTitle || "Competencies"} 
                      onChange={(v) => setPortfolioData({...data, skillsTitle: v})} 
                      readOnly={isReadOnly} 
                    />
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {categorizedSkills.length > 0 ? (
                categorizedSkills.map((group, idx) => (
                  <div key={idx} className="flex flex-col gap-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-30 border-l-2 pl-3" style={{ borderColor: fg }}>
                      {group.label}
                    </h4>
                    <div className="flex flex-col gap-4">
                      {group.items.map((s, i) => (
                        <div key={i} className="group flex items-center justify-between py-2 border-b border-transparent hover:border-current/10 transition-all">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-tight">
                              {typeof s === "string" ? s : s.name}
                            </p>
                            <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest">
                              {s.level || "Intermediate"}
                            </p>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-current opacity-20 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="opacity-40 italic">Add skills to populate categories.</p>
              )}
            </div>
        </div>

        {/* --- SECTION 2: WORK HISTORY --- */}
        <div className="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b pb-6" style={{ borderColor: `${fg}15` }}>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 block mb-4">Professional Timeline</span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                    <EditableText 
                      value={data.expTitle || "Experience"} 
                      onChange={(v) => setPortfolioData({...data, expTitle: v})} 
                      readOnly={isReadOnly} 
                    />
                  </h2>
                </div>
            </div>

            <div className="flex flex-col gap-16">
                {jobList.length > 0 ? jobList.map((job, i) => (
                  <div key={i} className="grid md:grid-cols-12 gap-8 group">
                      <div className="md:col-span-3">
                          <span className="text-xs font-mono font-bold opacity-40 tracking-tighter">
                             <EditableText 
                                value={job.period || "202X — Present"} 
                                onChange={(v) => handleUpdateJob(i, 'period', v)} 
                                readOnly={isReadOnly} 
                             />
                          </span>
                      </div>
                      <div className="md:col-span-9 border-l border-current/5 pl-8">
                          <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">
                            <EditableText 
                              value={job.company || "Company Name"} 
                              onChange={(v) => handleUpdateJob(i, 'company', v)} 
                              readOnly={isReadOnly} 
                            />
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-6">
                            <EditableText 
                              value={job.role || "Lead Software Engineer"} 
                              onChange={(v) => handleUpdateJob(i, 'role', v)} 
                              readOnly={isReadOnly} 
                            />
                          </p>
                          <div className="text-base md:text-lg leading-relaxed opacity-70 max-w-2xl font-medium">
                            <EditableText 
                              value={job.desc || "Architecting digital solutions..."} 
                              onChange={(v) => handleUpdateJob(i, 'desc', v)} 
                              readOnly={isReadOnly} 
                              multiline
                            />
                          </div>
                      </div>
                  </div>
                )) : (
                  <p className="opacity-40 italic">Add your professional milestones.</p>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;