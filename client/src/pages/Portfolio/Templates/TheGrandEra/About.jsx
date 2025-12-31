import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Reuse the same logic for About text
const WordReveal = ({ text, className }) => {
  // ✅ SAFETY CHECK: If 'text' is an object (bad data), force it to a string
  const safeText = (typeof text === 'string') ? text : "Developer & Creator";
  
  const words = safeText.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const About = ({ portfolioData: propData }) => {
  const { portfolioData: contextData } = usePortfolio();
  const data = propData || contextData || {};
  
  // =========================================================
  // 🛡️ DATA CLEANING ZONE (Fixes the Crash)
  // =========================================================
  
  // 1. Clean Skills: Filter out any object that looks like Experience data
  const rawSkills = Array.isArray(data.skills) ? data.skills : ["React", "Node.js", "Design", "WebGL"];
  
  const safeSkills = rawSkills.map(skill => {
     // If it's a simple string, keep it
     if (typeof skill === "string") return skill;
     // If it's a valid skill object, use the name
     if (skill && skill.name && !skill.company) return skill.name;
     // If it's the BAD DATA (Experience object), ignore it
     return null; 
  }).filter(Boolean); // Remove nulls

  // 2. Clean Bio: Ensure it's not an object
  const safeBio = typeof data.bio === "string" ? data.bio : "I craft digital experiences.";

  // =========================================================

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  return (
    <section
      id="about"
      className="py-32 px-6"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="max-w-[90%] mx-auto">
        {/* Editorial Heading */}
        <div className="mb-24 border-t-2 pt-10" style={{ borderColor: fg }}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none"
          >
            The <span style={{ color: accent }}>Manifesto</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Bio Section */}
          <div>
            <WordReveal
              text={safeBio}
              className="text-2xl md:text-4xl font-medium leading-tight"
            />
          </div>

          {/* Tech Stack Section */}
          <div>
            <h3
              className="text-sm font-mono uppercase mb-8 border-b pb-2 opacity-50"
              style={{ borderColor: fg }}
            >
              [ Tech_Stack ]
            </h3>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {safeSkills.map((skillName, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-3xl md:text-5xl font-bold uppercase hover:text-transparent hover:bg-clip-text transition-all cursor-crosshair"
                  style={{
                    WebkitTextStroke: `1px ${fg}`,
                    color: i % 2 === 0 ? fg : "transparent",
                  }}
                >
                  {/* NOW SAFE: This is guaranteed to be a string */}
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