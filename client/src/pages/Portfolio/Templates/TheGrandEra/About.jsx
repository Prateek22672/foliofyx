import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};

  // Data Cleaning & Safety
  const rawSkills = Array.isArray(data.skills) ? data.skills : ["React", "Node.js", "Design"];
  const safeSkills = rawSkills.map(skill => (typeof skill === "string" ? skill : skill.name)).filter(Boolean);

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  return (
    <section id="about" className="py-32 px-6" style={{ backgroundColor: bg, color: fg }}>
      <div className="max-w-[90%] mx-auto">
        {/* Editorial Heading */}
        <div className="mb-24 border-t-2 pt-10" style={{ borderColor: fg }}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none"
          >
            <EditableText 
                value={data.aboutTitle || "The Manifesto"} 
                onChange={(v) => setPortfolioData({...data, aboutTitle: v})} 
                readOnly={isReadOnly} 
            />
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Editable Bio Section */}
          <div className="text-xl md:text-3xl font-medium leading-tight">
             <EditableText 
                value={data.bio || "I craft digital experiences."} 
                onChange={(v) => setPortfolioData({...data, bio: v})} 
                readOnly={isReadOnly} 
                multiline
            />
          </div>

          {/* Tech Stack Section */}
          <div>
            <h3
              className="text-sm font-mono uppercase mb-8 border-b pb-2 opacity-50"
              style={{ borderColor: fg }}
            >
              [ <EditableText 
                    value={data.stackTitle || "Tech_Stack"} 
                    onChange={(v) => setPortfolioData({...data, stackTitle: v})} 
                    readOnly={isReadOnly} 
                /> ]
            </h3>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {safeSkills.map((skillName, i) => (
                <motion.span
                  key={i}
                  className="text-xl md:text-3xl font-bold uppercase hover:text-transparent hover:bg-clip-text transition-all cursor-crosshair"
                  style={{
                    WebkitTextStroke: `1px ${fg}`,
                    color: i % 2 === 0 ? fg : "transparent",
                  }}
                >
                  {skillName}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;