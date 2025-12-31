import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Experience = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  // --- 1. SAFE SKILLS ---
  const rawSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeSkills = rawSkills.map(s => {
      if (typeof s === 'string') return s;
      if (typeof s === 'object' && s.name) return s.name;
      return null;
  }).filter(Boolean);

  // --- 2. SAFE JOB HISTORY ---
  const jobList = (Array.isArray(data.experience) && data.experience.length > 0) 
    ? data.experience 
    : [
        { company: "Demo Corp", role: "Senior Dev", period: "2023", desc: "Leading the frontend engineering team." },
        { company: "Creative Inc", role: "Designer", period: "2021", desc: "UI/UX Design." }
      ];

  return (
    <section id="experience" className="py-20 px-6 border-b-2" style={{ backgroundColor: bg, color: fg, borderColor: fg }}>
      <div className="max-w-[95%] mx-auto">
        
        {/* --- SECTION 1: THE GRIND (Work History) --- */}
        <div className="mb-32">
            <h2 className="text-xs font-mono uppercase mb-12 border-b-2 pb-2 inline-block" style={{ borderColor: accent }}>
                // The_Grind
            </h2>

            <div className="flex flex-col">
            {jobList.map((item, i) => {
                if (typeof item !== 'object') return null;
                return (
                    <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group py-12 border-t-2 flex flex-col md:flex-row md:items-baseline justify-between gap-6 hover:bg-black/5 transition-colors duration-300 px-4 -mx-4"
                    style={{ borderColor: fg }}
                    >
                        <div className="flex-1">
                            <h3 className="text-5xl md:text-8xl font-black uppercase mb-2 group-hover:translate-x-2 transition-transform duration-300">
                            {item.company}
                            </h3>
                            <p className="text-xl md:text-2xl font-mono uppercase tracking-widest" style={{ color: accent }}>
                            {item.role}
                            </p>
                        </div>
                        
                        <div className="flex-1 md:text-right flex flex-col justify-between items-start md:items-end">
                            <span className="text-2xl font-bold border-2 px-4 py-1 rounded-full" style={{ borderColor: fg }}>
                                {item.period}
                            </span>
                            <p className="mt-6 text-lg max-w-md font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.desc}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
            </div>
        </div>

        {/* --- SECTION 2: THE ARSENAL (Skills) --- */}
        <div>
            <h2 className="text-xs font-mono uppercase mb-12 border-b-2 pb-2 inline-block" style={{ borderColor: accent }}>
                // The_Arsenal
            </h2>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {safeSkills.length > 0 ? safeSkills.map((skill, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-4xl md:text-6xl font-black uppercase hover:text-transparent hover:bg-clip-text transition-all cursor-default select-none"
                        style={{
                            WebkitTextStroke: `2px ${fg}`,
                            color: "transparent", 
                            backgroundImage: `linear-gradient(to right, ${accent}, ${accent})`
                        }}
                    >
                        {skill} <span className="text-lg align-top opacity-50" style={{ WebkitTextStroke: '0px', color: fg }}>0{i+1}</span>
                    </motion.div>
                )) : (
                    <p className="font-mono opacity-50 text-xl">NO_DATA_FOUND</p>
                )}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;