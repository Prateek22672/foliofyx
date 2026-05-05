import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Components
import EditableText from "../EditableText";

// Skill Categorization Rules - Matches your professional background
const CATEGORIES = [
  { id: "ai", label: "Intelligence & ML", keywords: ["ai", "machine learning", "nlp", "rag", "llm", "tensorflow", "pytorch", "openai"] },
  { id: "frontend", label: "Interface & Web", keywords: ["react", "next", "vue", "tailwind", "css", "javascript", "typescript", "native"] },
  { id: "backend", label: "Logic & Systems", keywords: ["node", "express", "nest", "fastapi", "python", "golang", "backend"] },
  { id: "db", label: "Data Architecture", keywords: ["mongo", "sql", "postgres", "redis", "firebase", "database"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  
  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const accent = data.accentColor || "#D97706";

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
        if (!groups.core) groups.core = { label: "General Expertise", items: [] };
        groups.core.items.push(name);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  // --- Work History Logic ---
  const jobList = Array.isArray(data?.experience) ? data.experience : [];

  const handleUpdateJob = (index, field, value) => {
    const updated = [...jobList];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioData({ ...data, experience: updated });
  };

  return (
    <section 
      id="services" 
      className="px-6 md:px-12 py-32 border-t transition-colors duration-300"
      style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* LEFT: Sticky Header */}
        <div className="lg:col-span-4">
          <motion.div 
            className="sticky top-32"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] mb-4 block opacity-30">
              (03) / Journey
            </span>
            <h2 className="text-4xl md:text-6xl font-black leading-[1] tracking-tighter uppercase">
               Career <br/> <span style={{ color: accent }}>& Stack.</span>
            </h2>
          </motion.div>
        </div>

        {/* RIGHT: Lists */}
        <div className="lg:col-span-8 flex flex-col">
          
          {/* Header Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-2xl md:text-4xl font-bold leading-tight tracking-tight max-w-2xl">
               <EditableText
                 value={data.experienceHeader || "Technical toolset designed to solve complex architectural problems."}
                 onChange={(v) => setPortfolioData({ ...data, experienceHeader: v })}
                 readOnly={isReadOnly}
                 multiline
               />
            </div>
          </motion.div>

          {/* SECTION 1: CATEGORIZED CAPABILITIES */}
          <div className="space-y-24 mb-32">
            {categorizedSkills.map((cat, idx) => (
              <motion.div 
                key={`cat-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-10 opacity-40 border-b pb-4" style={{ borderColor: `${fg}10` }}>
                  {cat.label}
                </h4>
                <div className="flex flex-wrap gap-x-12 gap-y-8">
                  {cat.items.map((skill, sIdx) => (
                    <div key={sIdx} className="group flex items-center gap-4">
                       <span className="text-2xl md:text-5xl font-black uppercase tracking-tighter transition-all group-hover:pl-4" style={{ color: fg }}>
                         {skill}
                       </span>
                       <ArrowDown 
                          size={24} 
                          className="opacity-0 group-hover:opacity-100 transition-all -rotate-90 group-hover:rotate-0" 
                          style={{ color: accent }}
                       />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* SECTION 2: WORK HISTORY */}
          {jobList.length > 0 && (
            <div className="pt-24 border-t" style={{ borderColor: `${fg}15` }}>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-12 block">
                Professional History
              </span>
              
              <div className="space-y-0">
                {jobList.map((job, index) => (
                  <motion.div 
                    key={`job-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group py-12 border-b flex flex-col md:grid md:grid-cols-2 gap-8 items-start transition-all"
                    style={{ borderColor: `${fg}08` }}
                  >
                    <div>
                      <h5 className="text-2xl font-bold uppercase tracking-tighter">
                        <EditableText value={job.company} onChange={(v) => handleUpdateJob(index, 'company', v)} readOnly={isReadOnly} />
                      </h5>
                      <p className="text-sm font-mono uppercase tracking-widest opacity-50 mt-2">
                        <EditableText value={job.role} onChange={(v) => handleUpdateJob(index, 'role', v)} readOnly={isReadOnly} />
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end w-full">
                       <span className="text-xs font-black border-2 px-4 py-1 rounded-full uppercase tracking-widest" style={{ borderColor: fg }}>
                         <EditableText value={job.period} onChange={(v) => handleUpdateJob(index, 'period', v)} readOnly={isReadOnly} />
                       </span>
                       <p className="text-sm leading-relaxed opacity-60 mt-6 md:text-right max-w-sm">
                         <EditableText value={job.desc} onChange={(v) => handleUpdateJob(index, 'desc', v)} readOnly={isReadOnly} multiline />
                       </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20">
             <a href="#projects" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:opacity-50 transition-opacity">
               Explore Projects <ArrowDown size={14} style={{ color: accent }} />
             </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;