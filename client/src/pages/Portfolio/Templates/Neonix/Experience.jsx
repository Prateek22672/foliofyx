import React, { useMemo } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";

// Skill Categorization Rules - Matches your professional background
const CATEGORIES = [
  { id: "ai", label: "Intelligence & ML", keywords: ["ai", "machine learning", "nlp", "rag", "llm", "openai"] },
  { id: "web", label: "Interface & Web", keywords: ["react", "next", "tailwind", "javascript", "typescript", "frontend", "mern"] },
  { id: "system", label: "Logic & Systems", keywords: ["node", "express", "backend", "python", "sql", "mongo", "dsa"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = (propData && Object.keys(propData).length > 0) ? propData : (contextData || {});
  
  const bg = data.themeBg || "#f8f9fa";
  const fg = data.themeFont || "#111111";
  const borderColor = `${fg}15`;

  // --- Skill Categorization Logic ---
  const rawSkills = Array.isArray(data?.skills) ? data.skills : [];
  
  const categorizedSkills = useMemo(() => {
    const groups = {};
    rawSkills.forEach(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const lowerName = name?.toLowerCase() || "";
      let matched = false;

      for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => lowerName.includes(kw))) {
          if (!groups[cat.id]) groups[cat.id] = { label: cat.label, items: [] };
          groups[cat.id].items.push(name);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (!groups.core) groups.core = { label: "Core Expertise", items: [] };
        groups.core.items.push(name);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  // --- Work History Logic ---
  const jobList = Array.isArray(data?.experience) && data.experience.length > 0 
    ? data.experience 
    : [{ company: "Freelance", role: "Developer", period: "2024", desc: "Building digital products." }];

  const handleUpdateJob = (index, field, value) => {
    const updated = [...jobList];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioData({ ...data, experience: updated });
  };

  useFadeInOnScroll();

  return (
    <section
      id="experience"
      className="py-32 px-6 relative overflow-hidden font-[Switzer]"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Area */}
        <div className="mb-20 fade-up">
           <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-current/20 rounded-full text-xs font-bold uppercase tracking-widest opacity-60">
                Journey & Stack
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
                Technical <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Proficiency.</span>
            </h2>
        </div>

        {/* --- SECTION 1: CATEGORIZED SKILLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 fade-up">
           {categorizedSkills.map((cat, idx) => (
             <div 
               key={idx} 
               className="p-8 border border-current/10 rounded-[2rem] bg-white/5 backdrop-blur-md hover:bg-current/5 transition-all duration-500"
             >
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-40 border-b border-current/10 pb-4">
                  {cat.label}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-4 py-2 border border-current/10 rounded-full text-sm font-medium hover:border-current/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
             </div>
           ))}
        </div>

        {/* --- SECTION 2: WORK HISTORY --- */}
        <div className="fade-up">
           <h3 className="text-3xl font-bold mb-10 flex items-center gap-4">
               Career History
           </h3>
           
           <div className="grid grid-cols-1 gap-4">
              {jobList.map((job, i) => (
                <div 
                  key={i} 
                  className="p-10 rounded-[2.5rem] border border-current/10 bg-current/5 hover:bg-current/10 transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="flex-1">
                        <h4 className="text-2xl font-bold">
                          <EditableText 
                            value={job.company} 
                            onChange={(v) => handleUpdateJob(i, 'company', v)} 
                            readOnly={isReadOnly} 
                          />
                        </h4>
                        <p className="opacity-60 text-sm uppercase tracking-widest mt-1">
                          <EditableText 
                            value={job.role} 
                            onChange={(v) => handleUpdateJob(i, 'role', v)} 
                            readOnly={isReadOnly} 
                          />
                        </p>
                    </div>
                    
                    <div className="flex-1 max-w-xl">
                       <p className="opacity-70 leading-relaxed italic">
                         <EditableText 
                            value={job.desc} 
                            onChange={(v) => handleUpdateJob(i, 'desc', v)} 
                            readOnly={isReadOnly} 
                            multiline 
                          />
                       </p>
                    </div>

                    <div className="md:text-right">
                       <span className="px-5 py-2 border border-current/20 rounded-full text-xs font-bold whitespace-nowrap">
                          <EditableText 
                            value={job.period} 
                            onChange={(v) => handleUpdateJob(i, 'period', v)} 
                            readOnly={isReadOnly} 
                          />
                       </span>
                    </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;