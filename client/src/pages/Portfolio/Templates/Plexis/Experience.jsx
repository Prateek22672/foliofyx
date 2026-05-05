import React, { useMemo } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import DownArrow from "../../../../components/DownArrow";
import EditableText from "../EditableText";

// Skill Categorization Rules
const CATEGORIES = [
  { id: "ai", label: "AI / ML", keywords: ["ai", "machine learning", "nlp", "rag", "tensorflow", "pytorch", "openai"] },
  { id: "frontend", label: "Frontend", keywords: ["react", "next", "vue", "tailwind", "css", "javascript", "typescript"] },
  { id: "backend", label: "Backend", keywords: ["node", "express", "node.js", "nest", "fastapi", "python", "golang", "backend"] },
  { id: "db", label: "Databases", keywords: ["mongo", "sql", "postgres", "redis", "firebase", "database"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111827";
  const borderColor = `${fg}20`;

  // --- Skill Categorization Logic ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const categorizedSkills = useMemo(() => {
    const groups = {};
    rawSkills.forEach(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const lowerName = name?.toLowerCase() || "";
      let found = false;

      for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => lowerName.includes(kw))) {
          if (!groups[cat.id]) groups[cat.id] = { label: cat.label, items: [] };
          groups[cat.id].items.push(name);
          found = true;
          break;
        }
      }
      if (!found) {
        if (!groups.other) groups.other = { label: "Core Tech", items: [] };
        groups.other.items.push(name);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  // --- Work History Logic ---
  const jobList = Array.isArray(data.experience) && data.experience.length > 0 
    ? data.experience 
    : [{ company: "Freelance", role: "Developer", period: "2024 - Present", desc: "Building digital products." }];

  const handleUpdateJob = (index, field, value) => {
    const updated = [...jobList];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioData({ ...data, experience: updated });
  };

  return (
    <section id="experience" className="relative min-h-screen flex flex-col" style={{ backgroundColor: bg, color: fg, borderBottom: `1px solid ${borderColor}` }}>
      <div className="flex-grow grid md:grid-cols-2 h-full">
        
        {/* LEFT: Sticky Title */}
        <div className="p-8 md:p-16 border-b md:border-b-0 md:border-r" style={{ borderColor: borderColor }}>
          <div className="sticky top-32 fade-up">
            <span className="text-xs font-black uppercase tracking-[0.4em] opacity-30 mb-4 block">02 / Journey</span>
            <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
              Career<br/><span style={{ color: data.accentColor }}>& Stack.</span>
            </h2>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-col">
          {/* Work History */}
          <div className="px-8 md:px-12 pt-16 pb-8"><h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Professional Path</h3></div>
          {jobList.map((job, i) => (
            <div key={i} className="p-8 md:p-12 border-b group" style={{ borderColor: borderColor }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold uppercase tracking-tighter">
                    <EditableText value={job.company} onChange={(v) => handleUpdateJob(i, 'company', v)} readOnly={isReadOnly} />
                  </h4>
                  <div className="text-sm font-mono opacity-60">
                    <EditableText value={job.role} onChange={(v) => handleUpdateJob(i, 'role', v)} readOnly={isReadOnly} />
                  </div>
                </div>
                <div className="text-xs font-black border-2 px-4 py-1 rounded-full mt-4 md:mt-0" style={{ borderColor: fg }}>
                  <EditableText value={job.period} onChange={(v) => handleUpdateJob(i, 'period', v)} readOnly={isReadOnly} />
                </div>
              </div>
            </div>
          ))}

          {/* Categorized Stack */}
          <div className="px-8 md:px-12 pt-24 pb-8"><h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Technical Expertise</h3></div>
          <div className="p-8 md:p-12 grid grid-cols-1 gap-10">
            {categorizedSkills.map((cat, i) => (
              <div key={i} className="fade-up">
                <h4 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: data.accentColor }}>{cat.label}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, j) => (
                    <span key={j} className="px-4 py-2 border-2 text-xs font-bold uppercase tracking-widest" style={{ borderColor: borderColor }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-16"><DownArrow targetId="projects" /></div>
        </div>
      </div>
    </section>
  );
};

export default Experience;