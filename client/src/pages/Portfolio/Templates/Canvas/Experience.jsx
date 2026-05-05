import React, { useState, useMemo } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";
import EditableText from "../EditableText";
import { Layers, History, Plus, Cpu, Terminal, Shield } from "lucide-react";

// Skill Classification Engine
const CATEGORIES = [
  { id: "frontend", label: "Client Side", icon: <Cpu size={14} />, keywords: ["react", "next", "tailwind", "css", "html", "javascript", "typescript", "framer"] },
  { id: "backend", label: "Server & Logic", icon: <Terminal size={14} />, keywords: ["node", "express", "python", "sql", "mongo", "firebase", "aws", "api", "mern", "net"] },
  { id: "tools", label: "Architecture & Tools", icon: <Shield size={14} />, keywords: ["git", "docker", "figma", "postman", "jest", "vite", "linux", "rag", "ai"] },
];

const Experience = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#f0f0f0";
  const accent = data.accentColor || "#e8ff47";
  const muted = `${fg}55`;
  const border = `${fg}15`;

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
          if (!groups[cat.id]) groups[cat.id] = { label: cat.label, icon: cat.icon, items: [] };
          groups[cat.id].items.push(skill);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (!groups.other) groups.other = { label: "General Expertise", icon: <Layers size={14} />, items: [] };
        groups.other.items.push(skill);
      }
    });
    return Object.values(groups);
  }, [rawSkills]);

  const jobList = Array.isArray(data.experience) ? data.experience : [];
  const [openJob, setOpenJob] = useState(null);

  const handleUpdateJob = (index, field, value) => {
    const updatedJobs = [...jobList];
    updatedJobs[index] = { ...updatedJobs[index], [field]: value };
    setPortfolioData({ ...data, experience: updatedJobs });
  };

  return (
    <section id="experience" className="py-24 px-6 md:px-10 transition-colors duration-500" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="max-w-[1400px] mx-auto space-y-32">

        {/* ── CATEGORIZED SKILLS ── */}
        <div>
          <div className="flex items-center gap-4 mb-16 fade-up">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: `${fg}0d`, borderColor: border }}>
              <Layers size={12} style={{ color: muted }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: muted }}>02 / Competencies</span>
            </div>
            <div className="flex-1 h-px" style={{ background: border }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 fade-up">
            {categorizedSkills.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-6">
                <div className="flex items-center gap-3 opacity-30" style={{ color: fg }}>
                  {group.icon}
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{group.label}</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {group.items.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b" style={{ borderColor: border }}>
                      <span className="text-sm font-bold uppercase tracking-tighter" style={{ color: fg }}>
                        {typeof s === "string" ? s : s.name}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-30" style={{ color: fg }}>
                        {s.level || "Mid"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WORK HISTORY ── */}
        <div>
          <div className="flex items-center gap-4 mb-16 fade-up">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: `${fg}0d`, borderColor: border }}>
              <History size={12} style={{ color: muted }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: muted }}>03 / Professional Timeline</span>
            </div>
            <div className="flex-1 h-px" style={{ background: border }} />
          </div>

          <div className="flex flex-col fade-up">
            {jobList.map((job, i) => {
              const isOpen = openJob === i;
              return (
                <div key={i} className="border-b transition-all duration-300" style={{ borderColor: border }} onClick={() => setOpenJob(isOpen ? null : i)}>
                  <div className="flex items-center gap-6 py-8 group cursor-pointer">
                    <span className="text-[10px] font-mono opacity-30" style={{ color: fg }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="flex-1 text-2xl md:text-4xl font-black tracking-tighter uppercase italic transition-all group-hover:opacity-60" style={{ color: fg }}>
                      <EditableText value={job.company} onChange={(v) => handleUpdateJob(i, 'company', v)} readOnly={isReadOnly} />
                    </h3>
                    <div className="hidden md:block text-right">
                       {/* FIXED: Changed from <p> to <div> to avoid hydration error with nested EditableText div */}
                       <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: muted }}>
                        <EditableText value={job.role} onChange={(v) => handleUpdateJob(i, 'role', v)} readOnly={isReadOnly} />
                       </div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: muted }}>
                      <EditableText value={job.period} onChange={(v) => handleUpdateJob(i, 'period', v)} readOnly={isReadOnly} />
                    </span>
                    <div className="w-8 h-8 rounded-full border flex items-center justify-center transition-all" 
                         style={{ background: isOpen ? accent : "transparent", borderColor: border, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                      <Plus size={14} color={isOpen ? bg : fg} />
                    </div>
                  </div>
                  {isOpen && (
                    <div className="pb-10 pl-10 max-w-2xl">
                      {/* FIXED: Changed from <p> to <div> to allow nested multiline divs */}
                      <div className="text-base leading-relaxed font-medium opacity-60" style={{ color: fg }}>
                        <EditableText value={job.desc} onChange={(v) => handleUpdateJob(i, 'desc', v)} readOnly={isReadOnly} multiline />
                      </div>
                    </div>
                  )}
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