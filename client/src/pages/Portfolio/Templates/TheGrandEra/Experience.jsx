import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

const Experience = ({ portfolioData: propData }) => {
  // 1. Get Context Data safely
  const context = usePortfolio();
  const contextData = context ? context.portfolioData : null;

  // 2. Merge Data (Prop > Context > Empty)
  const data = propData || contextData || {};
  
  // 3. Theme Colors (with fallbacks)
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  // 4. Data Connection (Robust Check)
  // Ensure 'data' exists before checking 'data.experience'
  const experienceData = (data && data.experience && Array.isArray(data.experience) && data.experience.length > 0) 
    ? data.experience 
    : [
        { role: "Senior Developer", company: "Demo Corp", period: "2023 - Present", desc: "Leading the frontend engineering team." },
        { role: "UI Designer", company: "Creative Studio", period: "2020 - 2023", desc: "Designing user interfaces and design systems." }
      ];

  return (
    <section id="experience" className="py-20 px-6" style={{ backgroundColor: bg, color: fg }}>
      <div className="max-w-[90%] mx-auto">
        <h2 className="text-xs font-mono uppercase mb-12 opacity-50 tracking-widest">// Career History</h2>

        <div className="border-t-2" style={{ borderColor: fg }}>
          {experienceData.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group py-12 border-b-2 flex flex-col md:flex-row md:items-baseline justify-between gap-6 hover:px-6 transition-all duration-300"
              style={{ borderColor: fg }}
            >
              <div className="flex-1">
                 {/* Company Name */}
                 <h3 className="text-4xl md:text-6xl font-black uppercase mb-2 group-hover:translate-x-2 transition-transform">
                   {item.company}
                 </h3>
                 {/* Role (Accent Color) */}
                 <p className="text-lg font-mono" style={{ color: accent }}>{item.role}</p>
              </div>
              
              <div className="flex-1 md:text-right flex flex-col justify-between">
                {/* Period */}
                <span className="text-xl font-bold">{item.period}</span>
                
                {/* Description (Fades in on Hover) */}
                <p className="mt-4 text-sm max-w-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;