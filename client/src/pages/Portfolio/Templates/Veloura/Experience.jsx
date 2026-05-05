import React, { useState } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import useFadeInOnScroll from "../../../../hooks/useFadeInOnScroll";

// ─────────────────────────────────────────────
// 1. LOGIC: SKILL CATEGORIZATION
// ─────────────────────────────────────────────
const CATEGORY_RULES = [
  { id: "ai_ml", label: "AI / ML", icon: "✦", keywords: ["tensorflow","pytorch","keras","scikit","openai","anthropic","llm","rag","deep learning","nlp"] },
  { id: "web_frontend", label: "Frontend", icon: "◈", keywords: ["react","next.js","vue","tailwind","css","javascript","typescript","figma","framer"] },
  { id: "backend", label: "Backend", icon: "⬡", keywords: ["node","express","nestjs","fastapi","python","django","go","rust","graphql","rest api"] },
  { id: "database", label: "Databases", icon: "▣", keywords: ["mysql","postgresql","mongodb","redis","firebase","supabase","sql"] },
  { id: "devops_cloud", label: "Cloud", icon: "⬢", keywords: ["docker","kubernetes","aws","azure","gcp","terraform","ci/cd","github actions"] },
  { id: "mobile", label: "Mobile", icon: "◉", keywords: ["react native","flutter","android","ios","swift"] },
  { id: "design", label: "Design", icon: "✿", keywords: ["ui/ux","photoshop","illustrator","blender","3d"] },
];

function categorizeSkills(skills) {
  const categories = {};
  skills.forEach((skill) => {
    const lower = skill.toLowerCase();
    let matched = false;
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
  return CATEGORY_RULES.map((r) => categories[r.id]).filter(Boolean).concat(categories["other"] ? [categories["other"]] : []);
}

// ─────────────────────────────────────────────
// 2. COMPONENT: EXPERIENCE
// ─────────────────────────────────────────────
const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  useFadeInOnScroll();

  const [activeCategory, setActiveCategory] = useState(null);

  // --- Skills Processing ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills
    .map((s) => (typeof s === "string" ? s : s?.name))
    .filter(Boolean);

  const categorized = categorizeSkills(safeSkills);
  const displayCategories = activeCategory
    ? categorized.filter((c) => c.id === activeCategory)
    : categorized;

  // --- Work History ---
  const jobList = data.experience && Array.isArray(data.experience) && data.experience.length > 0
    ? data.experience
    : [
        { company: "Studio FYX", role: "Product Designer", period: "2024 - Present", desc: "Leading the creative direction and visual systems." },
        { company: "Tech Flow", role: "Software Engineer", period: "2022 - 2024", desc: "Developed high-performance web applications." }
      ];

  // --- Theme ---
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#111111";
  const borderColor = `${fg}15`;
  const subtleColor = `${fg}08`;

  return (
    <section id="experience" className="py-24 px-4 md:px-12" style={{ backgroundColor: bg, color: fg }}>
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 fade-up">
          <div>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">Stack</h2>
            <p className="text-lg opacity-50 max-w-md font-medium">A curated selection of tools I use to build digital experiences.</p>
          </div>
          <div className="flex flex-col items-end gap-4 mt-8 md:mt-0">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">02 Expertise</span>
            <div className="flex flex-wrap justify-end gap-2">
                <button onClick={() => setActiveCategory(null)} className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                  style={{ backgroundColor: !activeCategory ? fg : "transparent", color: !activeCategory ? bg : fg, border: `1px solid ${fg}` }}>
                  All
                </button>
                {categorized.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                    style={{ backgroundColor: activeCategory === cat.id ? fg : "transparent", color: activeCategory === cat.id ? bg : fg, border: `1px solid ${activeCategory === cat.id ? fg : borderColor}` }}>
                    {cat.label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Boxed Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-40 fade-up">
          {displayCategories.map((cat) => (
            <div key={cat.id} className="group relative p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2"
              style={{ backgroundColor: subtleColor, border: `1px solid ${borderColor}` }}>
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">
                  {String(cat.skills.length).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-6 tracking-tight">{cat.label}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-[12px] font-bold"
                    style={{ backgroundColor: bg, color: fg, border: `1px solid ${borderColor}` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Work History */}
        <div className="fade-up pt-20" style={{ borderTop: `1px solid ${borderColor}` }}>
          <div className="flex justify-between items-baseline mb-16">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">History</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">03 Experience</span>
          </div>
          <div className="flex flex-col">
            {jobList.map((job, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-start justify-between py-16 group transition-all duration-500 border-b"
                style={{ borderColor: borderColor }}>
                <div className="flex-1">
                  <span className="text-[10px] font-mono mb-4 block opacity-40">{job.period}</span>
                  <h3 className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter group-hover:pl-4 transition-all duration-500">{job.company}</h3>
                  <p className="text-lg opacity-60 font-medium">{job.role}</p>
                </div>
                <div className="flex-1 mt-6 md:mt-0">
                  <p className="text-sm md:text-base leading-relaxed max-w-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500">{job.desc}</p>
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