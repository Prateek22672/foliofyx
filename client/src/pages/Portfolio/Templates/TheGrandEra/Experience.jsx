import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "../EditableText";

const CATEGORIES = [
  { id: "ai", label: "Intelligence & ML", keywords: ["ai", "machine learning", "nlp", "rag", "openai"] },
  { id: "web", label: "Interface & Web", keywords: ["react", "next", "tailwind", "javascript", "typescript", "frontend"] },
  { id: "system", label: "Logic & Systems", keywords: ["node", "express", "backend", "python", "sql", "mongo"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  // --- Skill Categorization ---
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
          groups[cat.id].items.push(name);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (!groups.other) groups.other = { label: "Core Expertise", items: [] };
        groups.other.items.push(name);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  // --- Work History Logic ---
  const experienceData = Array.isArray(data.experience) ? data.experience : [];

  const handleUpdateJob = (index, field, value) => {
    const updated = [...experienceData];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioData({ ...data, experience: updated });
  };

  return (
    <section id="experience" className="py-20 px-6" style={{ backgroundColor: bg, color: fg }}>
      <div className="max-w-[90%] mx-auto">
        
        {/* --- Category Section (The Stack) --- */}
        <div className="grid md:grid-cols-3 gap-10 mb-32">
            {categorizedSkills.map((cat, i) => (
                <div key={i} className="border-l-2 pl-6" style={{ borderColor: fg }}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">{cat.label}</h4>
                    <ul className="text-xl font-bold uppercase space-y-1">
                        {cat.items.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>
            ))}
        </div>

        <h2 className="text-xs font-mono uppercase mb-12 opacity-50 tracking-widest">// Career History</h2>

        <div className="border-t-2" style={{ borderColor: fg }}>
          {experienceData.map((item, i) => (
            <motion.div 
              key={i}
              className="group py-12 border-b-2 flex flex-col md:flex-row md:items-baseline justify-between gap-6 hover:px-6 transition-all duration-300"
              style={{ borderColor: fg }}
            >
              <div className="flex-1">
                 <h3 className="text-4xl md:text-6xl font-black uppercase mb-2 group-hover:translate-x-2 transition-transform">
                    <EditableText value={item.company} onChange={(v) => handleUpdateJob(i, 'company', v)} readOnly={isReadOnly} />
                 </h3>
                 <p className="text-lg font-mono" style={{ color: accent }}>
                    <EditableText value={item.role} onChange={(v) => handleUpdateJob(i, 'role', v)} readOnly={isReadOnly} />
                 </p>
              </div>
              
              <div className="flex-1 md:text-right flex flex-col justify-between">
                <span className="text-xl font-bold">
                    <EditableText value={item.period} onChange={(v) => handleUpdateJob(i, 'period', v)} readOnly={isReadOnly} />
                </span>
                <div className="mt-4 text-sm max-w-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <EditableText value={item.desc} onChange={(v) => handleUpdateJob(i, 'desc', v)} readOnly={isReadOnly} multiline />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;