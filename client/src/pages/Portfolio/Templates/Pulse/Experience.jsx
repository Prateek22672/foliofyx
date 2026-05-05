import React, { useState, useMemo } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

// 1. CATEGORIZATION ENGINE
// Groups skills based on keywords to match your request
const CATEGORY_RULES = [
  { id: "ai_ml", label: "AI / ML", icon: "✦", keywords: ["tensorflow", "pytorch", "openai", "llm", "rag", "bert", "nlp"] },
  { id: "frontend", label: "Frontend", icon: "◈", keywords: ["react", "next.js", "vue", "tailwind", "css", "javascript", "typescript", "figma"] },
  { id: "backend", label: "Backend", icon: "⬡", keywords: ["node", "express", "nestjs", "fastapi", "python", "django", "go", "rust", "graphql"] },
  { id: "database", label: "Databases", icon: "▣", keywords: ["mysql", "postgresql", "mongodb", "redis", "firebase", "supabase", "sql"] },
];

function categorizeSkills(skills) {
  const categories = {};
  
  skills.forEach((skill) => {
    // FIX: Extract name whether skill is a string or an object {name, level}
    const name = typeof skill === 'string' ? skill : (skill?.name || "");
    const lower = name.toLowerCase();
    let matched = false;

    if (!name) return;

    for (const rule of CATEGORY_RULES) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        if (!categories[rule.id]) categories[rule.id] = { ...rule, skills: [] };
        categories[rule.id].skills.push(skill);
        matched = true;
        break;
      }
    }

    if (!matched) {
      if (!categories["other"]) categories["other"] = { id: "other", label: "Other", icon: "·", skills: [] };
      categories["other"].skills.push(skill);
    }
  });

  return CATEGORY_RULES
    .map((r) => categories[r.id])
    .filter(Boolean)
    .concat(categories["other"] ? [categories["other"]] : []);
}

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  // --- 1. SKILLS DATA (Now Categorized) ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const categorizedStack = useMemo(() => categorizeSkills(rawSkills), [rawSkills]);

  // --- 2. WORK HISTORY (Journey) ---
  const jobList = (data.experience && data.experience.length > 0) 
    ? data.experience 
    : [{ company: "Creative Studio", role: "Senior Designer", period: "2023 - Present", desc: "Leading design systems." }];

  // --- Theme ---
  const bg = data.themeBg || "#0a0a0a";
  const fg = data.themeFont || "#ffffff";
  const borderColor = `${fg}15`;
  const subtleColor = `${fg}05`;

  return (
    <section 
      id="experience" 
      className="py-24 px-6 transition-colors duration-500"
      style={{ backgroundColor: bg, color: fg, borderTop: `1px solid ${borderColor}` }}
    >
      <div className="max-w-[1800px] mx-auto">
        
        {/* ==========================
            PART 1: STACK (CATEGORIZED)
           ========================== */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b pb-4" style={{ borderColor: borderColor }}>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Expertise</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">(03) — Stack</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-up">
            {categorizedStack.map((cat) => (
              <div 
                key={cat.id} 
                className="group p-10 border transition-all duration-500 hover:bg-opacity-20"
                style={{ backgroundColor: subtleColor, borderColor: borderColor }}
              >
                <div className="flex justify-between items-start mb-10">
                  <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">{cat.icon}</span>
                  <span className="text-[10px] font-mono opacity-20">{cat.skills.length} Items</span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight mb-6">{cat.label}</h3>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, i) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <span 
                        key={i} 
                        className="px-3 py-1 text-[11px] font-bold border uppercase tracking-wider"
                        style={{ borderColor: borderColor, backgroundColor: bg }}
                      >
                        {skillName}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================
            PART 2: JOURNEY (PREVIOUS UI)
           ========================== */}
        <div className="fade-up">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b pb-4" style={{ borderColor: borderColor }}>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Journey</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">(04) — History</span>
          </div>

          <div className="flex flex-col border-l border-r" style={{ borderColor: borderColor }}>
            {jobList.map((job, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 group border-b relative" style={{ borderColor: borderColor }}>
                <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none"></div>
                
                {/* Period */}
                <div className="md:col-span-3 p-8 border-r border-dashed md:border-solid flex items-center" style={{ borderColor: borderColor }}>
                  <span className="text-sm font-mono opacity-70">{job.period}</span>
                </div>

                {/* Company & Role */}
                <div className="md:col-span-5 p-8 border-r border-dashed md:border-solid flex flex-col justify-center" style={{ borderColor: borderColor }}>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{job.company}</h3>
                  <span className="text-xs font-mono uppercase tracking-widest opacity-60 mt-1">{job.role}</span>
                </div>

                {/* Description */}
                <div className="md:col-span-4 p-8 flex items-center">
                  <p className="text-sm opacity-60 leading-relaxed max-w-sm">{job.desc}</p>
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