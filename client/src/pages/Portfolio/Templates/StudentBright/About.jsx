import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";

// Reuse the same logic for About text
const WordReveal = ({ text, className }) => {
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
  
  // --- SAFE DATA HANDLING ---
  const safeBio = typeof data.bio === "string" ? data.bio : "I craft digital experiences that redefine interaction.";
  
  // Calculate Experience Years/Count safely
  let experienceStat = "N/A";
  if (Array.isArray(data.experience)) {
      experienceStat = `${data.experience.length} ROLES`;
  } else if (typeof data.experience === 'string') {
      experienceStat = data.experience;
  }

  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#000000";
  const accent = data.accentColor || "#2563eb";

  return (
    <section
      id="about"
      className="py-32 px-6 border-b-2"
      style={{ backgroundColor: bg, color: fg, borderColor: fg }}
    >
      <div className="max-w-[95%] mx-auto">
        
        {/* Editorial Heading */}
        <div className="mb-24 pt-10">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]"
          >
            The <br/> <span style={{ color: accent }}>Manifesto</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t-2 pt-12" style={{ borderColor: fg }}>
          
          {/* Left: Bio */}
          <div className="lg:col-span-8">
            <WordReveal
              text={safeBio}
              className="text-2xl md:text-5xl font-bold leading-tight uppercase"
            />
          </div>

          {/* Right: Stats (Brutalist Box) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[300px] border-2 p-8 relative" style={{ borderColor: fg }}>
             <div className="absolute top-4 right-4 animate-spin-slow">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L12 22"></path>
                    <path d="M2 12L22 12"></path>
                    <path d="M4.93 4.93L19.07 19.07"></path>
                    <path d="M19.07 4.93L4.93 19.07"></path>
                </svg>
             </div>

             <div>
                <h3 className="font-mono text-sm uppercase opacity-50 mb-2">[ Status ]</h3>
                <p className="text-xl font-bold">AVAILABLE FOR HIRE</p>
             </div>

             <div>
                <h3 className="font-mono text-sm uppercase opacity-50 mb-2">[ History ]</h3>
                <p className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: accent }}>
                    {experienceStat}
                </p>
             </div>

             <div>
                <h3 className="font-mono text-sm uppercase opacity-50 mb-2">[ Education ]</h3>
                <p className="text-lg font-bold uppercase">{data?.education || "University of Life"}</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;