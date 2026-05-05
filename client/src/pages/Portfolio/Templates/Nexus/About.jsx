// src/pages/Portfolio/Templates/Pulse/About.jsx

import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../../../context/PortfolioContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Components
import EditableText from "../EditableText";

const About = ({ portfolioData: propData, isReadOnly }) => {
  const { portfolioData: contextData, setPortfolioData } = usePortfolio();
  const data = propData || contextData || {};
  const skills = Array.isArray(data?.skills) ? data.skills : [];

  // Theme Config
  const bg = data.themeBg || "#ffffff";
  const fg = data.themeFont || "#0f172a";
  const accent = data.accentColor || "#2563eb";

  // Defaults
  const defaultTitle = "The Developer Stack";
  const defaultBio = "I specialize in building robust web applications using modern technologies. I transform complex problems into simple, beautiful, and intuitive interface designs.";

  return (
    <section id="about" className="relative py-32 overflow-hidden transition-colors duration-500" style={{ backgroundColor: bg, color: fg }}>
      
      {/* --- Background Continuity Blobs --- */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 pointer-events-none" 
        style={{ backgroundColor: fg }} 
      />
      <div 
        className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none" 
        style={{ backgroundColor: accent }} 
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Section Header */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold inline-block tracking-tight">
              <EditableText
                value={data.aboutTitle || defaultTitle}
                onChange={(val) => setPortfolioData({ ...data, aboutTitle: val })}
                readOnly={isReadOnly}
              />
            </h2>
            <div className="h-1.5 w-24 mx-auto mt-4 rounded-full opacity-20" style={{ backgroundColor: fg }}></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
            
            {/* Left Column: Bio & Profile */}
            <motion.div 
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
              className="p-10 rounded-[2.5rem] border backdrop-blur-xl relative group overflow-hidden flex flex-col"
              style={{ borderColor: `${fg}15`, backgroundColor: `${fg}03` }}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  <i className="fa-solid fa-user-astronaut"></i>
                </div>
                <h3 className="text-3xl font-bold">
                   <EditableText
                      value={data.aboutHeading || "About Me"}
                      onChange={(val) => setPortfolioData({ ...data, aboutHeading: val })}
                      readOnly={isReadOnly}
                   />
                </h3>
              </div>

              <div className="text-lg leading-loose mb-10 font-light" style={{ opacity: 0.8 }}>
                <EditableText
                  value={data.bio || defaultBio}
                  onChange={(val) => setPortfolioData({ ...data, bio: val })}
                  readOnly={isReadOnly}
                  multiline
                />
              </div>

              {/* Action Area: Socials & Resume */}
              <div className="mt-auto flex flex-wrap items-center gap-6 pt-8 border-t border-dashed" style={{ borderColor: `${fg}20` }}>
                
                {/* ⬇️ DOWNLOAD RESUME BUTTON */}
                <div className="flex flex-col gap-2">
                  <a 
                    href={data.cvLink || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                    style={{ backgroundColor: accent, color: "#fff" }}
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                    Download Resume
                  </a>
                  <div className="text-[10px] opacity-40 font-mono px-1">
                    <EditableText
                      value={data.cvLink || "https://your-resume-link.com"}
                      onChange={(val) => setPortfolioData({ ...data, cvLink: val })}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-white/10 hidden sm:block"></div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {[
                    { link: data.linkedin, icon: "fa-linkedin" },
                    { link: data.github, icon: "fa-github" },
                    { link: `mailto:${data.email}`, icon: "fa-envelope" }
                  ].map((social, idx) => (
                    <a 
                      key={idx}
                      href={social.link || "#"} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-12 h-12 rounded-full border flex items-center justify-center text-xl transition-all hover:scale-110 hover:rotate-6 shadow-sm"
                      style={{ 
                        borderColor: `${fg}20`, 
                        color: fg, 
                        backgroundColor: bg,
                        opacity: social.link ? 1 : 0.3 
                      }}
                    >
                      <i className={`fa-brands ${social.icon.includes('envelope') ? 'fa-solid' : ''} ${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Stack & Stats */}
            <div className="flex flex-col gap-8">
              
              {/* Tech Arsenal (Skills) */}
              <motion.div 
                 variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
                 className="p-8 rounded-[2.5rem] border backdrop-blur-xl h-full"
                 style={{ borderColor: `${fg}15`, backgroundColor: `${fg}03` }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                   <i className="fa-solid fa-layer-group" style={{ color: accent }}></i> Tech Arsenal
                </h3>
                <div className="flex flex-wrap gap-2">
                   {skills.length > 0 ? skills.map((s, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 rounded-xl text-sm border font-medium shadow-sm"
                        style={{ backgroundColor: bg, color: fg, borderColor: `${fg}10` }}
                      >
                         {typeof s === 'string' ? s : s.name}
                      </span>
                   )) : (
                     <span className="italic opacity-50">Add skills to showcase...</span>
                   )}
                </div>
              </motion.div>

              {/* Stats Block */}
              <motion.div 
                 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                 className="p-8 rounded-[2.5rem] flex items-center justify-around shadow-xl border border-white/10"
                 style={{ backgroundColor: fg, color: bg }}
              >
                 <div className="text-center">
                    <h2 className="text-5xl font-bold mb-1" style={{ color: accent }}>
                       <EditableText
                          value={data.yearsExp || "3+"}
                          onChange={(val) => setPortfolioData({ ...data, yearsExp: val })}
                          readOnly={isReadOnly}
                       />
                    </h2>
                    <p className="text-xs uppercase tracking-widest opacity-70">Years Exp.</p>
                 </div>
                 <div className="w-[1px] h-12 bg-white/20"></div>
                 <div className="text-center">
                    <h2 className="text-5xl font-bold mb-1" style={{ color: accent }}>
                       {data.projects ? data.projects.length : "0"}+
                    </h2>
                    <p className="text-xs uppercase tracking-widest opacity-70">Projects</p>
                 </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;